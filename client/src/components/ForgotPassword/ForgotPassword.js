import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { getResetPasswordEmail } from '../../api/api.js';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'fit-content'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    margin: '8px'
  }
});

class ForgotPassword extends React.Component {
  state = {
    email: '',
    message: '',
    error: false
  };

  handleKeyPress = event => {
    if (keycode(event) === 'enter') {
      this.getResetPasswordEmail();
    }
  };

  handleChange = event => {
    this.setState({
      email: event.target.value
    });
  };

  getResetPasswordEmail = () => {
    if (this.state.email === '') {
      this.setState({
        message: 'Please fill in your email',
        error: true
      });
    } else {
      this.setState({
        message: ''
      });
      getResetPasswordEmail(this.state.email).then(data =>
        this.setState({
          error: data.status === 'error',
          message: data.result
        })
      );
    }
  };

  renderMessage = () => {
    if (this.state.message !== '') {
      return (
        <TextField
          className={this.props.classes.textField}
          error={this.state.error}
          disabled
          value={this.state.message}
        />
      );
    }
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          {this.renderMessage()}
          <TextField
            label="Email"
            className={classes.textField}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={this.state.email}
          />
          <Button
            className={classes.button}
            onClick={this.getResetPasswordEmail}
          >
            Get reset password email
          </Button>
          <Link to="/">Home</Link>
        </div>
      </div>
    );
  };
}

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ForgotPassword);
