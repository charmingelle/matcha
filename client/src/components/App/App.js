import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import SigninOrMain from '../SigninOrMain/SigninOrMain';
import Signup from '../Signup/Signup';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import ResetPasswordOrExpired from '../ResetPasswordOrExpired/ResetPasswordOrExpired';
import ActivateAccount from '../ActivateAccount/ActivateAccount';
import { Context } from '../../utils/utils';
import { saveVisited } from '../../api/api';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export class App extends Component {
  state = {
    socket: null,
    profile: null,
    chatData: null,
    suggestions: null,
    visited: null,
  };

  get = key => this.state[key];

  set = (key, value) => this.setState({ [key]: value });

  updateCanRenderLikeButton = canRenderLikeButton =>
    this.setState({
      profile: { ...this.state.profile, canRenderLikeButton },
    });

  updateVisited = visitedLogin =>
    !this.state.visited.map(profile => profile.login).includes(visitedLogin) &&
    saveVisited(visitedLogin).then(visited => {
      this.state.socket.emit('check', {
        sender: this.state.profile.login,
        receiver: visitedLogin,
      });
      this.setState({ visited });
    });

  render = () => {
    return (
      <Context.Provider
        value={{
          ...this.state,
          get: this.get,
          set: this.set,
          updateCanRenderLikeButton: this.updateCanRenderLikeButton,
          updateVisited: this.updateVisited,
        }}
      >
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
