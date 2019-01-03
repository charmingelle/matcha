import React, { Component } from "react";
import { resetPasswordOrExpired } from "./../../api/api.js";
import ResetPassword from "../ResetPassword/ResetPassword.js";
import Expired from "../Expired/Expired.js";

export default class ResetPasswordOrExpired extends Component {
  state = {
    page: null
  };

  componentDidMount = () => {
    if (this.props.location.search === "") {
      this.props.history.push("/");
    } else {
      let params = this.props.location.search.split("&");

      if (params.length !== 2) {
        this.props.history.push("/");
      } else {
        if (
          params[0].indexOf("?email=") !== 0 ||
          params[1].indexOf("hash=") !== 0
        ) {
          this.props.history.push("/");
        }
        this.setState({ email: params[0].substring(7) });
        resetPasswordOrExpired(params[0].substring(7), params[1].substring(5))
          .then(response => response.json())
          .then(result => this.setState({ page: result.result }));
      }
    }
  };

  render = () => {
    if (!this.state.page) {
      return <span>Loading...</span>;
    }
    if (this.state.page === "reset-password") {
      return <ResetPassword email={this.state.email} />;
    } else {
      return <Expired />;
    }
  };
}
