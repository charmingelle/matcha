import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
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

class Visited extends React.Component {
  render = () => {
    const {
      classes,
      visited,
      socket,
      sender,
      updateVisited,
      updateChatData
    } = this.props;

    return (
      <div className={classes.root}>
        <ul className={classes.userList}>
          {visited.map((user, index) => (
            <li key={index}>
              <User
                user={user}
                full={false}
                socket={socket}
                sender={sender}
                updateVisited={updateVisited}
                updateChatData={updateChatData}
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
