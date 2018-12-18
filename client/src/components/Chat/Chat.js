import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { BrowserRouter, Route, Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Room from "./Room/Room.js";

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    overflow: "hidden"
  },
  link: {
    textDecoration: "none"
  },
  users: {
    width: "20%",
    padding: "unset",
    borderRight: "1px solid rgba(0, 0, 0, 0.08)"
  },
  user: {
    padding: 5
  },
  selectedUser: {
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.08)"
  },
  onlineDot: {
    marginRight: 5,
    width: 5,
    height: 5,
    borderRadius: "100%",
    backgroundColor: "#3f51b5"
  }
});

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.users = {};
    this.props.chatUsers.forEach(
      user =>
        (this.users[user.login] = {
          online: user.online,
          log: [],
          message: "",
          avatar: user.gallery[user.avatarid]
        })
    );
  }

  componentDidMount = () => {
    this.setState({
      selectedUser: this.props.chatUsers[0].login
    });
  };

  updateLog = (receiver, log) => {
    this.users[receiver].log = log;
  };

  updateMessage = (receiver, message) => {
    this.users[receiver].message = message;
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { selectedUser } = this.state;
    const { classes, socket, sender, receiver } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav" className={classes.users}>
          {Object.keys(this.users).map((user, index) => (
            <Link className={classes.link} key={index} to={`/chat/${user}`}>
              <ListItem
                button
                className={
                  user === selectedUser ? classes.selectedUser : classes.user
                }
                onClick={() => this.setState({ selectedUser: user })}
              >
                <Avatar
                  alt={user}
                  src={`users/photos/${this.users[user].avatar}`}
                />
                <ListItemText primary={user} />
                {this.users[user].online && (
                  <div className={classes.onlineDot} />
                )}
              </ListItem>
              <Divider light />
            </Link>
          ))}
        </List>
        <Room
          socket={socket}
          sender={sender}
          receiver={receiver}
          log={this.users[receiver].log}
          message={this.users[receiver].message}
          updateLog={this.updateLog}
          updateMessage={this.updateMessage}
        />
      </div>
    );
  };
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
