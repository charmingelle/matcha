export const styles = {
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  users: {
    width: '20%',
    padding: 'unset',
    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
  },
  chatLink: {
    textDecoration: 'none',
  },
  user: {
    display: 'flex',
    padding: 0,
  },
  selectedUser: {
    display: 'flex',
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  userLink: {
    margin: 10,
  },
  userNameContainer: {
    width: '100%',
    display: 'flex',
  },
  userName: {
    width: '80%',
    padding: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  onlineDotContainer: {
    width: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 5,
    height: 5,
    borderRadius: '100%',
    backgroundColor: '#3f51b5',
  },
};
