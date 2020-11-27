import { RendererLike } from 'render-jsx';
import { expr } from 'callbag-expr';

import { NavModule, NavService } from './service';
import { Conditional } from 'callbag-jsx';

export interface RouteProps {
  path: NavModule;
  comp: () => Node;
}

export function Route(props: RouteProps, renderer: RendererLike<Node>) {
  return <Conditional if={expr($ => $(NavService.instance.nav) === props.path)} then={props.comp}/>;
}
