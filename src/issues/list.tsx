import { Issue } from '@api/editor-backend';
import { expr, Source } from 'callbag-common';
import { List } from 'callbag-jsx';
import { RendererLike } from 'render-jsx';
import { state, StateLike } from 'callbag-state';

import { Header } from '../misc/header';
import { noop } from '../util/noop';
import { style } from '../util/style';
import { Card } from '../misc/card';
import { SelectReader } from '../readers/select';
import { open } from '../misc/overlay/dialog';


const classes = style({
  issue: {
    display: 'flex',
    alignItems: 'center',
  },

  reader: {
    flexGrow: 1,
  },

  title: {
    flexGrow: 1,
  },

  date: {
    flexGrow: 1,
    fontSize: 12,
  }
});

interface IssueItemProps {
  issue: StateLike<Issue>;
  pick: () => void;
}

export function IssueItem(props: IssueItemProps, renderer: RendererLike<Node>) {
  return <Card onclick={props.pick}>
    <div class={classes().issue}>
      <div class={classes().reader}>{props.issue.sub('reader')}</div>
      <div class={classes().title}>{props.issue.sub('title')}</div>
      <div class={classes().date}>{expr($ => $(props.issue)!.date.toDateString())}</div>
    </div>
  </Card>;
}


export interface IssuesListProps {
  issues: Source<Issue[]>;
  title: string;
  pick?: (issue: Issue) => void;
}

export function IssuesList(props: IssuesListProps, renderer: RendererLike<Node>) {
  const reader = state<string>('');

  const pickReader = () => {
    open(<SelectReader pick={r => reader.set(r.email)} onclear={() => reader.set('')}/>, renderer);
  };

  return <>
    <Header>{props.title}</Header>
    <input type='text' _state={reader}
      placeholder='Search by reader ...' onclick={pickReader}/>
    <br/>
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '8px' }}>
      <List
        of={expr($ => $(props.issues)?.filter(issue => !$(reader) || issue.reader === $(reader)))}
        each={(issue: StateLike<Issue>) =>
          <IssueItem issue={issue} pick={props.pick ? () => props.pick!(issue.get()!) : noop}/>
        }
      />
    </div>
  </>;
}
