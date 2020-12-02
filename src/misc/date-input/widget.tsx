import { RendererLike } from 'render-jsx';
import { state, StateLike } from 'callbag-state';
import { expr, pipe, Source, subscribe } from 'callbag-common';
import { List, TrackerComponentThis } from 'callbag-jsx';

import { classes } from './style';
import { dateTitle, dayList, sameDate, setDate, update } from './util';
import { OverlayWidget } from '../overlay/attached';


export interface DatePickerProps {
  _state: StateLike<Date>;
  picked?: () => void;
}

export function DatePicker(this: TrackerComponentThis, props: DatePickerProps, renderer: RendererLike<Node>) {
  const days = state<Date[]>([]);

  this.track(pipe(props._state, subscribe(d => days.set(dayList(d)))));

  const nextYear = update(props._state, d => d.setFullYear(d.getFullYear() + 1));
  const nextMonth = update(props._state, d => d.setMonth(d.getMonth() + 1));
  const prevMonth = update(props._state, d => d.setMonth(d.getMonth() - 1));
  const prevYear = update(props._state, d => d.setFullYear(d.getFullYear() - 1));

  const set = (date: Date) => {
    setDate(props._state, date);
    if (props.picked) { props.picked(); }
  };

  return <div onmousedown={(event: MouseEvent) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  }}>
    <div class={classes().controls}>
      <img src='./assets/icon-prev-prev-white.svg' onclick={prevYear}/>
      <img src='./assets/icon-prev-white.svg' onclick={prevMonth}/>
      <span>{expr($ => dateTitle($(props._state)))}</span>
      <img src='./assets/icon-next-white.svg' onclick={nextMonth}/>
      <img src='./assets/icon-next-next-white.svg' onclick={nextYear}/>
    </div>
    <div class={classes().days}>
      <List of={days} each={(day, index) =>
        <span class={{
          today: expr($ => sameDate($(day)!, new Date())),
          selected: expr($ => sameDate($(day)!, $(props._state)!)),
        }}
        onclick={() => set(day.get()!)}
        style={{'margin-left.px': index === 0 ? expr($ => (24 * $(day)!.getDay())) : 0}}>
          {expr($ => $(day)?.getDate())}
        </span>}/>
    </div>
    <div style={{display: 'flex'}}>
      <button onclick={() => set(new Date())}>Today</button>
    </div>
  </div>;
}


export interface DateWidgetProps {
  element: RefLike<HTMLElement>;
  _state: StateLike<Date>
  focused: Source<boolean>;
}

export function DateWidget(props: DateWidgetProps, renderer: RendererLike<Node>) {
  return <OverlayWidget element={props.element} show={props.focused}
    attachment={rect => ({top: rect.bottom - 5, left: rect.left + 6})}>
    <DatePicker _state={props._state} picked={() => props.element.$.blur()}/>
  </OverlayWidget>;
}
