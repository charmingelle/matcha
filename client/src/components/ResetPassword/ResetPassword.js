import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { isPasswordValid } from '../../utils/utils';
import { resetPassword } from '../../api/api';
import { styles } from './ResetPassword.styles';

class ResetPassword extends React.Component {
  state = {
    password: '',
    passwordConfirm: '',
    error: false,
    message: '',
  };

  componentDidMount = () => {
    this.setState({
      email: this.props.email,
    });
  };

  handleKeyPress = event => {
    if (keycode(event) === 'enter') {
      this.resetPassword();
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  resetPassword = () => {
    if (this.state.password === '' || this.state.passwordConfirm === '') {
      this.setState({
        error: true,
        message: 'Please fill all the fields in',
      });
    } else if (!isPasswordValid(this.state.password)) {
      this.setState({
        error: true,
        message: 'Invalid password',
      });
    } else if (this.state.password !== this.state.passwordConfirm) {
      this.setState({
        error: true,
        message: 'Invalid password confirm',
      });
    } else {
      resetPassword(this.state.password, this.state.email)
        .then(response => response.json())
        .then(data => this.setState({ error: false, message: data.result }));
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

export default withStyles(styles)(ResetPassword);
