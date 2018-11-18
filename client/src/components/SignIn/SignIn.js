import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Main from '../Main/Main.js';
import { signin } from '../../api/api.js';

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

class Signin extends React.Component {
  state = {
    login: '',
    password: '',
    message: '',
    main: false
  };

  handleKeyPress = event => {
    if (keycode(event) === 'enter') {
      this.signin();
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  signin = () => {
    if (this.state.login === '' || this.state.password === '') {
      this.setState({
        message: 'Please fill all the fields in'
      });
    } else {
      this.setState({
        message: ''
      });
      signin(this.state.login, this.state.password).then(res => {
        if (res.status === 200) {
          this.setState({
            main: true
          });
        } else {
          res.json().then(data =>
            this.setState({
              message: data.result
            })
          );
        }
      });
    }
  };

  renderMessage = () => {
    if (this.state.message !== '') {
      return (
        <TextField
          className={this.props.classes.textField}
          error
          disabled
          value={this.state.message}
        />
      );
    }
  };

  render = () => {
    const { classes } = this.props;

    if (this.state.main) {
      return <Main />;
    }
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
          <Button className={classes.button} onClick={this.signin}>
            Sign In
          </Button>
          <Link to={'/signup'}>Sign Up</Link>
          {/* <Button className={classes.button}>Forgot password?</Button> */}
        </form>
      </div>
    );
  };
}

Signin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signin);
