import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import socketIOClient from "socket.io-client";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import ChatIcon from "@material-ui/icons/Chat";
import CheckIcon from "@material-ui/icons/Check";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
import MenuIcon from "@material-ui/icons/Menu";

import Suggestions from "./../Suggestions/Suggestions.js";
import Profile from "./../Profile/Profile.js";
import User from "./../User/User.js";
import Signin from "./../Signin/Signin.js";
import Visited from "./../Visited/Visited.js";
import Chat from "./../Chat/Chat.js";
import Notifications from "./../Notifications/Notifications.js";
import {
  getUserProfile,
  saveLocation,
  signout,
  getChatUsers,
  getSuggestions
} from "./../../api/api.js";

function TabContainer(props) {
  return (
    <Typography
      style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      component="div"
    >
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: "568px",
    height: "100vh",
    backgroundColor: "#eeeeee"
  },
  appBar: {
    backgroundColor: "#3f51b5"
  },
  appMenu: {
    position: "fixed",
    width: 200,
    height: "100%",
    zIndex: 2000,
    transform: "translate(0px, 0px)",
    transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms"
  },
  appMenuHidden: {
    position: "fixed",
    width: 200,
    height: "100%",
    zIndex: 2000,
    transform: "translate(-200px, 0px)",
    transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms"
  },
  appContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

let socket = null;

class Main extends React.Component {
  state = {
    tabid: 0,
    profile: null,
    notifications: [],
    showMenu: false,
    tabName: "Suggestions",
    chatUsers: null,
    suggestions: null
  };

  ipLookUp = userid => {
    fetch("http://ip-api.com/json", {
      method: "POST"
    })
      .then(response => response.json())
      .then(data => saveLocation([data.lat, data.lon]))
      .catch(error => console.error(error));
  };

  getLocation = userid => {
    navigator.geolocation.getCurrentPosition(
      position =>
        saveLocation([position.coords.latitude, position.coords.longitude]),
      () => this.ipLookUp(userid)
    );
  };

  addNotification = message => {
    let newNotifications = this.state.notifications;

    newNotifications.push(message);
    this.setState({
      notifications: newNotifications
    });
  };

  addSocketEventListeners = () => {
    socket.on("like", data =>
      this.addNotification(`${data.sender} has just liked you`)
    );
    socket.on("check", data =>
      this.addNotification(`${data.sender} has just checked your profile`)
    );
    socket.on("chat", data =>
      this.addNotification(`${data.sender} has sent you a message`)
    );
    socket.on("likeBack", data =>
      this.addNotification(`${data.sender} has just liked you back!`)
    );
    socket.on("unlike", data =>
      this.addNotification(
        `Unfortunately ${data.sender} has disconnected from you`
      )
    );
  };

  componentDidMount() {
    Promise.all([
      getUserProfile().then(
        data => {
          socket = socketIOClient("http://localhost:5000", {
            query: `login=${data.user.login}`
          });
          this.addSocketEventListeners();
          this.setState({
            profile: {
              firstname: data.user.firstname,
              lastname: data.user.lastname,
              login: data.user.login,
              email: data.user.email,
              age: data.user.age,
              gender: data.user.gender,
              preferences: data.user.preferences,
              bio: data.user.bio,
              interests: data.user.interests,
              gallery: data.user.gallery,
              avatarid: data.user.avatarid,
              location: data.user.location,
              visited: data.user.visited,
              allInterests: data.allInterests,
              changeStatus: null,
              error: false,
              canLike:
                data.user.gallery.filter(image => image !== "").length > 0
            }
          });
          // this.getLocation(data.user.id);
        },
        () => this.setState({ profile: "signin" })
      ),
      getChatUsers().then(
        chatUsers =>
          this.setState({
            chatUsers
          }),
        error => console.error(error)
      ),
      getSuggestions().then(
        suggestions =>
          this.setState({
            suggestions
          }),
        error => console.error(error)
      )
    ]);
  }

  onProfileChange = target => {
    this.setState({ profile: target });
  };

  signout = () => {
    signout().then(() => this.setState({ profile: "signin" }));
  };

  updateVisited = visited => {
    let newProfile = this.state.profile;

    newProfile.visited = visited;
    this.setState({
      profile: newProfile
    });
  };

  closeNotification = index => {
    let newNotifications = this.state.notifications;

    newNotifications.splice(index, 1);
    this.setState({
      notifications: newNotifications
    });
  };

  showMenu = () =>
    this.setState({
      showMenu: !this.state.showMenu
    });

  changeTabName = tabName =>
    this.setState({
      tabName,
      showMenu: false
    });

  handleMenuClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ showMenu: false });
  };

  render = () => {
    if (
      !this.state.profile ||
      !this.state.chatUsers ||
      !this.state.suggestions
    ) {
      return <span>Loading...</span>;
    }
    if (this.state.profile === "signin") {
      return <Signin />;
    }
    const { classes } = this.props;
    const {
      profile,
      profile: { visited, login, canLike },
      notifications,
      tabName,
      showMenu,
      chatUsers,
      suggestions
    } = this.state;

    return (
      <BrowserRouter>
        <div className={classes.root}>
          <Notifications
            messages={notifications}
            closeNotification={this.closeNotification}
          />

          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                onClick={this.showMenu}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                {tabName}
              </Typography>
              <Button color="inherit" onClick={this.signout}>
                Log out
              </Button>
            </Toolbar>
          </AppBar>

          <ClickAwayListener onClickAway={this.handleMenuClose}>
            <Paper
              className={showMenu ? classes.appMenu : classes.appMenuHidden}
            >
              <MenuList>
                <MenuItem
                  className={classes.menuItem}
                  component={Link}
                  to="/"
                  onClick={this.changeTabName.bind(this, "Suggestions")}
                >
                  <ListItemIcon className={classes.icon}>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.primary }}
                    inset
                    primary="Suggestions"
                  />
                </MenuItem>
                <MenuItem
                  className={classes.menuItem}
                  component={Link}
                  to="/profile"
                  onClick={this.changeTabName.bind(this, "Profile")}
                >
                  <ListItemIcon className={classes.icon}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.primary }}
                    inset
                    primary="Profile"
                  />
                </MenuItem>
                <MenuItem
                  className={classes.menuItem}
                  component={Link}
                  to={`/chat/${chatUsers[0].login}`}
                  onClick={this.changeTabName.bind(this, "Chat")}
                >
                  <ListItemIcon className={classes.icon}>
                    <ChatIcon />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.primary }}
                    inset
                    primary="Chat"
                  />
                </MenuItem>
                <MenuItem
                  className={classes.menuItem}
                  component={Link}
                  to="/visited"
                  onClick={this.changeTabName.bind(this, "Visited")}
                >
                  <ListItemIcon className={classes.icon}>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.primary }}
                    inset
                    primary="Visited"
                  />
                </MenuItem>
              </MenuList>
            </Paper>
          </ClickAwayListener>

          <div className={classes.appContent}>
            <Route
              exact
              path="/"
              render={() => (
                <TabContainer>
                  <Suggestions
                    socket={socket}
                    sender={login}
                    profile={profile}
                    visited={visited}
                    updateVisited={this.updateVisited}
                    suggestions={suggestions}
                  />
                </TabContainer>
              )}
            />
            <Route
              exact
              path="/profile"
              render={() => (
                <TabContainer>
                  <Profile
                    name="profile"
                    value={profile}
                    onChange={this.onProfileChange}
                    socket={socket}
                    sender={login}
                    editable={true}
                    visited={visited}
                    updateVisited={this.updateVisited}
                  />
                </TabContainer>
              )}
            />
            {/* <Route
              exact
              path="/chat"
              render={() => (
                <TabContainer>
                  <Chat socket={socket} sender={login} />
                </TabContainer>
              )}
            /> */}
            <Route
              exact
              path="/chat/:receiver"
              render={({ match }) => {
                if (
                  chatUsers
                    .map(chatLogin => chatLogin.login)
                    .includes(match.params.receiver)
                ) {
                  return (
                    <TabContainer>
                      <Chat
                        socket={socket}
                        sender={login}
                        receiver={match.params.receiver}
                        chatUsers={chatUsers}
                      />
                    </TabContainer>
                  );
                }
                return <span>Chat user not found</span>;
              }}
            />
            <Route
              exact
              path="/users/:login"
              render={({ match }) => {
                let index = -1;

                for (let i = 0; i < suggestions.length; i++) {
                  if (match.params.login === suggestions[i].login) {
                    index = i;
                    break;
                  }
                }
                if (index !== -1) {
                  return (
                    <TabContainer>
                      <User
                        user={suggestions[index]}
                        socket={socket}
                        sender={login}
                        canLike={canLike}
                        photoFolder="photos/"
                        full={true}
                        visited={visited}
                        updateVisited={this.updateVisited}
                      />
                    </TabContainer>
                  );
                }
                return <span>User not found</span>;
              }}
            />
            <Route
              exact
              path="/visited"
              render={() => (
                <TabContainer>
                  <Visited
                    socket={socket}
                    sender={login}
                    visited={visited}
                    updateVisited={this.updateVisited}
                  />
                </TabContainer>
              )}
            />
          </div>
        </div>
      </BrowserRouter>
    );
  };
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Main);
