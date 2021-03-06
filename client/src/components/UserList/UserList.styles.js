export const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'auto',
    padding: '10px',
  },
  userList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    transform: 'translate(0px, 0px)',
    transition: 'transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  moved: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    transform: 'translate(0, -430px)',
    transition: 'transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
};
