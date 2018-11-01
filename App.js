import React, { Component } from 'react';
import './App.css';
import Settings from './components/Settings/Settings.js';
import Profile from './containers/Profile/Profile'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Settings />
        {/* <Profile /> */}
      </div>
    );
  }
}

export default App;
