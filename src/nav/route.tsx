import { RendererLike } from 'render-jsx';

import { match, NavService, RouteParams } from './service';
import { Conditional } from 'callbag-jsx';

export interface RouteProps {
  path: string;
  comp: (params: RouteParams) => Node;
}

export function Route(props: RouteProps, renderer: RendererLike<Node>) {
  return <Conditional
    if={match(props.path)}
    then={() => props.comp(NavService.instance.extract(props.path))}
  />;
}
