import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { styles } from './Expired.styles';

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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Expired);
