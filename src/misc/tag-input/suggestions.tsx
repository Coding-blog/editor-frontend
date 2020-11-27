import { expr, pipe, subscribe, Source, debounce } from 'callbag-common';
import { For, TrackerComponentThis } from 'callbag-jsx';
import { RendererLike } from 'render-jsx';
import { suggestionStyles } from './style';
import { OverlayAttached } from '../overlay-attached';


interface SuggestionProps {
  item: Source<string>;
  highlight: Source<boolean>;
  picked: (tag: string) => void;
}

function Suggestion(this: TrackerComponentThis, props: SuggestionProps, renderer: RendererLike<Node>) {
  let last: string;
  this.track(pipe(props.item, subscribe(v => last = v)));

  return <div
    class={[suggestionStyles().item, {highlight: props.highlight}]}
    onmousedown={() => props.picked(last)}>
    {props.item}
  </div>;
}


export interface SuggestionsProps {
  element: RefLike<HTMLElement>;
  hlindex: Source<number>;
  focused: Source<boolean>;
  src: Source<string[]>;
  picked: (tag: string) => void;
}

export function Suggestions(props: SuggestionsProps, renderer: RendererLike<Node>) {
  return <OverlayAttached element={props.element}
    show={expr($ => $(props.focused) && $(props.src, []).length > 0)}
    attachment={rect => ({ top: rect.bottom + 3, left: rect.left })}
    repos={pipe(props.src, debounce(1))}>
    <div class={suggestionStyles().suggestions}>
      <For of={props.src} each={(item, index) =>
        <Suggestion item={item} picked={props.picked} highlight={expr($ => $(props.hlindex) === index)}/>
      }/>
    </div>
  </OverlayAttached>;
}
