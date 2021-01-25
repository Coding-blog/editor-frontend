import { RendererLike } from 'render-jsx';
import { Article, getSuggestedTags } from '@api/editor-backend';
import { State, state, StateLike } from 'callbag-state';
import { pipe, subscribe, expr, fromPromise, fromEvent, Source, of } from 'callbag-common';
import { Conditional, List, TrackerComponentThis } from 'callbag-jsx';

import { Header } from '../misc/header';
import { Card } from '../misc/card';
import { style } from '../util/style';
import { trim } from '../util/trim';
import { TagInput } from '../misc/tag-input';
import { authToken } from '../auth/service';
import { Tag } from '../misc/tag';
import { noop } from '../util/noop';
import { Spinner } from '../misc/spinner';

const classes = style({
  columns: {
    display: 'flex',
    gap:16,
  },
  column: {
    display: 'flex',
    gap: 16,
    flexDirection: 'column',
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: 'calc(50% - 8px)',
  },
  image: {
    maxHeight: 200,
    width: '100%',
    objectFit: 'cover',
  },
  center: {
    left: 'calc(50% - 40px)',
  },
});

export interface ArticleCardProps {
  article: StateLike<Article>;
  pick?: (article: Article) => void;
  tagPick?: (tag: string) => void;
}

export function ArticleCard(props: ArticleCardProps, renderer: RendererLike<Node>) {

  return <Card title={props.article.sub('title')}
    image={<Conditional
      if={props.article.sub('image')}
      then={() => <img class={classes().image} src={props.article.sub('image')}/>}/>
    }
    subtitle={expr($ => $(props.article)?.publishingDate.toDateString())}
    onclick={props.pick ? () => props.pick!(props.article.get()!) : noop}>
    {trim(props.article.sub('description'))}
    <br/>
    <div style={{display: 'flex'}}>
      <List of={props.article.sub('tags')} each={tag =>
        <Tag onclick={props.tagPick ? (event) => {
          event?.stopPropagation();
          props.tagPick!(tag.get()!);
        }: noop}>{tag}</Tag>}
      />
    </div>
  </Card>;
}

export interface ArticleListProps {
  articles: Source<Article[]>;
  title?: string;
  isLoading?: State<boolean>;
  pick?: (article: Article) => void;
  loadMore?: () => void;
  tags?: State<string[]>;
}

export function ArticleList(
  this: TrackerComponentThis,
  props: ArticleListProps,
  renderer: RendererLike<Node>
) {
  const handleScroll = () => {
    if (window.scrollY + window.outerHeight >= document.body.offsetHeight - 5) {
      if(props.loadMore) {
        props.loadMore();
      }
    }
  };

  this.track(pipe(
    fromEvent(window, 'scroll', { passive: true }),
    subscribe(handleScroll)
  ));

  const tags = props.tags ?? state<string[]>([]);

  const addTag = (tag: string) => {
    if (!tags.get().includes(tag)) {
      tags.sub(tags.get().length).set(tag);
    }
  };

  return <>
    {
      props.title
        ? <>
          <Header>{props.title}</Header>
          <TagInput _state={tags} placeholder='Filter by tags ...'
            suggestions={text => fromPromise(getSuggestedTags(authToken()!, text))}/>
          <br/>
        </>
        : ''
    }
    <div class={classes().columns}>
      <div class={classes().column}>
        <List of={props.articles} each={(article, index) =>
          index % 2 === 0 ?
            <ArticleCard article={article} pick={props.pick} tagPick={addTag}/>
            : <></>
        }/>
      </div>
      <div class={classes().column}>
        <List of={props.articles} each={(article, index) =>
          index % 2 === 1 ?
            <ArticleCard article={article} pick={props.pick} tagPick={addTag}/>
            : <></>
        }/>
      </div>
    </div>
    <Conditional if={props.isLoading ?? of(false)}
      then={() => <Spinner class={classes().center}/>}
    ></Conditional>
  </>;
}
