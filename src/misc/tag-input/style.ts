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


export const suggestionStyles = style({
  suggestions: {
    fontSize: 12,
    minWidth: 192,
    backdropFilter: 'blur(12px)',
    borderRadius: 6,
    background: 'rgba(0, 0, 0, .5)',
    padding: 8,
  },

  item: {
    color: 'white',
    padding: 4,
    cursor: 'pointer',
    borderRadius: 3,
    transition: 'background .15s',

    '&:hover, &.highlight': {
      background: 'rgba(255, 255, 255, .2)'
    }
  }
});
