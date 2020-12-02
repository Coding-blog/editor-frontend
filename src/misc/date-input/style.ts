import { style } from '../../util/style';

export const classes = style({
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
    width: 168,
    height: 6 * 24,
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
