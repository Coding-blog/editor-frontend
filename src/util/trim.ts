import { map, pipe, Source, MaybeSource } from 'callbag-common';


export function trim(src: string | undefined, max?: number): string;
export function trim(src: Source<string | undefined>, max?: number): Source<string>;
export function trim(src: MaybeSource<string | undefined>, max = 20) {
  if (!src) {
    return '';
  }

  if (typeof src === 'string') {
    return src.split(' ').length > max ? src.split(' ').slice(0, max).join(' ') + ' ...' : src;
  } else {
    return pipe(src, map(s => trim(s)));
  }
}
