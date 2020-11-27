import { pipe, map, flatten, filter, fromPromise, subscribe, debounce, expr } from 'callbag-common';
import { state } from 'callbag-state';
import { TrackerComponentThis } from 'callbag-jsx';
import { RendererLike } from 'render-jsx';
import { Article, getExternalArticle, getSuggestedTags } from '@api/editor-backend';

import { Header } from '../misc/header';
import { Buttons } from '../misc/buttons';
import { changed, required, valid } from '../util/forms';
import { style } from '../util/style';
import { AuthService } from '../auth/service';
import { TagInput } from '../misc/tag-input';
import { ensureHttps, isHttps, isURL } from './util';
import { DateInput } from '../misc/date-input';


const classes = style({
  image: { maxWidth: '100%', borderRadius: 8 },
});

export interface SingleProps {
  article?: Article;
}

export function Single(this: TrackerComponentThis,
  props: SingleProps, renderer: RendererLike<Node>) {
  const article = state<Article>(props.article || {
    status: 'submitted',
    url: '',
    title: '',
    submissionDate: new Date(),
    publishingDate: new Date(),
    description: '',
    image: '',
    tags: [],
  });

  const isValid = valid(article, { url: required, title: required, description: required });
  const hasChanged = changed(article, props.article);

  this.track(pipe(article.sub('url'), subscribe(u => {
    if (u && !isHttps(u)) {
      setTimeout(() => article.sub('url').set(ensureHttps(u)), 1);
    }
  })));

  this.track(pipe(
    article.sub('url'),
    debounce(700),
    filter(url => !!url && isURL(url)),
    map(url => fromPromise((async() => {
      try { return await getExternalArticle(AuthService.instance.token.get()!, url!); }
      catch { return null; }
    })())),
    flatten, subscribe(_article => { if (_article) { article.set(_article); }})
  ));

  const save = () => {
    article.sub('publishingDate').set(new Date());
  };

  return <>
    <Header>{props.article ? 'Article' : 'New Article'}</Header>

    <label>URL</label>
    <input type='text' _state={article.sub('url')} placeholder='The link must be https. Fill this to auto-fill other fields.'/>

    <label>General Information</label>
    <input type='text' _state={article.sub('title')} placeholder='Title'/>
    <textarea _state={article.sub('description')} placeholder='Description'/>
    <TagInput _state={article.sub('tags')}
      placeholder='Tags'
      suggestions={text => fromPromise(getSuggestedTags(AuthService.instance.token.get()!, text))}
    />

    <label>Publishing Date</label>
    <DateInput _state={article.sub('publishingDate')} placeholder='Publishing Date'/>

    <label>Image</label>
    <input type='text' _state={article.sub('image')} placeholder='URL for the article image'/>
    <img class={classes().image} src={pipe(
      article.sub('image'),
      debounce(200),
      map(s => s || '')
    )}/>
    <Buttons>
      <button disabled={expr($ => !($(isValid) && $(hasChanged)))} onclick={save}>Save</button>
    </Buttons>
  </>;
}
