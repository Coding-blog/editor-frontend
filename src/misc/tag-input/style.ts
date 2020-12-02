import { style } from '../../util/style';


export const inputStyles = style({
  tagInput: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 3,
    paddingRight: 9,
    fontSize: 12,
    marginBottom: 8,

    '& input': {
      border: 'none',
      background: 'none',
      boxShadow: 'none',
      padding: 0,
      width: 'auto',
      flexGrow: 1,
      margin: 3,
    },
  },
});


export const suggestionStyles = style({
  item: {
    color: 'white',
    minWidth: 160,
    textAlign: 'left',
    padding: 4,
    cursor: 'pointer',
    borderRadius: 3,
    transition: 'background .15s',

    '&:hover, &.highlight': {
      background: 'rgba(255, 255, 255, .2)'
    }
  }
});
