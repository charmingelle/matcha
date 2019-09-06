import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { styles } from './Signin.styles';
import { withContext } from '../../utils/utils';

class Signin extends React.Component {
  api = this.props.context.api;

  state = {
    login: '',
    password: '',
    message: '',
  };

  handleKeyPress = event => keycode(event) === 'enter' && this.signin();

  handleChange = name => event =>
    this.setState({
      [name]: event.target.value,
    });

  anyFieldIsEmpty = () => this.state.login === '' || this.state.password === '';

  makeSigninRequest = async () => {
    const { login, password } = this.state;

    try {
      await this.api.signin(login, password);
      this.props.context.set('auth', true);
    } catch ({ message }) {
      this.setState({
        message,
      });
    }
  };

  signin = async () =>
    this.anyFieldIsEmpty()
      ? this.setState({
          message: 'Please fill all the fields in',
        })
      : this.makeSigninRequest();

  renderMessage = () =>
    this.state.message !== '' && (
      <TextField
        className={this.props.classes.textField}
        error
        disabled
        value={this.state.message}
      />
    );

  render = () => {
    const { classes } = this.props;
    const { login, password } = this.state;

    return (
      <div className={classes.root}>
        <form className={classes.container} noValidate autoComplete="off">
          {this.renderMessage()}
          <TextField
            label="Login"
            className={classes.textField}
            onChange={this.handleChange('login')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={login}
          />
          <TextField
            label="Password"
            className={classes.textField}
            onChange={this.handleChange('password')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={password}
            type="password"
          />
          <Button className={classes.button} onClick={this.signin}>
            Sign In
          </Button>
          <Link to="/signup">Sign Up</Link>
          <Link to="/forgot-password">Forgot Password?</Link>
        </form>
      </div>
    );
  };
}

Signin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Signin));
