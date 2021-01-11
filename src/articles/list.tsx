import { RendererLike } from 'render-jsx';
import { Article, getSuggestedTags } from '@api/editor-backend';
import { state, StateLike } from 'callbag-state';
import { expr, fromPromise, Source } from 'callbag-common';
import { Conditional, List } from 'callbag-jsx';

import { Header } from '../misc/header';
import { Card } from '../misc/card';
import { style } from '../util/style';
import { trim } from '../util/trim';
import { TagInput } from '../misc/tag-input';
import { authToken } from '../auth/service';
import { Tag } from '../misc/tag';
import { noop } from '../util/noop';

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
  pick?: (article: Article) => void;
}

export function ArticleList(props: ArticleListProps, renderer: RendererLike<Node>) {
  const tags = state<string[]>([]);
  const articles = expr($ => {
    if ($(tags)?.length === 0) { return $(props.articles); }
    else { return $(props.articles)?.filter(article => $(tags)?.every(tag => article.tags?.includes(tag))); }
  });

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
        <List of={articles} each={(article, index) =>
          index % 2 === 0 ?
            <ArticleCard article={article} pick={props.pick} tagPick={addTag}/>
            : <></>
        }/>
      </div>
      <div class={classes().column}>
        <List of={articles} each={(article, index) =>
          index % 2 === 1 ?
            <ArticleCard article={article} pick={props.pick} tagPick={addTag}/>
            : <></>
        }/>
      </div>
    </div>
  </>;
}
