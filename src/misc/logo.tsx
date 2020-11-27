import { RendererLike } from 'render-jsx';
import { style } from '../util/style';


const classes = style({
  logo: {
    width: 128
  }
});

export function Logo(_: unknown, renderer: RendererLike<Node>) {
  return <img class={classes().logo} src='./coding.blog.svg'/>;
}
