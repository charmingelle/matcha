import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import { styles } from './ActivateAccount.styles';
import { withContext } from '../../utils/utils';

class ActivateAccount extends React.Component {
  showError = () =>
    this.setState({
      error: true,
      result: 'Invalid or expired link',
    });

  parseParams = params => {
    const [emailParam, hashParam] = params;

    emailParam.indexOf('?email=') !== 0 || hashParam.indexOf('hash=') !== 0
      ? this.showError()
      : this.props.context.api
          .activateAccount(emailParam.substring(7), hashParam.substring(5))
          .then(response => this.setState(response))
          .catch(this.showError);
  };

  countParams = params =>
    params.length === 2 ? this.parseParams(params) : this.showError();

  componentDidMount = () =>
    this.props.location.search === ''
      ? this.showError()
      : this.countParams(this.props.location.search.split('&'));

  render = () =>
    this.state ? (
      <div className={this.props.classes.root}>
        <TextField
          className={this.props.classes.textField}
          error={this.state.error}
          disabled
          value={this.state.result}
        />
        <Link className={this.props.classes.link} to="/">
          Home
        </Link>
      </div>
    ) : null;
}

ActivateAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(ActivateAccount));
