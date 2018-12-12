import React, { Component } from "react";
import { signinOrMain } from "./../../api/api.js";
import Signin from "../Signin/Signin.js";
import Main from "../Main/Main.js";

export default class SigninOrMain extends Component {
  state = {
    page: null
  };

  componentDidMount = () => {
    signinOrMain()
      .then(response => response.json())
      .then(result => this.setState({ page: result.result }));
  };

  render = () => {
    if (!this.state.page) {
      return <span>Loading...</span>;
    }
    if (this.state.page === "signin") {
      return <Signin />;
    }
    return <Main />;
  };
}
