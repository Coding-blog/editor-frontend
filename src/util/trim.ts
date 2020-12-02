import { map, pipe, Source } from 'callbag-common';


export function trim(src: string, max?: number): string;
export function trim(src: Source<String>, max?: number): Source<string>;
export function trim(src: string | Source<string>, max = 20): string | Source<string> {
  if (typeof src === 'string') {
    return src.split(' ').length > max ? src.split(' ').slice(0, max).join(' ') + ' ...' : src;
  } else {
    return pipe(src, map(trim));
  }
}
