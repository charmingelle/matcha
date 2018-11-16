import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from './../Main/Main.js';
import Signin from '../Signin/Signin.js';
import Signup from './../Signup/Signup.js';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  render = () => {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/" component={Main} />
        </div>
      </BrowserRouter>
    );
  };
}

export default App;
