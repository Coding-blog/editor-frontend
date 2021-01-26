import { RendererLike } from 'render-jsx';

import { getUnapprovedArticles, getArticleByUrl, getApprovedArticles, getRejectedArticles } from '@api/editor-backend';

import { Toolbar } from '../misc/toolbar';
import { Single } from './single';
import { ArticleList } from './list';
import { authToken } from '../auth/service';
import { Route } from '../nav/route';
import { navigate } from '../nav/service';
import { NavIconButton } from '../nav/nav-icon-button';
import { Wait } from '../misc/wait';
import { Header } from '../misc/header';
import { ArticleLoader } from './articles-loader';


export function Articles(_: unknown, renderer: RendererLike<Node>) {
  return <>
    <Route path='**/rejected' comp={() => <ArticleLoader
      loader={(filterTags: string[], lastId?: string) => getRejectedArticles(authToken()!, filterTags, lastId)}
      comp={(isLoading, articles, tags, loadMore) => <ArticleList title='Rejected Articles'
        articles={articles}
        isLoading={isLoading}
        loadMore={loadMore}
        tags={tags}
        pick={article => navigate('articles/:url/edit', {
          route: {
            url: article.url
          }
        })}
      />}
    />}
    />
    <Route path='**/unapproved' comp={() => <ArticleLoader
      loader={(filterTags: string[], lastId?: string) => getUnapprovedArticles(authToken()!, filterTags, lastId)}
      comp={(isLoading, articles, tags, loadMore) => <ArticleList title='Unapproved Articles'
        articles={articles}
        isLoading={isLoading}
        loadMore={loadMore}
        tags={tags}
        pick={article => navigate('articles/:url/edit', {
          route: {
            url: article.url
          }
        })}
      />}
    />}
    />
    <Route path='**/approved' comp={() => <ArticleLoader
      loader={(filterTags: string[], lastId?: string) => getApprovedArticles(authToken()!, filterTags, lastId)}
      comp={(isLoading, articles, tags, loadMore) => <ArticleList title='Approved Articles'
        articles={articles}
        isLoading={isLoading}
        loadMore={loadMore}
        tags={tags}
        pick={article => navigate('articles/:url/edit', {
          route: {
            url: article.url
          }
        })}
      />}
    />}
    />
    <Route path='**/new' comp={() =>
      <Single ondelete={() => {
        navigate('articles/unapproved');
      }}/>
    }/>
    <Route path='**/:url/edit' comp={(params) =>
      <Wait for={getArticleByUrl(authToken()!, params.url)}
        with={() => <Header>Loading ...</Header>}
        then={article => <Single article={article} ondelete={() => navigate('articles/unapproved')}/>}
      />
    }/>
    <Toolbar>
      <NavIconButton icon='./assets/icon-new.svg' title='New' path='articles/new'/>
      <NavIconButton icon='./assets/icon-reject.svg' title='Rejected' path='articles/rejected'/>
      <NavIconButton icon='./assets/icon-dont-approve.svg' title='Unapproved' path='articles/unapproved'/>
      <NavIconButton icon='./assets/icon-approve.svg' title='Approved' path='articles/approved'/>
    </Toolbar>
  </>;
}
