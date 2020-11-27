import { style } from '../../util/style';

export const classes = style({
  dateWidget: {
    color: 'white',
    fontSize: 12,
    width: 168,
    backdropFilter: 'blur(12px)',
    borderRadius: 6,
    background: 'rgba(0, 0, 0, .5)',
    padding: 8,
    textAlign: 'center',

    '& button': {
      color: 'white',
      fontSize: 12,
      height: 24,
      width: 168,
      fontWeight: 'normal',
      padding: 0,
      border: '1px solid rgba(255, 255, 255, .2)',
      background: 'transparent',
      transform: 'translateY(0)',
      transition: 'background .15s',
      '&:hover': {
        background: 'rgba(255, 255, 255, .1)'
      }
    },
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #ffffff22',

    '& img': {
      width: 16,
      padding: 4,
      borderRadius: 3,
      cursor: 'pointer',
      transition: 'background .15s',
      '&:hover': { background: 'rgba(255, 255, 255, .2)' }
    },
    '& span': { display: 'block', flexGrow: 1 },
  },
  days: {
    display: 'inline-block',
    textAlign: 'left',
    '& span': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      border: '1px solid transparent',
      cursor: 'pointer',
      borderRadius: 3,
      transition: 'background .15s',
      '&:hover, &.selected': {
        background: 'rgba(255, 255, 255, .2)'
      },
      '&.today': {
        borderColor: 'rgba(255, 255, 255, .5)',
      }
    }
  }
});
