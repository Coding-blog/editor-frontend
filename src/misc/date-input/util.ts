import { StateLike } from 'callbag-state';


export function dateTitle(date: Date | undefined) {
  const m = date?.toLocaleString('default', {month: 'short'});
  const y = date?.getFullYear();
  if (!m || m === 'Invalid Date') {
    const today = new Date();

    return today.toLocaleString('default', {month: 'short'}) + ' ' + today.getFullYear();
  } else { return m + ' ' + y; }
}

export function dayList(date: Date | undefined): Date[] {
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

export function sameDate(a: Date, b: Date) { return a.toDateString() === b.toDateString(); }

export function update(state: StateLike<Date>, f: (d: Date) => void) {
  return () => {
    let d = state.get();
    if (!d || d.toDateString() === 'Invalid Date') { d = new Date(); }
    f(d); state.set(d!);
  };
}


export function setDate(state: StateLike<Date>, date: Date) {
  update(state, d => {
    d.setFullYear(date.getFullYear());
    d.setMonth(date.getMonth());
    d.setDate(date.getDate());
  })();
}
