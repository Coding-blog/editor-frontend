import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';
import { StateLike } from 'callbag-state';
import { expr, pipe, Source, subscribe } from 'callbag-common';

import { ensureArray } from './ensure-array';

export function isRequired<T>(t: T) {
  return !!t;
}

export function isUrl(link: string) {
  return /https:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    .test(link);
}

export function isEmail(email: string) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

export function isMinLength(n: number) {
  return (l: unknown[] | string) => !!l && l.length >= n;
}

export type Validator<T> = (t: T) => boolean;
export type ValidationRules<T> = {
  [K in keyof T]?: Validator<T[K]> | Validator<T[K]>[];
}


export function valid<T>(state: StateLike<T>, rules: ValidationRules<T>) {
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


export function changed<T>(state: StateLike<T>, snap: () => T | undefined, cue?: Source<unknown>) {
  return expr($ => {
    if (cue) { $(cue); }

    return !isEqual($(state), snap());
  });
}


export function snapshot<T>(state: StateLike<T>) {
  return cloneDeep(state.get());
}


export function ensurePrefix(state: StateLike<string>, prefix: string) {
  return pipe(
    state,
    subscribe(v => {
      if (v && v.length > 0 && !v.startsWith(prefix) && !prefix.startsWith(v)) {
        setTimeout(() => state.set(prefix + v), 1);
      }
    })
  );
}
