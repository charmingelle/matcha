export const styles = theme => ({
  card: {
    margin: 30,
    width: 300,
    height: '100%',
  },
  photoContent: {
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
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
  likeBlock: {
    marginLeft: -12,
    display: 'flex',
    alignItems: 'center',
  },
  leftRightArea: {
    position: 'relative',
    height: 36,
  },
  right: {
    position: 'absolute',
    right: 0,
  },
  bold: {
    fontWeight: 500,
  },
});
