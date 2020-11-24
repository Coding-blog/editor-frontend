import { makeRenderer } from 'callbag-jsx';

const renderer = makeRenderer();
renderer.render(<div>Hellow World!</div>).on(document.body);

const x = [1, 2];
if (x.length === 2) {
  console.log(x);
}
