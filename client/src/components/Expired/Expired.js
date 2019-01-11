import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "fit-content"
  }
});

class Expired extends React.Component {
  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <span>
            Your link for reseting the password has expired. Please re-initiate
            the process of password reseting.
          </span>
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/">Home</Link>
        </div>
      </div>
    );
  };
}

Expired.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Expired);
