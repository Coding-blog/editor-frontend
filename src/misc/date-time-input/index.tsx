import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';
import { state, StateLike } from 'callbag-state';
import { TrackerComponentThis } from 'callbag-jsx';
import { expr, pipe, subscribe } from 'callbag-common';

import { dateTimeString } from './util';
import { DateTimeWidget } from './widget';


export interface DateTimeInputProps {
  _state: StateLike<Date>;
  placeholder?: string;
}

export function DateTimeInput(this: TrackerComponentThis, props: DateTimeInputProps, renderer: RendererLike<Node>) {
  const strform = state<string>(dateTimeString(props._state.get()) || '');
  const focused = state(false);
  const input = ref<HTMLElement>();

  this.track(pipe(
    props._state,
    subscribe(v => {
      const vstr = dateTimeString(v);
      if (vstr && vstr !== dateTimeString(new Date(strform.get()))) {
        strform.set(vstr);
      }
    })
  ));

  const error = expr($ => $(props._state)?.toString() === 'Invalid Date');

  return <>
    <input type='text' placeholder={props.placeholder || ''} class={{error}} _ref={input}
      value={strform} _state={(s: string) => {
        strform.set(s);
        props._state.set(new Date(s));
      }}
      onfocus={() => focused.set(true)}
      onblur={() => focused.set(false)}
    />
    <DateTimeWidget focused={focused} _state={props._state} element={input}/>
  </>;
}
