import React, { Component } from 'react';
import Main from './../Main/Main.js';
import Signin from './../SignIn/SignIn.js';
import Signup from './../Signup/Signup.js';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  state = {
    page: 'signin',
    id: null
  };

  switch = page => {
    this.setState({ page });
  };

  setID = id => {
    this.setState({ id });
  };

  render = () => {
    return (
      <div id="app">
        {this.state.page === 'signin' && (
          <Signin switch={this.switch} setID={this.setID} />
        )}
        {this.state.page === 'main' && this.state.id && <Main switch={this.switch} id={this.state.id} />}
        {this.state.page === 'signup' && <Signup />}
      </div>
    );
  };
}

export default App;
