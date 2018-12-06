import React from "react";
import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from "@material-ui/core/styles";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";

const styles = theme => ({
  notification: {
    backgroundColor: green[600]
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

class Notification extends React.Component {
  render = () => {
    const { classes, message } = this.props;

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
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.props.close}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>
        ]}
      />
    );
  };
}

Notification.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Notification);
