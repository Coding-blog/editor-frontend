import { getDraftIssues, getSentIssues, getIssueByReaderAndTitle } from '@api/editor-backend';
import { fromPromise } from 'callbag-common';
import { RendererLike } from 'render-jsx';

import { authToken } from '../auth/service';
import { Header } from '../misc/header';
import { Toolbar } from '../misc/toolbar';
import { Wait } from '../misc/wait';
import { NavIconButton } from '../nav/nav-icon-button';
import { Route } from '../nav/route';
import { navigate } from '../nav/service';
import { IssuesList } from './list';
import { Single } from './single';


export function Issues(_: unknown, renderer: RendererLike<Node>) {
  return <>
    <Route path='**/new' comp={() => <Single ondelete={() => navigate('issues/draft')}/>}/>
    <Route path='**/:reader/:title/edit' comp={params =>
      <Wait for={getIssueByReaderAndTitle(authToken()!, params.reader, params.title)}
        with={() => <Header>Loading ...</Header>}
        then={issue => <Single issue={issue} ondelete={() => navigate('issues/draft')}/>}
      />
    }/>
    <Route path='**/draft' comp={() =>
      <IssuesList
        title='Draft Issues'
        issues={fromPromise(getDraftIssues(authToken()!))}
        pick={issue => navigate('issues/:reader/:title/edit', { reader: issue.reader, title: issue.title })}/>
    }/>
    <Route path='**/sent' comp={() =>
      <IssuesList
        title='Sent Issues'
        issues={fromPromise(getSentIssues(authToken()!))}
        pick={issue => navigate('issues/:reader/:title/edit', { reader: issue.reader, title: issue.title })}/>
    }/>
    <Toolbar>
      <NavIconButton icon='./assets/icon-new.svg' title='New' path='issues/new'/>
      <NavIconButton icon='./assets/icon-draft.svg' title='Drafts' path='issues/draft'/>
      <NavIconButton icon='./assets/icon-send.svg' title='Sent' path='issues/sent'/>
    </Toolbar>
  </>;
}
