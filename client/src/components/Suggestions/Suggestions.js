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
      .then(data => {
        data.forEach(user => {
          user.distance = this.getDistance(
            this.props.profile.location,
            user.location
          );
          user.amountOfCommonInterests = user.interests.filter(
            value => -1 !== this.props.profile.interests.indexOf(value)
          ).length;
        });
        this.setState({ users: data, filteredUsers: data });
      });
  };

  getDistance = (pos1, pos2) =>
    Math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);

  updateUsers = newUsers => {
    this.setState({
      filteredUsers: newUsers
    });
  };

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const { users, filteredUsers } = this.state;

    return (
      <div className={classes.root}>
        <SortingPanel
          profile={this.props.profile}
          users={filteredUsers}
          updateUsers={this.updateUsers}
        />
        <FilterPanel
          profile={this.props.profile}
          users={users}
          updateUsers={this.updateUsers}
        />
        <ul>
          {filteredUsers.map((user, index) => (
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
