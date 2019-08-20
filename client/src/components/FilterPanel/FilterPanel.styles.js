export const styles = {
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
    backgroundColor: '#ffffff',
    transform: 'translate(0px, 0px)',
    transition: 'transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  hidden: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
    backgroundColor: '#ffffff',
    transform: 'translate(0, -430px)',
    transition: 'transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },
  ageFilter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
  },
  ageInputBlock: {
    display: 'flex',
    alignItems: 'center',
    width: 300,
    height: 40,
  },
  filter: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 8,
  },
  formControl: {
    marginBottom: 8,
  },
  slider: {
    WebkitAppearance: 'none',
    width: '100%',
    background: 'transparent',
    '&:focus': {
      outline: 'none',
    },
    '&::-webkit-slider-thumb': {
      WebkitAppearance: 'none',
      height: '36px',
      width: '16px',
      borderRadius: '4px',
      background: '#ffffff',
      cursor: 'pointer',
      marginTop: '-14px',
      boxShadow:
        '1px 1px 1px rgba(0, 0, 0, 0.7), 0px 0px 1px rgba(0, 0, 0, 0.7)',
    },
    '&::-webkit-slider-runnable-track': {
      width: '100%',
      height: '8.4px',
      cursor: 'pointer',
      background: '#3f51b5',
      borderRadius: '4px',
    },
  },
  labelAll: {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  spanAll: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  spanSpecial: {
    color: '#3f51b5',
  },
};
