import React, { Component } from 'react';
import { resetPasswordOrExpired } from '../../api/api';
import ResetPassword from '../ResetPassword/ResetPassword';
import Expired from '../Expired/Expired';

export default class ResetPasswordOrExpired extends Component {
  state = {
    page: null,
  };

  goHome = () => this.props.history.push('/');

  validateEmailAndHash = (email, hash) =>
    this.setState({ email }, () =>
      resetPasswordOrExpired(email, hash).then(({ result }) =>
        this.setState({ page: result }),
      ),
    );

  parseParams = ([emailParam, hashParam]) =>
    emailParam.indexOf('?email=') === 0 && hashParam.indexOf('hash=') === 0
      ? this.goHome()
      : this.validateEmailAndHash(
          emailParam.substring(7),
          hashParam.substring(5),
        );

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
