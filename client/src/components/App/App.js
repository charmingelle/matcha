import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import SigninOrMain from './../SigninOrMain/SigninOrMain.js';
import Signup from './../Signup/Signup.js';
import ForgotPassword from './../ForgotPassword/ForgotPassword.js';
import ResetPasswordOrExpired from './../ResetPasswordOrExpired/ResetPasswordOrExpired.js';
import ActivateAccount from './../ActivateAccount/ActivateAccount.js';
import { Context } from '../../utils/utils';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export class App extends Component {
  state = {
    get: key => this.state[key],
    set: (key, value) => {
      const state = this.state;

      state[key] = value;
      this.setState(state);
    },
    remove: key => {
      const state = this.state;

      delete state[key];
      this.setState(state);
    },
  };

  render = () => {
    return (
      <Context.Provider value={this.state}>
        <BrowserRouter>
          <div>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route
              exact
              path="/reset-password"
              component={ResetPasswordOrExpired}
            />
            <Route exact path="/confirm" component={ActivateAccount} />
            <Route path="/" component={SigninOrMain} />
          </div>
        </BrowserRouter>
      </Context.Provider>
    );
  };
}
