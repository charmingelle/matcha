import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getUsers, saveVisited } from "./../../api/api.js";
import FilterPanel from "./FilterPanel/FilterPanel.js";
import User from "./../User/User.js";

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "auto"
  },
  userList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  }
};

class Users extends React.Component {
  async componentDidMount() {
    this.props.changeTab(0);
    const data = await getUsers();

    this.setState({
      users: data,
      filteredUsers: data
    });
  }

  showFilteredUsers = filteredUsers => {
    this.setState({ filteredUsers });
  };

  addToVisited = login => {
    if (!this.props.visited.includes(login)) {
      let newVisited = this.props.visited;

      newVisited.push(login);
      saveVisited(newVisited).then(() => {
        this.props.socket.emit("check", {
          sender: this.props.sender,
          receiver: login
        });
        this.props.updateVisited(newVisited);
      });
    }
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FilterPanel
          profileLocation={this.props.profileLocation}
          interests={this.props.interests}
          users={this.state.users}
          filteredUsers={this.state.users}
          onChange={this.showFilteredUsers}
        />
        <ul className={classes.userList}>
          {this.state.filteredUsers.map((user, index) => (
            <li key={index}>
              <User
                photoFolder="users/photos/"
                user={user}
                full={false}
                socket={this.props.socket}
                sender={this.props.sender}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Users);
