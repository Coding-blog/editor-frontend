import { RendererLike } from 'render-jsx';
import { LiveComponentThis } from 'render-jsx/component/plugins';
import { ref } from 'render-jsx/common';
import { state } from 'callbag-state';

import { classes } from './styles';


export interface DialogControls {
  close: () => void;
}


export interface DialogProps {
  controls?: RefLike<DialogControls>;
}


export function Dialog(this: LiveComponentThis, props: DialogProps, renderer: RendererLike<Node>, content: Node[]) {
  const container = ref<HTMLElement>();
  const active = state(false);

  this.onBind(() => {
    setTimeout(() => active.set(true), 1);
    (container.$.querySelector('input, button, [tabindex]:not([tabindex="-1"])') as HTMLElement)?.focus();
  });

  const close = () => {
    active.set(false);
    setTimeout(() => renderer.remove(container.$), 150);
  };

  if (props.controls) {
    props.controls.resolve({ close });
  }

  return <div _ref={container} class={[classes().overlayBackdrop, {active}]} onclick={close}>
    <div class={classes().dialog} onclick={(event: Event) => event.stopPropagation()}>
      {content}
    </div>
  </div>;
}


export function open(node: Node, renderer: RendererLike<Node>) {
  renderer.render(node).on(document.body);
}
