import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';
import { state, StateLike } from 'callbag-state';
import { TrackerComponentThis } from 'callbag-jsx';
import { expr, pipe, subscribe } from 'callbag-common';
import { DateWidget } from './widget';


export interface DateInputProps {
  _state: StateLike<Date>;
  placeholder?: string;
}


export function DateInput(this: TrackerComponentThis, props: DateInputProps, renderer: RendererLike<Node>) {
  const strform = state<string>(props._state.get()?.toDateString() || '');
  const focused = state(false);
  const input = ref<HTMLElement>();

  this.track(pipe(
    props._state,
    subscribe(v => {
      const vstr = v?.toDateString();
      if (vstr && vstr !== new Date(strform.get()).toDateString()) {
        strform.set(vstr);
      }
    })
  ));

  const error = expr($ => $(props._state)?.toDateString() === 'Invalid Date');

  return <>
    <input type='text' placeholder={props.placeholder || ''} class={{error}} _ref={input}
      value={strform} _state={(s: string) => {
        strform.set(s);
        props._state.set(new Date(s));
      }}
      onfocus={() => focused.set(true)}
      onblur={() => focused.set(false)}
    />
    <DateWidget element={input} focused={focused} _state={props._state}/>
  </>;
}
