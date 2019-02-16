import React from "react";
import { Route, Link } from "react-router-dom";
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
import Signin from "../Signin/Signin.js";
import Visited from "./../Visited/Visited.js";
import Chat from "./../Chat/Chat.js";
import Notifications from "./../Notifications/Notifications.js";
import {
  getUserProfile,
  saveLocation,
  signout,
  getChatData,
  getSuggestions,
  getVisited,
  saveVisited
} from "./../../api/api.js";

const TabContainer = props => (
  <Typography
    style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
    component="div"
  >
    {props.children}
  </Typography>
);

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = {
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
  },
  singleUserContainer: {
    display: "flex",
    justifyContent: "center",
    overflow: "auto"
  }
};

let socket = null;

class Main extends React.Component {
  state = {
    tabid: 0,
    profile: null,
    notifications: [],
    showMenu: false,
    tabName: "Suggestions",
    chatData: null,
    suggestions: null
  };

  ipLookUp = () => {
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
    socket.on("chat", data => {
      let newChatData = this.state.chatData;
      let user;

      if (data.sender !== this.state.profile.login) {
        user = data.sender;
        this.addNotification(`${user} has sent you a message`);
      } else {
        user = data.receiver;
      }
      newChatData[user].log.unshift(data);
      this.setState({
        chatData: newChatData
      });
    });
    socket.on("likeBack", data => {
      this.addNotification(`${data.data.sender} has just liked you back!`);
      this.updateChatData(data.chatData);
    });
    socket.on("unlike", data => {
      this.addNotification(
        `Unfortunately ${data.data.sender} has disconnected from you`
      );
      this.updateChatData(data.chatData);
    });
  };

  componentDidMount() {
    Promise.all([
      getUserProfile().then(
        data => {
          socket = socketIOClient({
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
              allInterests: data.allInterests,
              changeStatus: null,
              error: false,
              canRenderLikeButton: data.user.gallery.length > 0
            }
          });
          this.getLocation(data.user.id);
        },
        () => this.setState({ profile: "signin" })
      ),
      getChatData().then(
        chatData => this.setState({ chatData }),
        error => console.error(error)
      ),
      getSuggestions().then(
        suggestions =>
          this.setState({
            suggestions
          }),
        error => console.error(error)
      ),
      getVisited().then(
        visited => this.setState({ visited }),
        error => console.error(error)
      )
    ]);
  }

  onProfileChange = target => this.setState({ profile: target });

  signout = () => signout().then(() => this.setState({ profile: "signin" }));

  updateSuggestions = suggestions => this.setState({ suggestions });

  updateChatData = chatData => this.setState({ chatData });

  updateLog = (receiver, log) => {
    let newChatData = this.state.chatData;

    newChatData[receiver].log = log;
    this.setState({
      chatData: newChatData
    });
  };

  updateVisited = visitedLogin => {
    if (
      !this.state.visited.map(profile => profile.login).includes(visitedLogin)
    ) {
      saveVisited(visitedLogin).then(visited => {
        socket.emit("check", {
          sender: this.state.profile.login,
          receiver: visitedLogin
        });
        this.setState({
          visited
        });
      });
    }
  };

  updateCanRenderLikeButton = canRenderLikeButton => {
    const newProfile = this.state.profile;

    newProfile.canRenderLikeButton = canRenderLikeButton;
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
    let tabName = window.location.pathname.split("/")[1];

    tabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    if (tabName === "") {
      tabName = "Suggestions";
    }
    if (
      !this.state.profile ||
      !this.state.chatData ||
      !this.state.suggestions ||
      !this.state.visited
    ) {
      return <span>Loading...</span>;
    }
    if (this.state.profile === "signin") {
      return <Signin />;
    }
    const { classes } = this.props;
    const {
      profile,
      profile: { login, canRenderLikeButton },
      notifications,
      showMenu,
      chatData,
      suggestions,
      visited
    } = this.state;

    return (
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
          <Paper className={showMenu ? classes.appMenu : classes.appMenuHidden}>
            <MenuList>
              <MenuItem
                className={classes.menuItem}
                component={Link}
                to="/"
                onClick={() => this.changeTabName("Suggestions")}
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
                onClick={() => this.changeTabName("Profile")}
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
              {Object.keys(chatData).length > 0 && (
                <MenuItem
                  className={classes.menuItem}
                  component={Link}
                  to={`/chat/${Object.keys(chatData)[0]}`}
                  onClick={() => this.changeTabName("Chat")}
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
              )}
              <MenuItem
                className={classes.menuItem}
                component={Link}
                to="/visited"
                onClick={() => this.changeTabName("Visited")}
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
            render={() => {
              return (
                <TabContainer>
                  <Suggestions
                    socket={socket}
                    sender={login}
                    profile={profile}
                    visited={visited}
                    updateVisited={this.updateVisited}
                    suggestions={suggestions}
                    updateChatData={this.updateChatData}
                    canRenderLikeButton={canRenderLikeButton}
                  />
                </TabContainer>
              );
            }}
          />
          <Route
            exact
            path="/profile"
            render={() => {
              return (
                <TabContainer>
                  <Profile
                    name="profile"
                    value={profile}
                    onChange={this.onProfileChange}
                    editable={true}
                    visited={visited}
                    updateVisited={this.updateVisited}
                    updateSuggestions={this.updateSuggestions}
                    updateCanRenderLikeButton={this.updateCanRenderLikeButton}
                  />
                </TabContainer>
              );
            }}
          />
          {Object.keys(chatData).length > 0 && (
            <Route
              exact
              path="/chat"
              render={() => {
                return (
                  <TabContainer>
                    <Chat
                      socket={socket}
                      sender={login}
                      receiver={Object.keys(chatData)[0]}
                      chatData={chatData}
                      updateLog={this.updateLog}
                    />
                  </TabContainer>
                );
              }}
            />
          )}
          {Object.keys(chatData).length > 0 && (
            <Route
              exact
              path="/chat/:receiver"
              render={({ match }) => {
                if (Object.keys(chatData).includes(match.params.receiver)) {
                  return (
                    <TabContainer>
                      <Chat
                        socket={socket}
                        sender={login}
                        receiver={match.params.receiver}
                        chatData={chatData}
                        updateLog={this.updateLog}
                      />
                    </TabContainer>
                  );
                }
                return <span>Chat user not found</span>;
              }}
            />
          )}
          <Route
            exact
            path="/users/:login"
            render={({ match }) => {
              let index = suggestions.indexOf(
                suggestions.find(
                  suggestion => match.params.login === suggestion.login
                )
              );

              if (index !== -1) {
                return (
                  <TabContainer>
                    <div className={classes.singleUserContainer}>
                      <User
                        user={suggestions[index]}
                        socket={socket}
                        sender={login}
                        full={true}
                        visited={visited}
                        updateVisited={this.updateVisited}
                        updateChatData={this.updateChatData}
                        canRenderLikeButton={canRenderLikeButton}
                      />
                    </div>
                  </TabContainer>
                );
              }
              return <span>User not found</span>;
            }}
          />
          <Route
            exact
            path="/visited"
            render={() => {
              return (
                <TabContainer>
                  <Visited
                    socket={socket}
                    sender={login}
                    visited={visited}
                    updateVisited={this.updateVisited}
                    updateChatData={this.updateChatData}
                    canRenderLikeButton={canRenderLikeButton}
                  />
                </TabContainer>
              );
            }}
          />
        </div>
      </div>
    );
  };
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Main);
