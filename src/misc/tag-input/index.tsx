import { debounce, pipe, Source, subscribe, map, flatten, merge, expr } from 'callbag-common';
import { ref } from 'render-jsx/common';
import { RendererLike } from 'render-jsx';
import { List, TrackerComponentThis } from 'callbag-jsx';
import { state, StateLike } from 'callbag-state';

import { inputStyles } from './style';
import { Suggestions } from './suggestions';


export interface TagInputProps {
  _state: StateLike<string[]>;
  placeholder?: string;
  suggestions?: (input: string) => Source<string[]>;
}

export function TagInput(this: TrackerComponentThis, props: TagInputProps, renderer: RendererLike<Node>) {
  const next = state('');
  const hlindex = state(-1);
  const focused = state(false);
  const allSuggestions = state<string[]>([]);
  const suggestions = state<string[]>([]);
  const input = ref<HTMLElement>();

  if (props.suggestions) {
    this.track(pipe(next, debounce(200), map(props.suggestions), flatten,
      subscribe(s => allSuggestions.set(s))));
    this.track(expr($ => {
      const all = $(allSuggestions, []);
      const term = $(next, '');
      const tags = $(props._state);
      suggestions.set(all
        .filter(i => i.toLowerCase().includes(term.toLowerCase()))
        .filter(i => !tags?.includes(i))
      );
    }));
  }

  const highlight = () => {
    const s = suggestions.get();
    let i = hlindex.get();
    if (i < 0) { hlindex.set(i = s.length - 1); }
    if (i >= s.length) { hlindex.set(i = 0); }
  };

  const keypress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      add(suggestions.get()[hlindex.get()] || next.get());
    } else if (event.key === 'Backspace' && !next.get()) {
      if (props._state.get()) { remove(props._state.get()!.length - 1); }
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      hlindex.set(hlindex.get() + 1);
      highlight();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      hlindex.set(hlindex.get() - 1);
      highlight();
    } else if (event.key === 'Escape') {
      if (hlindex.get() === -1) {
        suggestions.set([]);
      } else {
        hlindex.set(-1);
      }
    }
  };

  const add = (tag: string) => {
    if (tag.trim()) {
      if (!props._state.get()) { props._state.set([tag]); }
      else { props._state.sub(props._state.get()!.length).set(tag); }
      next.set('');
    }
  };

  const remove = (index: number) => {
    const l = props._state.get()!;
    l.splice(index, 1);
    props._state.set(l);
  };

  return <div class={['input', inputStyles().tagInput, {focused}]}>
    <List of={props._state} each={(tag, index) => <div class={inputStyles().tag}>
      {tag}
      <img src='./assets/icon-close-white.svg' onclick={() => remove(index)}/>
    </div>}/>
    <input type='text' placeholder={props.placeholder || ''}
      onkeydown={keypress} _state={next} _ref={input}
      onfocus={() => focused.set(true)} onblur={() => focused.set(false)}/>
    { props.suggestions ?
      <Suggestions element={input} picked={add} hlindex={hlindex} focused={focused}
        src={merge(suggestions, pipe(props._state, map(() => suggestions.get())))}/>
      : <></>
    }
  </div>;
}
