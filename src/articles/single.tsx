import cloneDeep from 'lodash.clonedeep';
import { pipe, map, flatten, fromPromise, filter, subscribe, debounce, expr } from 'callbag-common';
import { state } from 'callbag-state';
import { Conditional, TrackerComponentThis } from 'callbag-jsx';
import { RendererLike } from 'render-jsx';
import {
  Article, getExternalArticle, getSuggestedTags, createArticle, updateArticle, deleteArticle
} from '@api/editor-backend';

import { Header } from '../misc/header';
import { Buttons } from '../misc/buttons';
import { changed, ensurePrefix, isRequired, isUrl, snapshot, valid } from '../util/forms';
import { style } from '../util/style';
import { authToken } from '../auth/service';
import { TagInput } from '../misc/tag-input';
import { DateTimeInput } from '../misc/date-time-input';
import { IconButton } from '../misc/icon-button';


const classes = style({
  image: { maxWidth: '100%', borderRadius: 8 },
});

export interface SingleProps {
  article?: Article;
  ondelete?: () => void;
}

export function Single(this: TrackerComponentThis,
  props: SingleProps, renderer: RendererLike<Node>) {
  const article = state<Article>(cloneDeep(props.article) || {
    status: 'submitted',
    url: '',
    title: '',
    submissionDate: new Date(),
    publishingDate: new Date(),
    description: '',
    image: '',
    tags: [],
  });

  this.track(pipe(article, subscribe(v => console.log(v.title))));

  const saving = state(false);
  const isValid = valid(article, { url: [isRequired, isUrl], title: isRequired, description: isRequired });
  const hasChanged = changed(article, () => props.article, saving);
  const existing = expr($ => ($(saving) && false) || !!props.article);

  this.track(ensurePrefix(article.sub('url'), 'https://'));

  this.track(pipe(
    article.sub('url'),
    debounce(700),
    filter(isUrl),
    filter(() => !props.article),
    map(url => fromPromise((async() => {
      try { return await getExternalArticle(authToken()!, url!); }
      catch { return null; }
    })())),
    flatten, subscribe(_article => { if (_article) { article.set(_article); }})
  ));

  const save = () => {
    saving.set(true);
    (props.article?updateArticle:createArticle)(authToken()!, article.get()!)
      .then(() => props.article = snapshot(article))
      .catch(() => alert('Could not save!'))
      .finally(() => saving.set(false));
  };

  const trash = () => {
    saving.set(true);
    deleteArticle(authToken()!, article.get())
      .then(() => props.ondelete ? props.ondelete() : void 0)
      .catch(() => alert('Could not delete!'))
      .finally(() => saving.set(false));
  };

  return <>
    <Header>{expr($ => $(existing) ? 'Article' : 'New Article')}</Header>

    <label>URL</label>
    <input type='text' _state={article.sub('url')}
      placeholder='The link must be https. Fill this to auto-fill other fields.'/>

    <label>General Information</label>
    <input type='text' _state={article.sub('title')} placeholder='Title'/>
    <textarea _state={article.sub('description')} placeholder='Description'/>
    <TagInput _state={article.sub('tags')}
      placeholder='Tags'
      suggestions={text => fromPromise(getSuggestedTags(authToken()!, text))}
    />

    <label>Publishing Date</label>
    <DateTimeInput _state={article.sub('publishingDate')} placeholder='Publishing Date' />

    <label>Image</label>
    <input type='text' _state={article.sub('image')} placeholder='URL for the article image'/>
    <img class={classes().image} src={pipe(article.sub('image'), debounce(200), map(s => s || ''))}/>

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
  </>;
}
