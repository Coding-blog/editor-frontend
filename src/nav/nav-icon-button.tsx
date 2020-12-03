import { RendererLike } from 'render-jsx';
import { IconButton } from '../misc/icon-button';
import { navigate, match } from './service';


export interface NavIconButtonProps {
  path: string;
  icon: string;
  title: string;
  match?: string;
}

export function NavIconButton(props: NavIconButtonProps, renderer: RendererLike<Node>) {
  let _match = props.match || props.path;
  if (_match.startsWith('../')) {
    _match = '**/' + _match.substr(3);
  }

  return <IconButton icon={props.icon} title={props.title}
    disabled={match(_match)}
    onclick={() => navigate(props.path)}/>;
}
