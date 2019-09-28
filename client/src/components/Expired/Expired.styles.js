export const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '16px 8px',
  },
});
