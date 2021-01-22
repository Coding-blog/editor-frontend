import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';
import { state } from 'callbag-state';
import sub from 'callbag-subscribe';

import { style } from '../util/style';
import { Article, getApprovedArticlesByTags, getSuggestedTags } from '@api/editor-backend';
import { Dialog, DialogControls } from '../misc/overlay/dialog';
import { expr, fromPromise, pipe, subscribe } from 'callbag-common';
import { authToken } from '../auth/service';
import { TagInput } from '../misc/tag-input';
import { List } from 'callbag-jsx';
import { Buttons } from '../misc/buttons';


const classes = style({
  articles: {
    height: 256,
    margin: '16px 0',
    overflow: 'auto',
    '&>div': {
      borderBottom: '1px dashed #e0e0e0',
      cursor: 'pointer',
      transition: 'background .15s',
      padding: 8,
      '&:hover': {
        background: '#eeeeee',
        borderRadius: 3,
      }
    }
  }
});


export interface SelectArticleProps {
  pick: (article: Article) => void;
  filter?: (article: Article) => boolean;
}


export function SelectArticle(props: SelectArticleProps, renderer: RendererLike<Node>) {
  const controls = ref<DialogControls>();

  const tags = state<string[]>([]);
  const all = state<Article[]>([]);

  // Let's make sure we're loading the correct articles
  sub((newTags:string[]) => {
    pipe(
      fromPromise(getApprovedArticlesByTags(authToken()!, newTags)),
      subscribe((newArticles) => {
        all.set(newArticles);
      })
    );
  })(tags);

  const articles = expr($ => {
    const list = props.filter ? $(all)?.filter(props.filter) : $(all);

    return list;
  });


  const pick = (article: Article) => {
    controls.$.close();
    props.pick(article);
  };

  return <Dialog controls={controls}>
    <TagInput _state={tags} placeholder='Filter by tags ...'
      suggestions={text => fromPromise(getSuggestedTags(authToken()!, text))}/>

    <div class={classes().articles}>
      <List of={articles} each={article =>
        <div onclick={() => pick(article.get()!)}>
          {article.sub('title')}
        </div>
      }/>
    </div>

    <hr/>

    <Buttons>
      <button onclick={() => controls.$.close()}>Cancel</button>
    </Buttons>
  </Dialog>;
}
