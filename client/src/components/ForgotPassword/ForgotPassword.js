import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { styles } from './ForgotPassword.styles';
import { withContext } from '../../utils/utils';

class ForgotPassword extends React.Component {
  state = {
    email: '',
    error: false,
    message: '',
  };

  handleKeyPress = event =>
    keycode(event) === 'enter' && this.getResetPasswordEmail();

  handleChange = event =>
    this.setState({
      email: event.target.value,
      message: '',
    });

  getResetPasswordEmail = () =>
    this.state.email === ''
      ? this.setState({
          error: true,
          message: 'Please fill in your email',
        })
      : this.props.context.api
          .getResetPasswordEmail(this.state.email)
          .then(() =>
            this.setState({
              error: false,
              message: 'Please check your email',
            }),
          )
          .catch(({ message }) =>
            this.setState({
              error: true,
              message: message,
            }),
          );

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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(ForgotPassword));
