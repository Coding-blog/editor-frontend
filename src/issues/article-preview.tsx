import { Article } from '@api/editor-backend';
import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';

import { Buttons } from '../misc/buttons';
import { IconButton } from '../misc/icon-button';
import { Dialog, DialogControls } from '../misc/overlay/dialog';
import { Tag } from '../misc/tag';
import { navigate } from '../nav/service';
import { style } from '../util/style';


const classes = style({
  hero: {
    margin: -16,
    maxHeight: 256,
    width: 'calc(100% + 32px)',
    objectFit: 'cover',
  },
  date: {
    marginTop: -24,
    display: 'block'
  }
});


export interface ArticlePreviewProps {
  article: Article;
  ondelete: () => void;
}


export function ArticlePreview(props: ArticlePreviewProps, renderer: RendererLike<Node>) {
  const controls = ref<DialogControls>();

  return <Dialog controls={controls}>
    { props.article.image ? <img class={classes().hero} src={props.article.image}/> : ''}
    <h2>{props.article.title}</h2>
    <small class={classes().date}>{props.article.publishingDate.toDateString()}</small>
    <p>
      {props.article.description}
    </p>
    <div style={{display: 'flex'}}>
      {props.article.tags?.map(tag => <Tag>{tag}</Tag>)}
    </div>
    <hr/>
    <Buttons>
      <IconButton icon='./assets/icon-link.svg' onclick={() => window.open(props.article.url, '_blank')}/>
      <IconButton icon='./assets/icon-edit.svg' onclick={() => {
        navigate('articles/:url/edit', { url: props.article.url });
        controls.$.close();
      }}/>
      <button onclick={() => {
        props.ondelete();
        controls.$.close();
      }}>Remove</button>
    </Buttons>
  </Dialog>;
}
