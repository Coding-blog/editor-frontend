import { RendererLike } from 'render-jsx';
import { getReaderByEmail } from '@api/editor-backend';

import { Wait } from '../misc/wait';
import { Route } from '../nav/route';
import { Single } from './single';
import { authToken } from '../auth/service';
import { Header } from '../misc/header';
import { ReadersList } from './list';
import { Toolbar } from '../misc/toolbar';
import { NavIconButton } from '../nav/nav-icon-button';
import { navigate } from '../nav/service';


export function Readers(_: unknown, renderer: RendererLike<Node>) {
  return <>
    <Route path='**/new' comp={() => <Single ondelete={() => navigate('readers/')}/>}/>
    <Route path='**/:email/edit' comp={({ email }) =>
      <Wait for={getReaderByEmail(authToken()!, email)}
        with={() => <Header>Loading ...</Header>}
        then={reader => <Single reader={reader} ondelete={() => navigate('readers/')}/>}/>
    }/>
    <Route path='**/' comp={() =>
      <ReadersList pick={reader => navigate('readers/:email/edit', { email: reader.email })}/>
    }/>
    <Toolbar>
      <NavIconButton icon='./assets/icon-new.svg' title='New' path='readers/new'/>
      <NavIconButton icon='./assets/icon-list.svg' title='List' path='readers/'/>
    </Toolbar>
  </>;
}
