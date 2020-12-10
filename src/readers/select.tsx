import { getReadersByName, Reader } from '@api/editor-backend';
import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';
import { state } from 'callbag-state';
import { List } from 'callbag-jsx';

import { Buttons } from '../misc/buttons';
import { Dialog, DialogControls } from '../misc/overlay/dialog';
import { debounce, filter, flatten, fromPromise, map, pipe, tap } from 'callbag-common';
import { authToken } from '../auth/service';
import { OverlayAttached } from '../misc/overlay/attached';
import { Loading } from '../misc/loading';
import { style } from '../util/style';


const classes = style({
  readers: {
    height: 256,
    margin: '16px 0',
    overflow: 'auto',
    '&>div': {
      borderBottom: '1px dashed #e0e0e0',
      cursor: 'pointer',
      transition: 'background .15s',
      padding: 8,
      '&:hover': {
        background: '#eeeeee',
        borderRadius: 3,
      }
    }
  }
});


export interface SelectReaderProps {
  pick: (reader: Reader) => void;
  onclear?: () => void;
}


export function SelectReader(props: SelectReaderProps, renderer: RendererLike<Node>) {
  const controls = ref<DialogControls>();

  const query = state('');
  const loading = state(false);
  const input = ref<HTMLElement>();
  const readers = pipe(
    query,
    filter(q => q.length > 0),
    tap(() => loading.set(true)),
    debounce(1000),
    map(q => fromPromise(getReadersByName(authToken()!, q))),
    flatten,
    tap(() => loading.set(false)),
  );

  const pick = (reader: Reader) => {
    controls.$.close();
    props.pick(reader);
  };

  return <Dialog controls={controls}>
    <input _ref={input} type='text' _state={query} placeholder='Search by name ...'/>
    <OverlayAttached element={input} show={loading}
      attachment={box => ({top: box.top + 4, left: box.right - 32})} repos={loading}>
      <Loading/>
    </OverlayAttached>

    <div class={classes().readers}>
      <List of={readers} each={reader =>
        <div onclick={() => pick(reader.get()!)}>
          {reader.sub('name')}
        </div>
      }/>
    </div>

    <hr/>

    <Buttons>
      {
        props.onclear ?
          <button onclick={() => { props.onclear!(); controls.$.close(); }}>Clear</button>
          : ''
      }
      <button onclick={() => controls.$.close()}>Cancel</button>
    </Buttons>
  </Dialog>;
}
