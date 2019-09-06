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
  };

  handleKeyPress = event => keycode(event) === 'enter' && this.resetPassword();

  handleChange = name => event =>
    this.setState({
      [name]: event.target.value,
    });

  resetPassword = async () => {
    const { password, passwordConfirm, email } = this.state;

    if (password === '' || passwordConfirm === '') {
      return this.setState({
        error: true,
        message: 'Please fill all the fields in',
      });
    }
    if (!isPasswordValid(password)) {
      return this.setState({
        error: true,
        message: 'Invalid password',
      });
    }
    if (password !== passwordConfirm) {
      return this.setState({
        error: true,
        message: 'Invalid password confirm',
      });
    }
    const { result } = await this.api.resetPassword(password, email);

    this.setState({ error: false, message: result });
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
    const { password, passwordConfirm } = this.state;

    return (
      <div className={classes.root}>
        <form className={classes.container} noValidate autoComplete="off">
          {this.renderMessage()}
          <TextField
            label="Password"
            className={classes.textField}
            onChange={this.handleChange('password')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={password}
            type="password"
          />
          <TextField
            label="Confirm your password"
            className={classes.textField}
            onChange={this.handleChange('passwordConfirm')}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            value={passwordConfirm}
            type="password"
          />
          <Button className={classes.button} onClick={this.resetPassword}>
            Change password
          </Button>
          <Link to="/">Home</Link>
        </form>
      </div>
    );
  };
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(ResetPassword));
