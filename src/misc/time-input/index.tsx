import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';
import { state, StateLike } from 'callbag-state';
import { TrackerComponentThis } from 'callbag-jsx';
import { expr, pipe, subscribe } from 'callbag-common';

import { strToTime, timeStr, setTime } from './util';
import { TimeWidget } from './widget';


export interface TimeInputProps {
  _state: StateLike<Date>;
  placeholder?: string;
}


export function TimeInput(this: TrackerComponentThis, props: TimeInputProps, renderer: RendererLike<Node>) {
  const strform = state(timeStr(props._state.get()) || '');
  const focused = state(false);
  const input = ref<HTMLElement>();

  this.track(pipe(
    props._state,
    subscribe(v => {
      const vstr = timeStr(v);
      if (vstr && vstr !== timeStr(strToTime(strform.get()))) {
        strform.set(vstr);
      }
    })
  ));

  const error = expr($ => timeStr($(props._state)) === 'Invalid Date');

  return <>
    <input type='text' placeholder={props.placeholder || ''} class={{error}} _ref={input}
      value={strform}
      onfocus={() => focused.set(true)}
      onblur={() => focused.set(false)}
      _state={(v: string) => {
        strform.set(v);
        setTime(props._state, strToTime(v));
      }}/>
    <TimeWidget element={input} _state={props._state} focused={focused}/>
  </>;
}
