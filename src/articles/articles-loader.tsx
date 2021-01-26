import { RendererLike } from 'render-jsx';

import { fromPromise, pipe, tap, subscribe, map, flatten } from 'callbag-common';
import { State, state } from 'callbag-state';

import { Article } from '@api/editor-backend';


export interface ArticlesLoaderProps {
  loader: (filterTags: string[], lastId?: string) => Promise<Article[]>,
  comp: (isLoading: State<boolean>, articles: State<Article[]>, tags: State<string[]>, loadMore: () => void) => Node;
}

export function ArticleLoader(props: ArticlesLoaderProps, renderer: RendererLike<Node>) {
  const articles = state<Article[]>([]);
  const isLoading = state(true);
  const tags = state<string[]>([]);

  const getArticles = (filterTags: string[], lastId?: string) => {
    isLoading.set(true);

    return pipe(
      fromPromise(props.loader(filterTags, lastId)),
      tap(() => {
        isLoading.set(false);
      })
    );
  };

  pipe(
    tags,
    map((t: string[]) => getArticles(t)),
    flatten,
    subscribe(res => articles.set(res))
  );

  const loadMore = () => {
    if(isLoading.get()) {
      return;
    }

    pipe(
      getArticles(tags.get(), articles.get()[articles.get().length-1].id),
      subscribe((newArticles) => {
        articles.set([...articles.get(), ...newArticles]);
      })
    );
  };

  return <>{props.comp(isLoading, articles, tags, loadMore)}</>;
}
