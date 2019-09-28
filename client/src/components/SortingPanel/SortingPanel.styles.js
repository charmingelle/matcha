export const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 3,
    backgroundColor: '#ffffff',
    transform: 'translate(0px, 0px)',
    transition: 'transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  moved: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 3,
    backgroundColor: '#ffffff',
    transform: 'translate(0, -430px)',
    transition: 'transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  span: {
    color: 'rgba(0, 0, 0, 0.54)',
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
  selected: {
    color: '#3f51b5',
  },
});
