import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getSuggestions } from "./../../api/api.js";

const styles = {
  root: {}
};

class Suggestions extends React.Component {
  componentDidMount = () => {
    this.props.changeTab(1);
    getSuggestions()
      .then(response => response.json())
      .then(data => this.setState({ users: data }));
  };

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const { users } = this.state

    return (
      <div className={classes.root}>
        <ul>{
          users.map((user, index) => <li key={index}>{user.login}</li>)
        }</ul>
      </div>
    );
  }
}

Suggestions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Suggestions);
