import { RendererLike } from 'render-jsx';
import { Header } from '../misc/header';


export function Issues(_: unknown, renderer: RendererLike<Node>) {
  return <>
    <Header>Issues</Header>
    Here you see all the issues.
  </>;
}
