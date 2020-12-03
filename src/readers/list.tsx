import { getReadersByName, Reader } from '@api/editor-backend';
import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';
import { state } from 'callbag-state';

import { Header } from '../misc/header';
import { List } from 'callbag-jsx';
import { debounce, flatten, fromPromise, map, pipe, tap } from 'callbag-common';
import { authToken } from '../auth/service';
import { Card } from '../misc/card';
import { Tag } from '../misc/tag';
import { noop } from '../util/noop';
import { Loading } from '../misc/loading';
import { OverlayAttached } from '../misc/overlay/attached';


export interface ReadersListProps {
  pick?: (reader: Reader) => void;
}


export function ReadersList(props: ReadersListProps, renderer: RendererLike<Node>) {
  const filter = state('');
  const loading = state(false);
  const input = ref<HTMLElement>();
  const readers = pipe(
    filter,
    tap(() => loading.set(true)),
    debounce(1000),
    map(q => fromPromise(getReadersByName(authToken()!, q))),
    flatten,
    tap(() => loading.set(false)),
  );

  return <>
    <Header>Readers</Header>
    <input _ref={input} type='text' _state={filter} placeholder='Search by name ...'/>
    <OverlayAttached element={input} show={loading}
      attachment={box => ({top: box.top + 4, left: box.right - 32})} repos={loading}>
      <Loading/>
    </OverlayAttached>
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '8px' }}>
      <List of={readers} each={reader =>
        <Card title={reader.sub('name')} subtitle={reader.sub('email')}
          onclick={props.pick ? () => props.pick!(reader.get()!) : noop}>
          <div style={{display: 'flex'}}>
            <List of={reader.sub('interests')} each={interest => <Tag>{interest}</Tag>}/>
          </div>
        </Card>}/>
    </div>
  </>;
}
