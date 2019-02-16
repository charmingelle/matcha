import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import { activateAccount } from "./../../api/api.js";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh"
  },
  textField: {
    margin: 8,
    width: 500
  },
  link: { margin: 8 }
});

class ActivateAccount extends React.Component {
  componentDidMount = () => {
    if (this.props.location.search === "") {
      this.setState({
        status: "error",
        result: "Invalid account activation link"
      });
    } else {
      let params = this.props.location.search.split("&");

      if (params.length !== 2) {
        this.setState({
          status: "error",
          result: "Invalid account activation link"
        });
      } else {
        if (
          params[0].indexOf("?email=") !== 0 ||
          params[1].indexOf("hash=") !== 0
        ) {
          this.setState({
            status: "error",
            result: "Invalid account activation link"
          });
        }
        this.setState({ email: params[0].substring(7) });
        activateAccount(params[0].substring(7), params[1].substring(5)).then(
          response => this.setState(response)
        );
      }
    }
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const { status, result } = this.state;

    return (
      <div className={classes.root}>
        <TextField
          className={classes.textField}
          error={status === "error"}
          disabled
          value={result}
        />
        <Link className={classes.link} to="/">
          Home
        </Link>
      </div>
    );
  };
}

ActivateAccount.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ActivateAccount);
