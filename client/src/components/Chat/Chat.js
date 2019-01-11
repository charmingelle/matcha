import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
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
  render = () => {
    const {
      classes,
      socket,
      sender,
      receiver,
      chatData,
      updateLog
    } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav" className={classes.users}>
          {Object.keys(chatData).map((login, index) => {
            const avatar =
              chatData[login].gallery.length > 0
                ? chatData[login].gallery[chatData[login].avatarid]
                : "avatar.png";

            return (
              <Link className={classes.link} key={index} to={`/chat/${login}`}>
                <ListItem
                  button
                  className={
                    login === receiver ? classes.selectedUser : classes.user
                  }
                >
                  <Avatar
                    alt={login}
                    src={require(`../../../photos/${avatar}`)}
                  />
                  <ListItemText primary={login} />
                  {chatData[login].online && (
                    <div className={classes.onlineDot} />
                  )}
                </ListItem>
                <Divider light />
              </Link>
            );
          })}
        </List>
        <Room
          socket={socket}
          sender={sender}
          receiver={receiver}
          log={chatData[receiver].log}
          updateLog={updateLog}
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
