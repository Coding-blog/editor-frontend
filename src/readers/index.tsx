import { RendererLike } from 'render-jsx';
import { Header } from '../misc/header';


export function Readers(_: unknown, renderer: RendererLike<Node>) {
  return <>
    <Header>Readers</Header>
    Here you see all the readers.
  </>;
}
