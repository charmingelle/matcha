import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { styles } from './Expired.styles';

class Expired extends React.Component {
  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <TextField
            className={classes.textField}
            error={true}
            disabled
            value="This link has expired"
          />
          <div className={classes.linkContainer}>
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/">Home</Link>
          </div>
        </div>
      </div>
    );
  };
}

Expired.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Expired);
