import { RendererLike } from 'render-jsx';
import state from 'callbag-state';

import { Toolbar } from '../misc/toolbar';
import { Toggle } from '../misc/toggle';
import { Switch } from '../misc/switch';
import { Single } from './single';
import { List } from './list';


export function Articles(_: unknown, renderer: RendererLike<Node>) {
  const mode = state('new');

  return <>
    <Switch on={mode} cases={[
      ['new', () => <Single/>],
      ['unapproved', () => <List title='Unapproved Articles' articles={[]}/>],
      ['approved', () => <List title='Approved Articles' articles={[]}/>]
    ]}/>
    <Toolbar>
      <Toggle for={mode} on='new' icon='./assets/icon-new.svg' title='New'/>
      <Toggle for={mode} on='unapproved' icon='./assets/icon-dont-approve.svg' title='Unapproved'/>
      <Toggle for={mode} on='approved' icon='./assets/icon-approve.svg' title='Approved'/>
    </Toolbar>
  </>;
}
