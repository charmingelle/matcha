import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Signup from '../Signup/Signup';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import ResetPasswordOrExpired from '../ResetPasswordOrExpired/ResetPasswordOrExpired';
import ActivateAccount from '../ActivateAccount/ActivateAccount';
import Signin from '../Signin/Signin';
import Main from '../Main/Main';
import { Context } from '../../utils/utils';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export class App extends Component {
  state = {
    auth: null,
    socket: null,
    profile: null,
    chatData: null,
    suggestions: null,
    visited: null,
    interests: null,
    likedBy: null,
    checkedBy: null,
    isBlockDialogOpen: false,
    isFakeDialogOpen: false,
    dialogLogin: null,
    dialogName: null,
  };

  get = key => this.state[key];

  set = (key, value) => this.setState({ [key]: value });

  updateCanLike = canLike =>
    this.setState({
      profile: { ...this.state.profile, canLike },
    });

  isUserNew = visitedLogin =>
    !this.state.visited.map(profile => profile.login).includes(visitedLogin);

  notifyVisited = (visited, visitedLogin) =>
    this.setState({ visited }, () =>
      this.state.socket.emit('check', {
        sender: this.state.profile.login,
        senderName: `${this.state.profile.firstname} ${this.state.profile.lastname}`,
        receiver: visitedLogin,
      }),
    );

  updateVisited = visitedLogin =>
    this.isUserNew(visitedLogin) &&
    this.saveVisited(visitedLogin).then(visited => {
      this.setState({ visited });
      this.notifyVisited(visited, visitedLogin);
    });

  updateFameInSuggestions = (login, fame) => {
    const found = this.state.suggestions.find(user => user.login === login);

    if (found) {
      found.fame = fame;
      this.setState({ suggestions: this.state.suggestions });
    }
  };

  updateFameInVisited = (login, fame) => {
    const found = this.state.visited.find(user => user.login === login);

    if (found) {
      found.fame = fame;
      this.setState({ visited: this.state.visited });
    }
  };

  updateFame = (login, fame) => {
    this.updateFameInSuggestions(login, fame);
    this.updateFameInVisited(login, fame);
  };

  componentDidMount = () => this.auth();

  render = () => (
    <BrowserRouter>
      <Context.Provider
        value={{
          ...this.state,
          get: this.get,
          set: this.set,
          updateCanLike: this.updateCanLike,
          updateVisited: this.updateVisited,
          updateFame: this.updateFame,
          api: {
            auth: this.auth,
            getProfile: this.getProfile,
            getLikedBy: this.getLikedBy,
            getCheckedBy: this.getCheckedBy,
            getAllinterests: this.getAllinterests,
            saveUserProfile: this.saveUserProfile,
            savePhoto: this.savePhoto,
            setAvatar: this.setAvatar,
            saveLocation: this.saveLocation,
            signin: this.signin,
            signout: this.signout,
            signup: this.signup,
            getResetPasswordEmail: this.getResetPasswordEmail,
            resetPasswordOrExpired: this.resetPasswordOrExpired,
            resetPassword: this.resetPassword,
            getLikeStatus: this.getLikeStatus,
            getVisited: this.getVisited,
            saveVisited: this.saveVisited,
            getChatData: this.getChatData,
            reportFake: this.reportFake,
            getBlockStatus: this.getBlockStatus,
            block: this.block,
            getSuggestions: this.getSuggestions,
            activateAccount: this.activateAccount,
          },
        }}
      >
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route
          exact
          path="/reset-password"
          component={ResetPasswordOrExpired}
        />
        <Route exact path="/confirm" component={ActivateAccount} />
        <Route
          path="/"
          component={
            this.state.auth === null
              ? null
              : this.state.auth === true
              ? Main
              : Signin
          }
        />
      </Context.Provider>
    </BrowserRouter>
  );

  auth = () =>
    fetch('/app/auth', {
      method: 'POST',
      credentials: 'include',
    }).then(res =>
      res.ok ? this.setState({ auth: true }) : this.setState({ auth: false }),
    );

  returnResOrError = async res => {
    if (res.status === 401) {
      return this.setState({ auth: false });
    }
    if (res.ok && res.json) {
      return res.json();
    }
    throw new Error(await res.json());
  };

  getProfile = () =>
    fetch('/profile', {
      method: 'GET',
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  getLikedBy = () =>
    fetch('/profile/likedBy', {
      method: 'GET',
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  getCheckedBy = () =>
    fetch('/profile/checkedBy', {
      method: 'GET',
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  getAllinterests = () =>
    fetch('/app/interests', {
      method: 'GET',
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  saveUserProfile = userInfo =>
    fetch('/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userInfo),
    }).then(res => this.returnResOrError(res));

  savePhoto = (photo, photoid) =>
    fetch('/profile/photo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ photo, photoid }),
    }).then(res => this.returnResOrError(res));

  setAvatar = avatarid =>
    fetch('/profile/avatar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ avatarid }),
    }).then(res => this.returnResOrError(res));

  saveLocation = location =>
    fetch('/profile/location', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ location }),
    }).then(res => this.returnResOrError(res));

  signin = (login, password) =>
    fetch('/app/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ login, password }),
    }).then(res => this.returnResOrError(res));

  signout = () =>
    fetch('/profile/signout', {
      method: 'PATCH',
      credentials: 'include',
    });

  signup = (email, login, password, firstname, lastname) =>
    fetch('/profile/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, login, password, firstname, lastname }),
    }).then(res => this.returnResOrError(res));

  getResetPasswordEmail = email =>
    fetch('app/password/reset/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    }).then(res => this.returnResOrError(res));

  resetPasswordOrExpired = (email, hash) =>
    fetch('/app/password/reset/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, hash }),
    }).then(res => this.returnResOrError(res));

  resetPassword = (password, email) =>
    fetch('/app/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password, email }),
    }).then(res => this.returnResOrError(res));

  getLikeStatus = login =>
    fetch(`/users/${login}/likeStatus`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  getVisited = () =>
    fetch('/users/visited', {
      method: 'GET',
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  saveVisited = visited =>
    fetch('/users/visited', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ visited }),
    }).then(res => this.returnResOrError(res));

  getChatData = () =>
    fetch('/chats', {
      method: 'GET',
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  reportFake = login =>
    fetch(`/users/${login}/fake`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  getBlockStatus = login =>
    fetch(`/users/${login}/blockStatus`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  block = (login, canBlock) =>
    fetch(`/users/${login}/block`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ canBlock }),
    });

  getSuggestions = () =>
    fetch('/users/suggestions', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }).then(res => this.returnResOrError(res));

  activateAccount = (email, hash) =>
    fetch('/profile/activate', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, hash }),
    }).then(res => this.returnResOrError(res));
}
