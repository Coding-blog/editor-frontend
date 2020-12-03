import { RendererLike } from 'render-jsx';
import { noop } from '../util/noop';
import { style } from '../util/style';

const classes = style({
  card: {
    borderRadius: 7,
    boxShadow: '0 1px 3px rgba(0, 0, 0, .12)',
    background: 'white',
    cursor: 'pointer',
    transition: 'box-shadow .15s, transform .15s',
    overflow: 'hidden',

    '&.no-action': {
      cursor: 'initial',
    },

    '&:hover:not(.no-action)': {
      boxShadow: '0 11px 33px rgba(0, 0, 0, .12)',
      transform: 'translateY(-2px)'
    }
  },
  title: {
    padding: '0px 16px',
    paddingTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    padding: '0px 16px',
    '&:first-child': {
      paddingTop: 16,
    },
    marginTop: -2,
    fontSize: 12,
    opacity: .75,
  },
  image: {
    '& img': {width: '100%'},
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  }
});

export interface CardProps {
  image?: unknown,
  title?: unknown,
  subtitle?: unknown,
  onclick?: () => void,
}

export function Card(props: CardProps, renderer: RendererLike<Node>, content: Node[]) {
  return <div class={[classes().card, {'no-action': !props.onclick}]} onclick={() => (props.onclick || noop)()}>
    {props.image ? <div class={classes().image}>{props.image}</div> : ''}
    {props.title ? <div class={classes().title}>{props.title}</div>: ''}
    {props.subtitle ? <div class={classes().subtitle}>{props.subtitle}</div>: ''}
    <div class={classes().content}>{content}</div>
  </div>;
}
