import { RendererLike } from 'render-jsx';
import { expr } from 'callbag-expr';

import { IconButton } from '../misc/icon-button';
import { NavService } from './service';
import { style } from '../util/style';


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
    <IconButton icon='/assets/icon-article.svg' title='Articles'
      disabled={expr($ => $(NavService.instance.nav) === 'articles')}
      onclick={() => NavService.instance.navigate('articles')}/>
    <IconButton icon='/assets/icon-issues.svg' title='Issues'
      disabled={expr($ => $(NavService.instance.nav) === 'issues')}
      onclick={() => NavService.instance.navigate('issues')}/>
    <IconButton icon='/assets/icon-reader.svg' title='Readers'
      disabled={expr($ => $(NavService.instance.nav) === 'readers')}
      onclick={() => NavService.instance.navigate('readers')}/>
  </div>;
}
