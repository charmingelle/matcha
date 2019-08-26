import React, { Component } from 'react';
import { signinOrMain } from '../../api/api';
import Signin from '../Signin/Signin';
import Main from '../Main/Main';

export default class SigninOrMain extends Component {
  state = {
    page: null,
  };

  componentDidMount = () =>
    signinOrMain()
      .then(response => response.json())
      .then(result => this.setState({ page: result.result }));

  render = () =>
    this.state.page ? (
      this.state.page === 'signin' ? (
        <Signin />
      ) : (
        <Main />
      )
    ) : null;
}
