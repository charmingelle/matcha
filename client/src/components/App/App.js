import React, { Component } from 'react';
import Main from './../Main/Main.js';
import Signin from './../SignIn/SignIn.js';
import Signup from './../Signup/Signup.js';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  state = {
    page: 'signin'
  };

  switch = page => {
    this.setState({
      page
    });
  };

  render = () => {
    return (
      <div id="app">
        {this.state.page === 'signin' && <Signin switch={this.switch} />}
        {this.state.page === 'main' && <Main switch={this.switch} />}
        {this.state.page === 'signup' && <Signup />}
      </div>
    );
  };
}

export default App;
