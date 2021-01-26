import { Article, Issue, createIssue, updateIssue, deleteIssue, getIssueArticles, getSuggestedArticles, getIssuesByReader, sendIssue } from '@api/editor-backend';
import cloneDeep from 'lodash.clonedeep';
import { expr, filter, flatten, fromPromise, map, pipe, subscribe } from 'callbag-common';
import { state } from 'callbag-state';
import { RendererLike } from 'render-jsx';

import { Header } from '../misc/header';
import { open } from '../misc/overlay/dialog';
import { SelectReader } from '../readers/select';
import { Conditional, TrackerComponentThis } from 'callbag-jsx';
import { Buttons } from '../misc/buttons';
import { SelectArticle } from '../articles/select';
import { IconButton } from '../misc/icon-button';
import { changed, isEmail, isMinLength, isRequired, snapshot, valid } from '../util/forms';
import { ArticleList } from '../articles/list';
import { ArticlePreview } from './article-preview';
import { authToken } from '../auth/service';
import { noop } from '../util/noop';
import { Q } from '../nav/service';


export interface SingleProps {
  issue?: Issue;
  ondelete?: () => void;
}


export function Single(this: TrackerComponentThis, props: SingleProps, renderer: RendererLike<Node>) {
  const issue = state<Issue>(cloneDeep(props.issue) || {
    title: '',
    reader: Q().get()?.for || '',
    date: new Date(),
    articles: [],
    status: 'draft',
  });

  let issues: Issue[] = [];

  const articles = state<Article[]>([]);

  if (props.issue) {
    getIssueArticles(authToken()!, props.issue).then(list => articles.set(list));
  }

  this.track(pipe(
    articles,
    map(list => list.map(a => a.url)),
    subscribe(list => issue.sub('articles').set(list))
  ));

  this.track(pipe(
    issue.sub('reader'),
    filter(reader => !!reader),
    map(reader => fromPromise(getIssuesByReader(authToken()!, reader!))),
    flatten,
    subscribe(list => {
      issues = list;
      if (!issue.sub('title').get()) {
        issue.sub('title').set('Personal Issue #' + (issues.length + 1));
      }
    })
  ));

  const saving = state(false);
  const autofilling = state(false);
  const existing = expr($ => ($(saving) && false) || !!props.issue);
  const isValid = valid(issue, {
    title: isRequired,
    reader: [isEmail, isRequired],
    articles: [isRequired, isMinLength(1)]
  });
  const hasChanged = changed(issue, () => props.issue, saving);

  const pickReader = () => {
    if (issue.get().status !== 'sent') {
      open(<SelectReader pick={reader => issue.sub('reader').set(reader.email)}/>, renderer);
    }
  };

  const addArticle = (article: Article) => {
    const list = articles.get()!;
    if (!list.find(a => a.url === article.url)) {
      articles.set(list.concat(article));
    }
  };

  const removeArticle = (article: Article) => {
    articles.set(articles.get()!.filter(a => a.url !== article.url));
  };

  const pickArticle = () => {
    open(
      <SelectArticle
        pick={addArticle}
        filter={article =>
          !issues.some(i => i.articles.includes(article.url))
          && !issue.get().articles.includes(article.url)
        }
      />,
      renderer
    );
  };

  const save = () => {
    saving.set(true);
    (props.issue ? updateIssue : createIssue)(authToken()!, issue.get())
      .then(() => props.issue = snapshot(issue))
      .catch(() => alert('Could not save!'))
      .finally(() => saving.set(false));
  };

  const trash = () => {
    saving.set(true);
    deleteIssue(authToken()!, issue.get())
      .then(() => props.ondelete ? props.ondelete() : noop)
      .catch(() => alert('Could not delete!'))
      .finally(() => saving.set(false));
  };

  const autofill = () => {
    autofilling.set(true);
    getSuggestedArticles(authToken()!, issue.get())
      .then(suggestions => articles.set(suggestions))
      .catch(() => alert('Failed to autofill issue!'))
      .finally(() => autofilling.set(false))
    ;
  };

  const send = () => {
    saving.set(true);
    sendIssue(authToken()!, issue.get()!)
      .then(() => {
        issue.sub('status').set('sent');
        props.issue = snapshot(issue);
      })
      .catch(() => alert('Unable to send issue!'))
      .finally(() => saving.set(false))
    ;
  };

  return <>
    <Header>{expr($ => $(existing) ? 'Issue' : 'New Issue')}</Header>

    <label>Reader</label>
    <input type='text' _state={issue.sub('reader')}
      readonly={expr($ => $(issue)?.status === 'sent')}
      placeholder="Reader's email address" onclick={pickReader}/>

    <label>Title</label>
    <input type='text' _state={issue.sub('title')}
      readonly={expr($ => $(issue)?.status === 'sent')}
      placeholder="Issue's title"/>

    <label>Status</label>
    <select _state={issue.sub('status')}>
      <option value='draft'>Draft</option>
      <option value='sent'>Sent</option>
    </select>
    <br/>
    <Buttons>
      <IconButton icon='./assets/icon-magic.svg'
        disabled={expr($ => !$(issue)?.reader || $(issue)?.status === 'sent' || $(autofilling, false))}
        onclick={autofill}/>
      <IconButton icon='./assets/icon-new.svg'
        disabled={expr($ => $(issue)?.status === 'sent')}
        onclick={pickArticle}/>
    </Buttons>
    <Conditional if={expr($ => $(articles)?.length === 0)} then={() => <span>No articles picked.</span>}/>
    <ArticleList articles={articles}
      pick={article => {
        if (issue.get().status !== 'sent') {
          open(<ArticlePreview article={article} ondelete={() => removeArticle(article)}/>, renderer);
        }
      }}
    />

    <hr/>

    <Buttons>
      <Conditional if={existing} then={() => <>
        <IconButton icon='./assets/icon-trash.svg'
          disabled={expr($ => $(issue)?.status === 'sent')}
          onclick={trash}/>
        <IconButton icon='./assets/icon-send.svg'
          disabled={expr($ => $(issue)?.status === 'sent' || $(saving, false))}
          onclick={send}/>
      </>}/>
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
