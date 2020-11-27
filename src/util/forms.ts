import { State } from 'callbag-state';
import { expr } from 'callbag-expr';
import { ensureArray } from './ensure-array';


export function required<T>(t: T) {
  return !!t;
}

export type Validator<T> = (t: T) => boolean;
export type ValidationRules<T> = {
  [K in keyof T]?: Validator<T[K]> | Validator<T[K]>[];
}


export function valid<T>(state: State<T>, rules: ValidationRules<T>) {
  return expr($ => {
    const v = $(state);
    if (!v) {
      return false;
    }

    return Object.entries(v).every(([key, value]) =>
      ensureArray(rules[key as keyof T]).every(validator => !validator || validator(value))
    );
  });
}


export function changed<T>(state: State<T>, snapshot: T | undefined) {
  return expr($ => {
    const v = $(state);
    if (v === snapshot) { return false; }
    if (!v && snapshot) { return true; }

    return Object.entries(v!).some(([key, value]) => value !== (snapshot ? snapshot[key as keyof T] : undefined));
  });
}
