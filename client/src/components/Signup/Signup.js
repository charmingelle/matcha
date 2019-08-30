import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import {
  isEmailValid,
  isLoginValid,
  isPasswordValid,
  isFirstLastNameValid,
} from '../../utils/utils';
import { signup } from '../../api/api';
import { styles } from './Signup.styles';

class Signup extends React.Component {
  state = {
    email: '',
    login: '',
    password: '',
    passwordConfirm: '',
    firstname: '',
    lastname: '',
    error: false,
    message: '',
  };

  handleKeyPress = event => keycode(event) === 'enter' && this.signup();

  handleChange = name => event =>
    this.setState({
      [name]: event.target.value,
    });

  anyFieldIsEmpty = () =>
    this.state.email === '' ||
    this.state.login === '' ||
    this.state.password === '' ||
    this.state.passwordConfirm === '' ||
    this.state.firstname === '' ||
    this.state.lastname === '';

  setError = message =>
    this.setState({
      error: true,
      message,
    });

  makeSignupRequest = async () => {
    const { status, result } = await signup(
      this.state.email,
      this.state.login,
      this.state.password,
      this.state.firstname,
      this.state.lastname,
    );

    this.setState({
      error: status === 'error',
      message: result,
    });
  };

  signup = async () => {
    const {
      email,
      login,
      password,
      passwordConfirm,
      firstname,
      lastname,
    } = this.state;

    if (this.anyFieldIsEmpty()) {
      return this.setError('Please fill all the fields in');
    }
    if (!isEmailValid(email)) {
      return this.setError('Invalid email address');
    }
    if (!isLoginValid(login)) {
      return this.setError('Invalid login');
    }
    if (!isPasswordValid(password)) {
      return this.setError('Invalid password');
    }
    if (password !== passwordConfirm) {
      return this.setError('Invalid password confirm');
    }
    if (!isFirstLastNameValid(firstname)) {
      return this.setError('Invalid first name');
    }
    if (!isFirstLastNameValid(lastname)) {
      return this.setError('Invalid last name');
    }
    this.makeSignupRequest();
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

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form className={classes.container} noValidate autoComplete="off">
          {this.renderMessage()}
          <TextField
            label="Email"
            className={classes.textField}
            onChange={this.handleChange('email')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={this.state.email}
          />
          <TextField
            label="Login"
            className={classes.textField}
            onChange={this.handleChange('login')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={this.state.login}
          />
          <TextField
            label="Password"
            className={classes.textField}
            onChange={this.handleChange('password')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={this.state.password}
            type="password"
          />
          <TextField
            label="Confirm your password"
            className={classes.textField}
            onChange={this.handleChange('passwordConfirm')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={this.state.passwordConfirm}
            type="password"
          />
          <TextField
            label="First name"
            className={classes.textField}
            onChange={this.handleChange('firstname')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={this.state.firstname}
          />
          <TextField
            label="Last name"
            className={classes.textField}
            onChange={this.handleChange('lastname')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={this.state.lastname}
          />
          <Button className={classes.button} onClick={this.signup}>
            Sign Up
          </Button>
          <Link to="/">Home</Link>
        </form>
      </div>
    );
  };
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);
