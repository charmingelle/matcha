export const styles = theme => ({
  card: {
    margin: 50,
    width: 500,
    height: '100%',
  },
  photoContent: {
    height: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  fameNote: {
    marginRight: 8,
    fontWeight: 'bold',
  },
  leftRightArea: {
    position: 'relative',
    height: 30,
  },
  right: {
    position: 'absolute',
    right: 0,
  },
  bold: {
    fontWeight: 500,
  },
});
