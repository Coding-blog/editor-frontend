import cloneDeep from 'lodash.clonedeep';
import { RendererLike } from 'render-jsx';
import state from 'callbag-state';

import { Toolbar } from '../misc/toolbar';
import { Toggle } from '../misc/toggle';
import { Switch } from '../misc/switch';
import { Single } from './single';
import { ArticleList } from './list';
import { fromPromise, of } from 'callbag-common';
import { Article, getUnapprovedArticles } from '@api/editor-backend';
import { authToken } from '../auth/service';


export function Articles(_: unknown, renderer: RendererLike<Node>) {
  const mode = state('unapproved');
  let picked: Article | undefined;

  return <>
    <Switch on={mode} cases={[
      ['new', () => <Single ondelete={() => mode.set('unapproved')}/>],
      ['edit', () => <Single ondelete={() => mode.set('unapproved')} article={cloneDeep(picked)}/>],
      ['unapproved', () =>
        <ArticleList title='Unapproved Articles'
          articles={fromPromise(getUnapprovedArticles(authToken()!))}
          pick={article => { picked = article; mode.set('edit'); }}
        />
      ],
      ['approved', () => <ArticleList title='Approved Articles' articles={of([])}/>]
    ]}/>
    <Toolbar>
      <Toggle for={mode} on='new' icon='./assets/icon-new.svg' title='New'/>
      <Toggle for={mode} on='unapproved' icon='./assets/icon-dont-approve.svg' title='Unapproved'/>
      <Toggle for={mode} on='approved' icon='./assets/icon-approve.svg' title='Approved'/>
    </Toolbar>
  </>;
}
