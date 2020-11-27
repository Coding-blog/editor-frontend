import { RendererLike } from 'render-jsx';
import { Article } from '@api/editor-backend';

import { Header } from '../misc/header';

export interface ListProps {
  articles: Article[];
  title: string;
}

export function List(props: ListProps, renderer: RendererLike<Node>) {
  return <>
    <Header>{props.title}</Header>
  </>;
}
