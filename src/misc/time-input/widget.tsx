import { RendererLike } from 'render-jsx';
import { ref } from 'render-jsx/common';
import { expr, Source } from 'callbag-common';
import { state, StateLike } from 'callbag-state';

import { OverlayWidget } from '../overlay/attached';
import { update, isPM, range, minute, hour } from './util';
import { classes } from './style';


export interface TimePickerProps {
  _state: StateLike<Date>
}

export function TimePicker(props: TimePickerProps, renderer: RendererLike<Node>) {
  const container = ref<HTMLElement>();
  const mode = state<'hour' | 'minute'>('hour');
  const dragging = state(false);

  const toggle = () => mode.set(mode.get() === 'hour' ? 'minute' : 'hour');
  const set = (i: number, _toggle=true) => () => {
    if (mode.get() === 'hour') {
      update(props._state, d => {
        d.setHours(i + (isPM(d) ? 12 : 0));
        if (_toggle) { toggle(); }
      })();
    } else {
      update(props._state, d => {
        d.setMinutes(i * 5);
        if (_toggle) { toggle(); }
      })();
    }
  };
  const makeAM = update(props._state, d => { if (isPM(d)) { d.setHours(d.getHours() - 12 ); }});
  const makePM = update(props._state, d => { if (!isPM(d)) { d.setHours(d.getHours() + 12 ); }});

  const drag = (event: MouseEvent) => {
    if (dragging.get()) {
      const rect = container.$.getBoundingClientRect();
      const angle = Math.PI - Math.atan2(
        event.clientX - rect.left - 168 / 2,
        event.clientY - rect.top - 168/2);
      set(angle / Math.PI * 6, false)();
    }
  };

  return <div _ref={container}
    onmousedown={(e: Event) => { e.preventDefault(); e.stopPropagation(); }}
    onmousemove={drag}
    onmouseup={() => { if (dragging.get()) { dragging.set(false); toggle(); } }}>
    <div class={classes().watch}>
      {range(60).map(i =><b style={{ transform: { 'rotate.deg': i * 6, 'translateX.px': 72,  }}}>-</b>)}
      {
        range(12).map(i =>
          <span
            class={{ selected: expr($ =>
              ($(mode) === 'hour' && i === hour($(props._state)))
              || ($(mode) === 'minute' && i === Math.floor(minute($(props._state)) / 5)))}}
            style={{ transform: {
              'translateX.px': -Math.sin((i + 6) * Math.PI / 6) * 72,
              'translateY.px': Math.cos((i + 6) * Math.PI / 6) * 72,
            }}}
            onclick={set(i)}>{expr($ => $(mode) === 'hour' ? i : (i === 12 ? '00' : i * 5))}</span>
        )
      }
      <div class={['minute', classes().handle, { active: expr($ => $(mode) === 'minute')}]}
        onmousedown={() => { dragging.set(true); mode.set('minute'); }}
        onclick={() => { mode.set('minute'); }}
        style={{ transform: expr($ => ({ 'rotate.deg': minute($(props._state)) / 60 * 360 - 90 }))}}/>
      <div class={['hour', classes().handle, { active: expr($ => $(mode) === 'hour')}]}
        onclick={() => { mode.set('hour'); }}
        onmousedown={() => { dragging.set(true); mode.set('hour'); }}
        style={{ transform: expr($ => ({ 'rotate.deg': hour($(props._state)) / 12 * 360 - 90 }))}}/>
    </div>
    <div class={classes().controls}>
      <button class={{active: expr($ => !isPM($(props._state)))}} onclick={makeAM}>AM</button>
      <button class={{active: expr($ => isPM($(props._state)))}} onclick={makePM}>PM</button>
    </div>
  </div>;
}


export interface TimeWidgetProps {
  element: RefLike<HTMLElement>;
  _state: StateLike<Date>
  focused: Source<boolean>;
}

export function TimeWidget(props: TimeWidgetProps, renderer: RendererLike<Node>) {
  return <OverlayWidget element={props.element} show={props.focused}
    attachment={rect => ({ top: rect.bottom - 5, left: rect.left + 6})}>
    <TimePicker _state={props._state}/>
  </OverlayWidget>;
}
