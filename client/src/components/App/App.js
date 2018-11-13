import React, { Component } from 'react';
import Profile from './../Profile/Profile.js';
import Main from './../Main/Main.js';
import Signin from './../SignIn/SignIn.js';
import Signup from './../Signup/Signup.js';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  state = {
    signedIn: false
  };

  changeSigninStatus = status => {
    this.setState({
      signedIn: status
    });
  };

  render = () => {
    return (
      <div id="app">
        {/* {this.state.signedIn ? (
          <Main changeSigninStatus={this.changeSigninStatus} />
        ) : (
          <Signin changeSigninStatus={this.changeSigninStatus} />
        )} */}
        <Signup />
      </div>
    );
  };
}

export default App;
