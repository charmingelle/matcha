import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  isEmailValid,
  isLoginValid,
  isPasswordValid,
  isFirstLastNameValid
} from './../../utils/utils.js';
import { signup } from './../../api/api.js';

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

class Signup extends React.Component {
  state = {
    email: '',
    login: '',
    password: '',
    passwordConfirm: '',
    firstname: '',
    lastname: '',
    error: false,
    message: ''
  };

  handleKeyPress = event => {
    if (keycode(event) === 'enter') {
      this.signup();
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  signup = () => {
    if (
      this.state.email === '' ||
      this.state.login === '' ||
      this.state.password === '' ||
      this.state.passwordConfirm === '' ||
      this.state.firstname === '' ||
      this.state.lastname === ''
    ) {
      this.setState({
        error: true,
        message: 'Please fill all the fields in'
      });
    } else if (!isEmailValid(this.state.email)) {
      this.setState({
        error: true,
        message: 'Invalid email address'
      });
    } else if (!isLoginValid(this.state.login)) {
      this.setState({
        error: true,
        message: 'Invalid login'
      });
    } else if (!isPasswordValid(this.state.password)) {
      this.setState({
        error: true,
        message: 'Invalid password'
      });
    } else if (this.state.password !== this.state.passwordConfirm) {
      this.setState({
        error: true,
        message: 'Invalid password confirm'
      });
    } else if (!isFirstLastNameValid(this.state.firstname)) {
      this.setState({
        error: true,
        message: 'Invalid first name'
      });
    } else if (!isFirstLastNameValid(this.state.lastname)) {
      this.setState({
        error: false,
        message: 'Invalid last name'
      });
    } else {
      this.setState({
        message: ''
      });
      signup(
        this.state.email,
        this.state.login,
        this.state.password,
        this.state.firstname,
        this.state.lastname
      )
        .then(res => {
          res.status === 200
            ? this.setState({
                error: false
              })
            : this.setState({
                error: true
              });
          return res.json();
        })
        .then(data =>
          this.setState({
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
        </form>
      </div>
    );
  };
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);
