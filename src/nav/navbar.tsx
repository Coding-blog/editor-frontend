import { RendererLike } from 'render-jsx';

import { style } from '../util/style';
import { NavIconButton } from './nav-icon-button';


const classes = style({
  navbar: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: 128,
    left: 44,

    '&>button': {
      marginBottom: 8
    }
  }
});


export function NavBar(_: unknown, renderer: RendererLike<Node>) {
  return <div class={classes().navbar}>
    <NavIconButton icon='./assets/icon-article.svg' title='Articles' path='articles/unapproved' match='articles/*'/>
    <NavIconButton icon='./assets/icon-issues.svg' title='Issues' path='issues/draft' match='issues/*'/>
    <NavIconButton icon='./assets/icon-reader.svg' title='Readers' path='readers/' match='readers/*'/>
  </div>;
}
