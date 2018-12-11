import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import User from "./../User/User.js";
import { getVisited } from "./../../api/api.js";

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

class Visited extends React.Component {
  async componentDidMount() {
    this.props.changeTab(4);
    const data = await getVisited();

    this.setState({
      users: data
    });
  }

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ul className={classes.userList}>
          {this.state.users.map((user, index) => (
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

Visited.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Visited);
