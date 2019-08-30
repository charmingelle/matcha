import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import SigninOrMain from '../SigninOrMain/SigninOrMain';
import Signup from '../Signup/Signup';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import ResetPasswordOrExpired from '../ResetPasswordOrExpired/ResetPasswordOrExpired';
import ActivateAccount from '../ActivateAccount/ActivateAccount';
import { Context } from '../../utils/utils';
import { saveVisited } from '../../api/api';
import { CardActions } from '@material-ui/core';

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

  isUserNew = visitedLogin =>
    !this.state.visited.map(profile => profile.login).includes(visitedLogin);

  notifyVisited = (visited, visitedLogin) =>
    this.setState({ visited }, () =>
      this.state.socket.emit('check', {
        sender: this.state.profile.login,
        receiver: visitedLogin,
      }),
    );

  updateVisited = visitedLogin =>
    this.isUserNew(visitedLogin) &&
    saveVisited(visitedLogin).then(visited =>
      this.notifyVisited(visited, visitedLogin),
    );

  updateFameInSuggestions = (login, fame) => {
    const found = this.state.suggestions.find(user => user.login === login);

    if (found) {
      found.fame = fame;
      this.setState({ suggestions: [...this.state.suggestions, found] });
    }
  };

  updateFameInVisited = (login, fame) => {
    const found = this.state.visited.find(user => user.login === login);

    if (found) {
      found.fame = fame;
      this.setState({ visited: [...this.state.visited, found] });
    }
  };

  updateFame = (login, fame) => {
    this.updateFameInSuggestions(login, fame);
    this.updateFameInVisited(login, fame);
  };

  render = () => (
    <Context.Provider
      value={{
        ...this.state,
        get: this.get,
        set: this.set,
        updateCanRenderLikeButton: this.updateCanRenderLikeButton,
        updateVisited: this.updateVisited,
        updateFame: this.updateFame,
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
}
