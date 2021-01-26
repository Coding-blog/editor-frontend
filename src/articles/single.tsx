import cloneDeep from 'lodash.clonedeep';
import { ref } from 'render-jsx/common';
import { pipe, map, flatten, fromPromise, filter, subscribe, debounce, expr, tap } from 'callbag-common';
import { state } from 'callbag-state';
import { Conditional, List, TrackerComponentThis } from 'callbag-jsx';
import { RendererLike } from 'render-jsx';
import {
  Article, getExternalArticle, getSuggestedTags, createArticle, updateArticle, deleteArticle, Comment
} from '@api/editor-backend';

import { Header } from '../misc/header';
import { Buttons } from '../misc/buttons';
import { changed, ensurePrefix, isRequired, isUrl, snapshot, valid } from '../util/forms';
import { style } from '../util/style';
import { authToken } from '../auth/service';
import { TagInput } from '../misc/tag-input';
import { DateTimeInput } from '../misc/date-time-input';
import { IconButton } from '../misc/icon-button';
import { OverlayAttached } from '../misc/overlay/attached';
import { Loading } from '../misc/loading';
import { noop } from '../util/noop';


const classes = style({
  image: { maxWidth: '100%', borderRadius: 8 },
  comment: { marginBottom: 8, position: 'relative', '& button': { position: 'absolute', top: 8, right: 8, } },
  commentDate: { fontSize: 12 },
});

export interface SingleProps {
  article?: Article;
  ondelete?: () => void;
}

export function Single(this: TrackerComponentThis,
  props: SingleProps, renderer: RendererLike<Node>) {
  const urlInput = ref<HTMLElement>();
  const article = state<Article>(cloneDeep(props.article) || {
    status: 'submitted',
    url: '',
    title: '',
    submissionDate: new Date(),
    publishingDate: new Date(),
    description: '',
    image: '',
    tags: [],
    comments: [],
  });

  const saving = state(false);
  const autofilling = state(false);
  const comment = state('');

  const isValid = valid(article, { url: [isRequired, isUrl], title: isRequired, description: isRequired });
  const hasChanged = changed(article, () => props.article, saving);
  const existing = expr($ => ($(saving) && false) || !!props.article);

  this.track(ensurePrefix(article.sub('url'), 'https://'));

  this.track(pipe(
    article.sub('url'),
    filter(u => !!u && isUrl(u)),
    filter(() => !props.article),
    tap(() => autofilling.set(true)),
    debounce(700),
    map(url => fromPromise((async() => {
      try { return await getExternalArticle(authToken()!, url!); }
      catch { return null; }
    })())),
    flatten,
    tap(() => autofilling.set(false)),
    subscribe(_article => { if (_article) { article.set(_article); }})
  ));

  const save = () => {
    saving.set(true);
    (props.article?updateArticle:createArticle)(authToken()!, article.get()!)
      .then(() => props.article = snapshot(article))
      .catch(() => alert('Could not save!'))
      .finally(() => saving.set(false));
  };

  const sendComment = () => {
    const comments = article.get().comments || [];
    comments.push({ text: comment.get(), date: new Date() });
    comment.set('');
    article.sub('comments').set(comments);
    save();
  };

  const deleteComment = (c: Comment) => {
    article.sub('comments').set(article.get().comments?.filter(_ => _ !== c));
    save();
  };

  const trash = () => {
    saving.set(true);
    deleteArticle(authToken()!, article.get())
      .then(() => props.ondelete ? props.ondelete() : noop)
      .catch(() => alert('Could not delete!'))
      .finally(() => saving.set(false));
  };

  return <>
    <Header>{expr($ => $(existing) ? 'Article' : 'New Article')}</Header>

    <label>URL</label>
    <input type='text' _state={article.sub('url')} _ref={urlInput}
      placeholder='The link must be https. Fill this to auto-fill other fields.'/>
    <OverlayAttached element={urlInput} show={autofilling}
      attachment={box => ({top: box.top + 4, left: box.right - 32})} repos={autofilling}>
      <Loading/>
    </OverlayAttached>

    <label>General Information</label>
    <input type='text' _state={article.sub('title')} placeholder='Title'/>
    <textarea _state={article.sub('description')} placeholder='Description'/>
    <TagInput _state={article.sub('tags')}
      placeholder='Tags'
      suggestions={text => fromPromise(getSuggestedTags(authToken()!, text))}
    />

    <label>Publishing Date</label>
    <DateTimeInput _state={article.sub('publishingDate')} placeholder='Publishing Date' />

    <label>Approval Status</label>
    <div style={{display: 'flex', gap: '8px' }}>
      <select _state={article.sub('status')}>
        <option value='submitted'>Submitted</option>
        <option value='approved'>Approved</option>
      </select>
      <IconButton icon='./assets/icon-link.svg'
        disabled={expr($ => !isUrl($(article)?.url || ''))}
        onclick={() => {
          window.open(article.get()!.url, '_blank');
        }}
      />
    </div>

    <label>Image</label>
    <input type='text' _state={article.sub('image')} placeholder='URL for the article image'/>
    <img class={classes().image} src={pipe(article.sub('image'), debounce(200), map(s => s || ''))}/>

    <hr/>

    <Buttons>
      <Conditional if={existing} then={() => <IconButton icon='./assets/icon-trash.svg' onclick={trash}/>}/>
      <button disabled={expr($ => !($(isValid) && $(hasChanged) && !$(saving)))} onclick={save}>
        {
          expr($ => $(saving) ?
            ($(existing) ? 'Updating ...' : 'Saving ...') :
            ($(existing) ? 'Update' : 'Save'))
        }
      </button>
    </Buttons>

    <hr/>

    <Conditional if={existing} then={() => <>
      <h1>Comments</h1>
      <List of={article.sub('comments')} each={c =>
        <div class={classes().comment}>
          <div class={classes().commentDate}>{expr($ => $(c)?.date?.toDateString())}</div>
          {c.sub('text')}
          <IconButton icon='./assets/icon-trash.svg' onclick={() => deleteComment(c.get()!)}/>
        </div>}
      />
      <textarea _state={comment} placeholder='Type some comment ...'></textarea>
      <Buttons>
        <button disabled={expr($ => $(saving) || !$(comment))} onclick={sendComment}>Send</button>
      </Buttons>
    </>}/>
  </>;
}
