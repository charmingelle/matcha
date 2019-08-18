export const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: '568px',
    height: '100vh',
    backgroundColor: '#eeeeee',
  },
  appBar: {
    backgroundColor: '#3f51b5',
  },
  appMenu: {
    position: 'fixed',
    width: 200,
    height: '100%',
    zIndex: 2000,
    transform: 'translate(0px, 0px)',
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  appMenuHidden: {
    position: 'fixed',
    width: 200,
    height: '100%',
    zIndex: 2000,
    transform: 'translate(-200px, 0px)',
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  appContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  singleUserContainer: {
    display: 'flex',
    justifyContent: 'center',
    overflow: 'auto',
  },
};
