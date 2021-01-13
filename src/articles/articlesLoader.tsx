import { RendererLike } from 'render-jsx';

import { fromPromise, pipe, tap, subscribe } from 'callbag-common';
import { State, state } from 'callbag-state';

import { Article } from '@api/editor-backend';


export interface ArticlesLoaderProps {
  loader: (lastId?: string) => Promise<Article[]>,
  comp: (isLoading: State<boolean>, articles: State<Article[]>, loadMore: () => void) => Node;
}

export function ArticleLoader(props: ArticlesLoaderProps, renderer: RendererLike<Node>) {
  const articles = state<Article[]>([]);
  const isLoading = state(true);

  const getArticles = (lastId?: string) => {
    isLoading.set(true);

    return pipe(
      fromPromise(props.loader(lastId)),
      tap(() => {
        isLoading.set(false);
      })
    );
  };

  const loadMore = () => {
    if(isLoading.get()) {
      return;
    }

    pipe(
      getArticles(articles.get()[articles.get().length-1].id),
      subscribe((newArticles) => {
        articles.set([...articles.get(), ...newArticles]);
      })
    );
  };

  pipe(
    getArticles(),
    subscribe((newArticles) => {
      articles.set([...articles.get(), ...newArticles]);
    })
  );

  return props.comp(isLoading, articles, loadMore);
}
