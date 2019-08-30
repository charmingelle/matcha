export const styles = {
  chat: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
  },
  chatWindow: {
    height: '80vh',
    flexGrow: 1,
    overflow: 'auto',
    borderBottom: '1px solid #e9e9e9',
  },
  outputs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  outputOther: {
    position: 'relative',
    marginRight: '10%',
    marginTop: 5,
    width: '80%',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    '&:last-child': {
      marginBottom: 5,
    },
  },
  outputMine: {
    position: 'relative',
    marginLeft: '10%',
    marginTop: 5,
    width: '80%',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    backgroundColor: 'rgba(245, 0, 87, 0.1)',
    '&:last-child': {
      marginBottom: 5,
    },
  },
  messageText: {
    margin: 0,
  },
  messageTime: {
    textAlign: 'end',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.54)',
  },
  typing: {
    width: '80%',
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  message: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffffff',
  },
  send: {
    padding: '18px 0',
    width: '100%',
    border: 'none',
    outline: '1px solid #e9e9e9',
  },
};
