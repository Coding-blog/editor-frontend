import { RendererLike } from 'render-jsx';
import { style } from '../util/style';


const classes = style({
  buttons: {
    textAlign: 'right',
    margin: '8px 0',

    '& button': {
      marginLeft: 8,
    }
  }
});


export function Buttons(_: unknown, renderer: RendererLike<Node>, content: Node[]) {
  return <div class={classes().buttons}>
    {content}
  </div>;
}
