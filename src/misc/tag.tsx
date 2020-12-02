import { RendererLike } from 'render-jsx';
import { noop } from '../util/noop';
import { style } from '../util/style';

const classes = style({
  tag: {
    background: '#363062',
    padding: '0px 4px',
    fontSize: 14,
    margin: 3,
    color: 'white',
    borderRadius: 3,
    whiteSpace: 'nowrap',

    '& img': {
      marginLeft: 4,
      cursor: 'pointer',
      width: 16,
      verticalAlign: 'middle',
    }
  },
});

export interface TagProps {
  onclick?: (event?: Event) => void;
}

export function Tag(props: TagProps, renderer: RendererLike<Node>, content: Node[]) {
  return <div class={classes().tag}
    style={{ cursor: (props.onclick && props.onclick !== noop) ? 'pointer' : 'initial'}}
    onclick={props.onclick || noop}>
    {content}
  </div>;
}
