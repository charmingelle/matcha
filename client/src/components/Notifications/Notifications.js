import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Notification from './Notification/Notification.js';

const styles = {
  root: {
    position: 'fixed',
    right: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 2000
  }
};

class Notifications extends React.Component {
  render = () => {
    const { classes, messages, closeNotification } = this.props;

    return (
      <div className={classes.root}>
        {messages.map((message, index) => (
          <Notification
            message={message}
            key={index}
            close={closeNotification}
            index={index}
          />
        ))}
      </div>
    );
  };
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Notifications);
