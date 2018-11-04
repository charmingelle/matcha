import React, { Component } from "react";
import Settings from "./../Settings/Settings.js";
import Profile from './../Profile/Profile.js'

class App extends Component {
  render() {
    return (
      <div>
        <Settings />
        <Profile />
      </div>
    );
  }
}

export default App;
