import { RendererLike } from 'render-jsx';

import { style } from '../util/style';


const classes = style({
  toolbar: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: 128, right: 44,

    '&>button': {
      marginBottom: 8
    }
  }
});


export function Toolbar(_: unknown, renderer: RendererLike<Node>, content: Node[]) {
  return <div class={classes().toolbar}>
    {content}
  </div>;
}
