import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './Notification.styles';

class Notification extends React.Component {
  render = () => {
    const { classes, message, close, index } = this.props;

    return (
      <SnackbarContent
        className={classes.notification}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            {message}
          </span>
        }
        action={[
          <IconButton
            className={classes.close}
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={close.bind(this, index)}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    );
  };
}

Notification.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Notification);
