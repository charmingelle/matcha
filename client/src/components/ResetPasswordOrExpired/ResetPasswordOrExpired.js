import React, { Component } from 'react';
import { withContext } from '../../utils/utils';
import ResetPassword from '../ResetPassword/ResetPassword';
import Expired from '../Expired/Expired';

class ResetPasswordOrExpired extends Component {
  api = this.props.context.api;

  state = {
    page: null,
  };

  goHome = () => this.props.history.push('/');

  validateEmailAndHash = (email, hash) =>
    this.api
      .resetPasswordOrExpired(email, hash)
      .then(() => this.setState({ page: 'reset-password', email }))
      .catch(() => this.setState({ page: 'expired' }));

  parseParams = ([emailParam, hashParam]) =>
    emailParam.indexOf('?email=') === 0 && hashParam.indexOf('hash=') === 0
      ? this.validateEmailAndHash(
          emailParam.substring(7),
          hashParam.substring(5),
        )
      : this.goHome();

  parseUrl = params =>
    params.length === 2 ? this.parseParams(params) : this.goHome();

  componentDidMount = () =>
    this.props.location.search === ''
      ? this.goHome()
      : this.parseUrl(this.props.location.search.split('&'));

  render = () =>
    this.state.page &&
    (this.state.page === 'reset-password' ? (
      <ResetPassword email={this.state.email} />
    ) : (
      <Expired />
    ));
}

export default withContext(ResetPasswordOrExpired);
