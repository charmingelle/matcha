import React, { Component } from 'react';
import Profile from './../Profile/Profile.js';
import Main from './../Main/Main.js';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  render() {
    return (
      <div>
        <Main />
      </div>
    );
  }
}

export default App;
