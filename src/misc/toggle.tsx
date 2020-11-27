import { RendererLike } from 'render-jsx';
import { State } from 'callbag-state';
import { expr } from 'callbag-expr';
import { IconButton } from './icon-button';


export interface ToggleProps<T> {
  for: State<T>;
  on: T;
  icon: string;
  title?: string;
}

export function Toggle<T>(props: ToggleProps<T>, renderer: RendererLike<Node>) {
  return <IconButton icon={props.icon} title={props.title}
    disabled={expr($ => $(props.for) === props.on)}
    onclick={() => props.for.set(props.on)}
  />;
}
