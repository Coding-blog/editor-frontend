import { RendererLike } from 'render-jsx';
import { style } from '../util/style';
// import { keyframes } from "styled-components";


/*const animation = keyframes`
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
`;*/
const animation = 'ldsRippleAnimation';

const classes = style({
  ldsRipple: {
    display: 'inline-block',
    position: 'relative',
    width: '80px',
    height: '80px',

    '& div': {
      position: 'absolute',
      border: '4px solid #333',
      opacity: 1,
      borderRadius: '50%',
      animation: `${animation} 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite`,
    },

    '& div:nth-child(2)': {
      animationDelay: '-0.5s',
    },
  }
});

export interface SpinnerProps {
  class: string;
}

export function Spinner(props: SpinnerProps, renderer: RendererLike<Node>, content: Node[]) {
  return <>
    <div class={[classes().ldsRipple, props.class]}><div></div><div></div></div>
    <style>
      {`
        @keyframes ldsRippleAnimation {
          0% {
            top: 36px;
            left: 36px;
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            top: 0px;
            left: 0px;
            width: 72px;
            height: 72px;
            opacity: 0;
          }
        }
      `}
    </style>
  </>;
}
