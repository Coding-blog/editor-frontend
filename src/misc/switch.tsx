import { RendererLike } from 'render-jsx';
import { State } from 'callbag-state';
import { expr } from 'callbag-expr';
import { Conditional } from 'callbag-jsx';


export interface SwitchProps<T> {
  on: State<T>;
  cases: [T, () => Node][];
}


export function Switch<T>(props: SwitchProps<T>, renderer: RendererLike<Node>, content: Node[]) {
  return <>
    {props.cases.map(_case => <Conditional if={expr($ => $(props.on) === _case[0])} then={_case[1]}/>)}
  </>;
}
