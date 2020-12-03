import take from 'callbag-take';
import { fromPromise, map, pipe, Source, subscribe } from 'callbag-common';
import { Conditional, TrackerComponentThis } from 'callbag-jsx';
import { state } from 'callbag-state';
import { RendererLike } from 'render-jsx';


export interface WaitProps<T> {
  for: Source<T> | Promise<T>;
  then: (t: T) => Node;
  with?: () => Node;
}

const _N = {};

export function Wait<T>(this: TrackerComponentThis, props: WaitProps<T>, renderer: RendererLike<Node>) {
  const loaded = state<typeof _N | T>(_N);

  this.track(pipe(
    props.for instanceof Promise ? fromPromise(props.for) : props.for,
    take(1),
    subscribe(v => loaded.set(v)))
  );

  return <Conditional if={pipe(loaded, map(l => l !== _N))}
    then={() => props.then(loaded.get() as T)}
    else={() => props.with ? props.with() : <></>}
  />;
}
