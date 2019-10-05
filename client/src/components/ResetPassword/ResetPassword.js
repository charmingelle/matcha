import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { withContext, isPasswordValid } from '../../utils/utils';
import { styles } from './ResetPassword.styles';

class ResetPassword extends React.Component {
  api = this.props.context.api;

  state = {
    password: '',
    passwordConfirm: '',
    error: false,
    message: '',
    email: this.props.email,
    areControlsDisplayed: true,
  };

  handleKeyPress = event => keycode(event) === 'enter' && this.resetPassword();

  handleChange = name => event =>
    this.setState({
      [name]: event.target.value,
      message: '',
    });

  resetPassword = () => {
    const { password, passwordConfirm, email } = this.state;

    if (password === '' || passwordConfirm === '') {
      return this.setState({
        error: true,
        message: 'Please fill all the fields in',
      });
    }
    if (!isPasswordValid(password)) {
      return this.setState({ error: true, message: 'Invalid password' });
    }
    if (password !== passwordConfirm) {
      return this.setState({
        error: true,
        message: 'Invalid password confirm',
      });
    }
    this.api
      .resetPassword(password, email)
      .then(() =>
        this.setState({
          error: false,
          message: 'Your password has been changed',
          areControlsDisplayed: false,
        }),
      )
      .catch(() => this.setState({ error: true, message: 'Please try again' }));
  };

  renderMessage = () =>
    this.state.message !== '' && (
      <TextField
        className={this.props.classes.textField}
        error={this.state.error}
        disabled
        value={this.state.message}
      />
    );

  renderControls = () => (
    <>
      <TextField
        label="Password"
        className={this.props.classes.textField}
        onChange={this.handleChange('password')}
        onKeyPress={this.handleKeyPress}
        margin="normal"
        value={this.state.password}
        type="password"
      />
      <TextField
        label="Confirm your password"
        className={this.props.classes.textField}
        onChange={this.handleChange('passwordConfirm')}
        onKeyPress={this.handleKeyPress}
        margin="normal"
        value={this.state.passwordConfirm}
        type="password"
      />
      <Button
        className={this.props.classes.button}
        onClick={this.resetPassword}
      >
        Change password
      </Button>
    </>
  );

  render = () => (
    <div className={this.props.classes.root}>
      <form
        className={this.props.classes.container}
        noValidate
        autoComplete="off"
      >
        {this.renderMessage()}
        {this.state.areControlsDisplayed && this.renderControls()}
      </form>
      <Link className={this.props.classes.link} to="/">
        Home
      </Link>
    </div>
  );
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(ResetPassword));
