import React, { Component } from "react";
import Settings from "./../Settings/Settings.js";
import Profile from './../Profile/Profile.js'
import ProfilePhotos from './../ProfilePhotos/ProfilePhotos.js'

class App extends Component {
  render() {
    return (
      <div>
        {/* <Settings /> */}
        <ProfilePhotos />
        <Profile />
      </div>
    );
  }
}

export default App;
