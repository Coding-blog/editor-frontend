import { RendererLike } from 'render-jsx';
import { style } from '../util/style';


const Duration = 1;
const Offset = 200;

const classes = style({
  loading: {
    position: 'relative',
    display: 'inline-flex',
    verticalAlign: 'middle',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5em', height: '1.5em',
  },

  spinner: {
    width: '100%',
    height: '100%',
    animation: `$rotate ${Duration * 1.17}s linear infinite`,
  },

  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },

  path: {
    strokeDasharray: Offset,
    strokeDashoffset: 0,
    transformOrigin: '33px 33px !important',
    fill: 'none',
    strokeWidth: 3,
    strokeLinecap: 'round',
    cx: '33px', cy: '33px', r: '30px',
    animation: `$dash ${Duration}s ease-in-out infinite`,

    stroke: '#363062',
  },

  '@keyframes dash': {
    '0%': { strokeDashoffset: Offset },
    '50%': {
      strokeDashoffset: Offset/4,
      transform: 'rotate(45deg)',
    },
    '100%': {
      strokeDashoffset: Offset,
      transform: 'rotate(360deg)',
    }
  },
});


export function Loading(_: {}, renderer: RendererLike<Node>) {
  return <div class={classes().loading} _content={`
    <svg class="${classes().spinner}" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <circle class="${classes().path}" xmlns="http://www.w3.org/2000/svg"/>
    </svg>
  `}/>;
}
