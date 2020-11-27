import { RendererLike } from 'render-jsx';
import { state, StateLike } from 'callbag-state';
import { expr, pipe, Source, subscribe } from 'callbag-common';
import { List, TrackerComponentThis } from 'callbag-jsx';

import { classes } from './style';
import { OverlayAttached } from '../overlay-attached';


export interface DateWidgetProps {
  element: RefLike<HTMLElement>;
  _state: StateLike<Date>
  focused: Source<boolean>;
}

function dateTitle(date: Date | undefined) {
  const m = date?.toLocaleString('default', {month: 'short'});
  const y = date?.getFullYear();
  if (!m || m === 'Invalid Date') {
    const today = new Date();

    return today.toLocaleString('default', {month: 'short'}) + ' ' + today.getFullYear();
  } else { return m + ' ' + y; }
}

function dayList(date: Date | undefined): Date[] {
  if (!date || date.toDateString() === 'Invalid Date') { return dayList(new Date()); }
  const res: Date[] = [];

  const dayToDate = (day: number) => new Date(date.getFullYear(), date.getMonth(), day);
  for (let i = 1, day = dayToDate(i);
    day.getMonth() === date.getMonth();
    day = dayToDate(++i)
  ) {
    res.push(new Date(date.getFullYear(), date.getMonth(), i));
  }

  return res;
}

function sameDate(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }

export function DateWidget(this: TrackerComponentThis, props: DateWidgetProps, renderer: RendererLike<Node>) {
  const days = state<Date[]>([]);

  this.track(pipe(props._state, subscribe(d => days.set(dayList(d)))));

  const update = (f: (d: Date) => void) => () => {
    let d = props._state.get();
    if (!d || d.toDateString() === 'Invalid Date') { d = new Date(); }
    f(d); props._state.set(d!);
  };

  const nextYear = update(d => d.setFullYear(d.getFullYear() + 1));
  const nextMonth = update(d => d.setMonth(d.getMonth() + 1));
  const prevMonth = update(d => d.setMonth(d.getMonth() - 1));
  const prevYear = update(d => d.setFullYear(d.getFullYear() - 1));

  const set = (date: Date) => { props._state.set(date); props.element.$.blur(); };

  return <OverlayAttached element={props.element} show={props.focused}
    attachment={rect => ({top: rect.bottom - 5, left: rect.left + 6})}>
    <div class={classes().dateWidget}
      onmousedown={(event: MouseEvent) => {
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
        <List of={days} key={day => day.toDateString()} each={day =>
          <span class={{
            today: expr($ => sameDate($(day)!, new Date())),
            selected: expr($ => sameDate($(day)!, $(props._state)!)),
          }} onclick={() => set(day.get()!)}>
            {expr($ => $(day)?.getDate())}
          </span>}/>
      </div>
      <button onclick={() => set(new Date())}>Today</button>
    </div>
  </OverlayAttached>;
}
