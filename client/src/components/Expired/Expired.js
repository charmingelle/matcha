import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { styles } from './Expired.styles';

class Expired extends React.Component {
  render = () => (
    <div className={this.props.classes.root}>
      <div className={this.props.classes.container}>
        <TextField
          className={this.props.classes.textField}
          error={true}
          disabled
          value="Invalid or expired link"
        />
        <div className={this.props.classes.linkContainer}>
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link className={this.props.classes.homeLink} to="/">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

Expired.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Expired);
