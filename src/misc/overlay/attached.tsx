import share from 'callbag-share';
import { debounce, expr, fromEvent, map, merge, of, pipe, Source } from 'callbag-common';
import { state } from 'callbag-state';
import { TrackerComponentThis } from 'callbag-jsx';
import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';
import { LiveComponentThis } from 'render-jsx/component/plugins';

import { classes } from './styles';


const documentRepos = pipe(
  merge(
    pipe(fromEvent(document, 'mousemove'), debounce(1)),
    pipe(fromEvent(document, 'scroll'), debounce(10))
  ),
  share
);

export interface OverlayAttachedProps {
  element: RefLike<HTMLElement>;
  attachment: (rect: DOMRect) => {top: number, left: number};
  show: Source<boolean>;
  repos?: Source<unknown>;
}

export function OverlayAttached(
  this: TrackerComponentThis & LiveComponentThis,
  props: OverlayAttachedProps,
  renderer: RendererLike<Node>,
  ...children: Node[]) {

  const top = state(0);
  const left = state(0);
  const container = ref<HTMLElement>();

  const calculatePos = () => {
    const rect = props.element.$.getBoundingClientRect();
    const pos = props.attachment(rect);
    top.set(pos.top);
    left.set(pos.left);
  };

  const repos = merge(props.repos || of(), documentRepos);
  const showDelayed = pipe(props.show, debounce(150));

  this.track(expr($ => {
    $(repos);
    if ($(props.show)) {
      calculatePos();
    }
  }));

  this.onBind(() => calculatePos());
  this.onClear(() => renderer.remove(container.$));

  renderer.render(<div class={classes().overlayAttached} style={{
    'top.px': top,
    'left.px': left,
    transition: expr($ => $(showDelayed) ? 'top .15s, left .15s' : '')
  }} hidden={pipe(props.show, map(_ => !_))} _ref={container}>
    {children}
  </div>).on(document.body);

  return <></>;
}

export function OverlayWidget(props: OverlayAttachedProps, renderer: RendererLike<Node>, ...children: Node[]) {
  return <OverlayAttached {...props}>
    <div class={classes().overlayWidget}>
      {children}
    </div>
  </OverlayAttached>;
}
