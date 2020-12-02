import { style } from '../../util/style';

export const classes = style({
  watch: {
    position: 'relative',
    width: 168,
    height: 168,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& b': {
      position: 'absolute',
      opacity: .15,
    },

    '& span': {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      width: 24,
      height: 24,
      borderRadius: 3,
      transition: 'background .15s',

      '&:hover, &.selected': {
        background: 'rgba(255, 255, 255, .2)'
      },
    },
  },

  handle: {
    position: 'absolute',
    cursor: 'pointer',
    width: 32,
    height: 4,
    background: 'rgba(255, 255, 255, .35)',
    marginLeft: 30,
    borderRadius: 4,
    transformOrigin: '2px 2px',
    transition: 'background .15s',

    '&.minute': {
      width: 48,
      marginLeft: 46,
    },

    '&:hover, &.active': {
      background: 'rgba(255, 255, 255, .75)',
    }
  },

  controls: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 17,
    gap: 6,
  }
});
