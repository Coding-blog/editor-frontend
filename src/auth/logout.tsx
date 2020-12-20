import { RendererLike } from 'render-jsx';
import { IconButton } from '../misc/icon-button';
import { AuthService } from './service';


export function Logout(_: unknown, renderer: RendererLike<Node>) {
  return <IconButton icon='./assets/icon-logout.svg' title='Logout' onclick={() => AuthService.instance.logout()}/>;
}
