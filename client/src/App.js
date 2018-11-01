import React, { Component } from "react";
import Settings from "./components/Settings/Settings.js";
import Profile from './containers/Profile/Profile.js'

class App extends Component {
  render() {
    return (
      <div>
        {/* <Settings /> */}
        <Profile />
      </div>
    );
  }
}

export default App;
