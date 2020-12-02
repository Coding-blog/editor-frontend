import { StateLike } from 'callbag-state';
import { update } from '../date-input/util';


export { update };

export function range(N: number) {
  const res: number[] = [];
  for (let i = 1; i <= N; i++) {
    res.push(i);
  }

  return res;
}

export function hour(d: Date | undefined): number {
  if (!d || isNaN(d.getHours())) { return hour(new Date()); }

  const h = d.getHours() || 12;
  if (h > 12) { return h - 12; }
  else { return h; }
}

export function minute(d: Date | undefined): number {
  if (!d || isNaN(d.getMinutes())) { return minute(new Date()); }

  return d.getMinutes();
}

export function isPM(d: Date | undefined): boolean {
  if (!d || isNaN(d.getMinutes())) { return isPM(new Date()); }

  return d.getHours() >= 12;
}

export function timeStr(date: Date | undefined) {
  return date?.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

export function strToTime(str: string) {
  const today = new Date();

  return new Date(today.toDateString() + ' ' + str);
}

export function setTime(state: StateLike<Date>, date: Date) {
  update(state, d => {
    d.setHours(date.getHours());
    d.setMinutes(date.getMinutes());
  })();
}
