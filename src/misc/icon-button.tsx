import { Callbag } from 'callbag';
import { RendererLike } from 'render-jsx';
import { style } from '../util/style';


const classes = style({
  icon: {
    width: 36,
    height: 36,
    minWidth: 'auto',
    position: 'relative',

    '&>img': {
      height: 28
    }
  },

  tooltip: {
    position: 'absolute',
    right: 48,
    color: 'white',
    background: 'rgba(0, 0, 0, .55)',
    backdropFilter: 'blur(6px)',
    borderRadius: 3,
    padding: '4px 8px',
    opacity: 0,
    transform: 'scale(0)',
    transition: 'opacity .15s, transform .15s',

    '$icon:hover &': {
      opacity: 1,
      transform: 'scale(1)',
    },
  }
});

export interface IconButtonProps {
  icon: string;
  title?: string;
  disabled?: boolean | Callbag<never, boolean>;
  onclick?: () => void;
}

export function IconButton(props: IconButtonProps, renderer: RendererLike<Node>) {
  return <button class={classes().icon} onclick={props.onclick} {...props.disabled?{disabled: props.disabled}:{}}>
    <img src={props.icon}/>
    {props.title ? <div class={classes().tooltip}>{props.title}</div> : <></>}
  </button>;
}
