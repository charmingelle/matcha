import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getSuggestions } from "./../../api/api.js";

const styles = {
  root: {}
};

class Suggestions extends React.Component {
  componentDidMount = () => {
    console.log("this.props.profile", this.props.profile);
    this.props.changeTab(1);
    getSuggestions()
      .then(response => response.json())
      .then(data => this.setState({ users: data }));
  };

  getDistance = (pos1, pos2) => {
    let distance = Math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);

    // console.log('distance', distance);
    return distance;
  };

  sortUsersByLocation = () => {
    console.log("this.state.users", this.state.users);
    let sortedUsers = this.state.users;

    sortedUsers.sort(
      (a, b) =>
        this.getDistance(a.location, this.props.profile.location) -
        this.getDistance(b.location, this.props.profile.location)
    );
    console.log("sortedUsers", sortedUsers);
    sortedUsers.map(user => console.log(this.getDistance(user.location, this.props.profile.location)));
  };

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const { users } = this.state;

    this.sortUsersByLocation();
    return (
      <div className={classes.root}>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{`${user.login}: (${user.location[0]}, ${
              user.location[1]
            })`}</li>
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
