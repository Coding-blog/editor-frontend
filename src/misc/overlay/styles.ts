import { style } from '../../util/style';

export const classes = style({
  overlayAttached: {
    position: 'fixed',
    zIndex: 100,
    top: 0,
    left: 0,
  },
  overlayWidget: {
    color: 'white',
    fontSize: 12,
    backdropFilter: 'blur(12px)',
    borderRadius: 7,
    background: 'rgba(0, 0, 0, .5)',
    padding: 8,
    textAlign: 'center',
    '& button': {
      color: 'white',
      flexGrow: 1,
      fontSize: 12,
      height: 24,
      minWidth: '0',
      fontWeight: 'normal',
      marginTop: 4,
      padding: 0,
      border: '1px solid rgba(255, 255, 255, .2)',
      background: 'transparent',
      transform: 'translateY(0)',
      transition: 'background .15s',
      '&:hover, &.active': {
        background: 'rgba(255, 255, 255, .1)'
      }
    },
  },
  overlayBackdrop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0, right: 0,
    top: 0, bottom: 0,
    position: 'fixed',
    background: 'rgba(0, 0, 0, .35)',
    backdropFilter: 'blur(12px)',
    opacity: 0,
    transition: 'opacity .15s',

    '&.active': {
      opacity: 1,
    }
  },
  dialog: {
    width: 512,
    maxHeight: '75vh',
    overflow: 'auto',
    background: 'white',
    borderRadius: 8,
    padding: 16,
  }
});
