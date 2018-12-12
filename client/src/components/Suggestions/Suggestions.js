import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getSuggestions } from "./../../api/api.js";
import SortingPanel from "./../SortingPanel/SortingPanel.js";
import FilterPanel from "./../FilterPanel/FilterPanel.js";

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

  updateUsers = sortedUsers => {
    this.setState({
      users: sortedUsers
    });
  };

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const { users } = this.state;

    return (
      <div className={classes.root}>
        <SortingPanel
          profile={this.props.profile}
          users={users}
          updateUsers={this.updateUsers}
        />
        <FilterPanel />
        <ul>
          {users.map((user, index) => (
            <li key={index}>{`${user.login}: age ${user.age}, location (${
              user.location[0]
            }, ${user.location[1]}), fame ${user.fame}, interests ${
              user.interests
            }
            `}</li>
          ))}
        </ul>
      </div>
    );
  }
}

Suggestions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Suggestions);
