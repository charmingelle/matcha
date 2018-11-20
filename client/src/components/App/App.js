import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import SigninOrMain from './../SigninOrMain/SigninOrMain.js';
import Signup from './../Signup/Signup.js';
import ForgotPassword from './../ForgotPassword/ForgotPassword.js';
import ResetPasswordOrExpired from './../ResetPasswordOrExpired/ResetPasswordOrExpired.js';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  render = () => {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password"
            component={ResetPasswordOrExpired}
          />
          <Route path="/" component={SigninOrMain} />
        </div>
      </BrowserRouter>
    );
  };
}

export default App;
