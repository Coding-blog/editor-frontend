import { Conditional } from 'callbag-jsx';
import { RendererLike } from 'render-jsx';
import { Logout } from '../auth/logout';
import { AuthService } from '../auth/service';
import { style } from '../util/style';
import { Logo } from './logo';


const classes = style({
  header: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    margin: '0 -136px',
    paddingRight: 44,
  }
});

export function Header(_: {}, renderer: RendererLike<Node>, content: Node[]) {
  return <div class={classes().header}>
    <Logo/>
    <div style='flex-grow: 1'>{content}</div>
    <Conditional if={AuthService.instance.loggedIn} then={() => <Logout/>}/>
  </div>;
}
