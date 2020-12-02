import { expr, pipe, subscribe, Source, debounce } from 'callbag-common';
import { For, TrackerComponentThis } from 'callbag-jsx';
import { RendererLike } from 'render-jsx';
import { suggestionStyles } from './style';
import { OverlayWidget } from '../overlay/attached';


interface TagsWidgetItemProps {
  item: Source<string>;
  highlight: Source<boolean>;
  picked: (tag: string) => void;
}

function TagsWidgetItem(this: TrackerComponentThis, props: TagsWidgetItemProps, renderer: RendererLike<Node>) {
  let last: string;
  this.track(pipe(props.item, subscribe(v => last = v)));

  return <div
    class={[suggestionStyles().item, {highlight: props.highlight}]}
    onmousedown={() => props.picked(last)}>
    {props.item}
  </div>;
}


export interface TagsWidgetProps {
  element: RefLike<HTMLElement>;
  hlindex: Source<number>;
  focused: Source<boolean>;
  src: Source<string[]>;
  picked: (tag: string) => void;
}

export function TagsWidget(props: TagsWidgetProps, renderer: RendererLike<Node>) {
  return <OverlayWidget element={props.element}
    show={expr($ => $(props.focused) && $(props.src, []).length > 0)}
    attachment={rect => ({ top: rect.bottom + 3, left: rect.left })}
    repos={pipe(props.src, debounce(1))}>
    <For of={props.src} each={(item, index) =>
      <TagsWidgetItem item={item} picked={props.picked} highlight={expr($ => $(props.hlindex) === index)}/>
    }/>
  </OverlayWidget>;
}
