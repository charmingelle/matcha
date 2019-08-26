import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Main from '../Main/Main';
import { signin } from '../../api/api';
import { styles } from './Signin.styles';

class Signin extends React.Component {
  state = {
    login: '',
    password: '',
    message: '',
    main: false,
  };

  handleKeyPress = event => keycode(event) === 'enter' && this.signin();

  handleChange = name => event =>
    this.setState({
      [name]: event.target.value,
    });

  anyFieldIsEmpty = () => this.state.login === '' || this.state.password === '';

  signin = async () => {
    if (this.anyFieldIsEmpty()) {
      return this.setState({
        message: 'Please fill all the fields in',
      });
    }
    const { status, result } = await signin(
      this.state.login,
      this.state.password,
    );

    status === 'success'
      ? this.setState({
          main: true,
        })
      : this.setState({
          message: result,
        });
  };

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
    const { main, login, password } = this.state;

    return main ? (
      <Main />
    ) : (
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

export default withStyles(styles)(Signin);
