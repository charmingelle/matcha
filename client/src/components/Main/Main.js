import React from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ChatIcon from '@material-ui/icons/Chat';
import CheckIcon from '@material-ui/icons/Check';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';
import Suggestions from './../Suggestions/Suggestions.js';
import Profile from './../Profile/Profile.js';
import User from './../User/User.js';
import Signin from '../Signin/Signin.js';
import Visited from './../Visited/Visited.js';
import Chat from './../Chat/Chat.js';
import Notifications from './../Notifications/Notifications.js';
import {
  getUserProfile,
  saveLocation,
  signout,
  getChatData,
  getSuggestions,
  getVisited,
  saveVisited,
} from './../../api/api.js';
import { styles } from './Main.styles';
import { withContext } from '../../utils/utils';

const TabContainer = props => (
  <Typography
    style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
    component="div"
  >
    {props.children}
  </Typography>
);

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

let socket = null;

class Main extends React.Component {
  state = {
    tabid: 0,
    profile: null,
    notifications: [],
    showMenu: false,
    tabName: 'Suggestions',
    chatData: null,
    suggestions: null,
  };

  ipLookUp = () => {
    fetch('http://ip-api.com/json', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => saveLocation([data.lat, data.lon]))
      .catch(error => console.error(error));
  };

  getLocation = userid => {
    navigator.geolocation.getCurrentPosition(
      position =>
        saveLocation([position.coords.latitude, position.coords.longitude]),
      () => this.ipLookUp(userid),
    );
  };

  addNotification = message => {
    let newNotifications = this.state.notifications;

    newNotifications.push(message);
    this.setState({
      notifications: newNotifications,
    });
  };

  addSocketEventListeners = () => {
    socket.on('like', data =>
      this.addNotification(`${data.sender} has just liked you`),
    );
    socket.on('check', data =>
      this.addNotification(`${data.sender} has just checked your profile`),
    );
    socket.on('chat', data => {
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
        chatData: newChatData,
      });
    });
    socket.on('likeBack', data => {
      this.addNotification(`${data.data.sender} has just liked you back!`);
      this.updateChatData(data.chatData);
    });
    socket.on('unlike', data => {
      this.addNotification(
        `Unfortunately ${data.data.sender} has disconnected from you`,
      );
      this.updateChatData(data.chatData);
    });
  };

  loadUserProfile = async () => {
    try {
      const { user, allInterests } = await getUserProfile();

      socket = socketIOClient({
        query: `login=${user.login}`,
      });
      this.addSocketEventListeners();
      this.props.context.set('profile', {
        firstname: user.firstname,
        lastname: user.lastname,
        login: user.login,
        email: user.email,
        age: user.age,
        gender: user.gender,
        preferences: user.preferences,
        bio: user.bio,
        interests: user.interests,
        gallery: user.gallery,
        avatarid: user.avatarid,
        location: user.location,
        allInterests: allInterests,
        changeStatus: null,
        error: false,
        canRenderLikeButton: user.gallery.length > 0,
      });
      this.setState(
        {
          profile: {
            firstname: user.firstname,
            lastname: user.lastname,
            login: user.login,
            email: user.email,
            age: user.age,
            gender: user.gender,
            preferences: user.preferences,
            bio: user.bio,
            interests: user.interests,
            gallery: user.gallery,
            avatarid: user.avatarid,
            location: user.location,
            allInterests: allInterests,
            changeStatus: null,
            error: false,
            canRenderLikeButton: user.gallery.length > 0,
          },
        },
        () => this.getLocation(user.id),
      );
    } catch (error) {
      this.setState({ profile: 'signin' });
    }
  };

  loadChatData = () =>
    getChatData().then(chatData => {
      this.props.context.set('chatData', chatData);
      this.setState({ chatData });
    }, console.error);

  loadSuggestions = () =>
    getSuggestions().then(suggestions => {
      this.props.context.set('suggestions', suggestions);
      this.setState({
        suggestions,
      });
    }, console.error);

  loadVisited = () =>
    getVisited().then(visited => {
      this.props.context.set('visited', visited);
      this.setState({ visited });
    }, console.error);

  componentDidMount = () =>
    Promise.all([
      this.loadUserProfile(),
      this.loadChatData(),
      this.loadSuggestions(),
      this.loadVisited(),
    ]);

  onProfileChange = target => this.setState({ profile: target });

  signout = () => signout().then(() => this.setState({ profile: 'signin' }));

  updateSuggestions = suggestions => this.setState({ suggestions });

  updateChatData = chatData => this.setState({ chatData });

  updateLog = (receiver, log) => {
    let newChatData = this.state.chatData;

    newChatData[receiver].log = log;
    this.setState({
      chatData: newChatData,
    });
  };

  updateVisited = visitedLogin => {
    if (
      !this.state.visited.map(profile => profile.login).includes(visitedLogin)
    ) {
      saveVisited(visitedLogin).then(visited => {
        socket.emit('check', {
          sender: this.state.profile.login,
          receiver: visitedLogin,
        });
        this.setState({
          visited,
        });
      });
    }
  };

  updateCanRenderLikeButton = canRenderLikeButton => {
    const newProfile = this.state.profile;

    newProfile.canRenderLikeButton = canRenderLikeButton;
    this.setState({
      profile: newProfile,
    });
  };

  closeNotification = index => {
    let newNotifications = this.state.notifications;

    newNotifications.splice(index, 1);
    this.setState({
      notifications: newNotifications,
    });
  };

  showMenu = () =>
    this.setState({
      showMenu: !this.state.showMenu,
    });

  changeTabName = tabName => () =>
    this.setState({
      tabName,
      showMenu: false,
    });

  handleMenuClose = event =>
    !this.anchorEl.contains(event.target) && this.setState({ showMenu: false });

  everythingLoaded = () =>
    this.state.profile &&
    this.state.chatData &&
    this.state.suggestions &&
    this.state.visited;

  getTabName = () => {
    let tabName = window.location.pathname.split('/')[1];

    tabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    return tabName === '' ? 'Suggestions' : tabName;
  };

  renderNotifications = () => (
    <Notifications
      messages={this.state.notifications}
      closeNotification={this.closeNotification}
    />
  );

  renderAppBar = () => {
    const { classes } = this.props;

    return (
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
            {this.getTabName()}
          </Typography>
          <Button color="inherit" onClick={this.signout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    );
  };

  renderMenuItem = (to, tabName, Icon) => {
    const { classes } = this.props;

    return (
      <MenuItem
        className={classes.menuItem}
        component={Link}
        to={to}
        onClick={this.changeTabName(tabName)}
      >
        <ListItemIcon className={classes.icon}>
          <Icon />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.primary }}
          inset
          primary={tabName}
        />
      </MenuItem>
    );
  };

  renderSideMenu = () => {
    const { classes } = this.props;
    const { showMenu, chatData } = this.state;

    return (
      <ClickAwayListener onClickAway={this.handleMenuClose}>
        <Paper className={showMenu ? classes.appMenu : classes.appMenuHidden}>
          <MenuList>
            {this.renderMenuItem('/', 'Suggestions', PeopleIcon)}
            {this.renderMenuItem('/profile', 'Profile', PersonIcon)}
            {Object.keys(chatData).length > 0 &&
              this.renderMenuItem(
                `/chat/${Object.keys(chatData)[0]}`,
                'Chat',
                ChatIcon,
              )}
            {this.renderMenuItem('/visited', 'Visited', CheckIcon)}
          </MenuList>
        </Paper>
      </ClickAwayListener>
    );
  };

  renderSlashRoute = () => {
    const {
      profile,
      profile: { login, canRenderLikeButton },
      suggestions,
      visited,
    } = this.state;

    return (
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
    );
  };

  renderProfileRoute = () => {
    const { profile, visited } = this.state;

    return (
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
    );
  };

  renderChatRoute = () => {
    const {
      profile: { login },
      chatData,
    } = this.state;

    return (
      Object.keys(chatData).length > 0 && (
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
      )
    );
  };

  renderChatReceiverRoute = () => {
    const {
      profile: { login },
      chatData,
    } = this.state;

    return (
      Object.keys(chatData).length > 0 && (
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
      )
    );
  };

  renderUserRoute = () => {
    const { classes } = this.props;
    const {
      profile: { login, canRenderLikeButton },
      suggestions,
      visited,
    } = this.state;

    return (
      <Route
        exact
        path="/users/:login"
        render={({ match }) => {
          let index = suggestions.indexOf(
            suggestions.find(
              suggestion => match.params.login === suggestion.login,
            ),
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
    );
  };

  renderVisitedRoute = () => {
    const {
      profile: { login, canRenderLikeButton },
      visited,
    } = this.state;

    return (
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
    );
  };

  renderRoutes = () => (
    <div className={this.props.classes.appContent}>
      {this.renderSlashRoute()}
      {this.renderProfileRoute()}
      {this.renderChatRoute()}
      {this.renderChatReceiverRoute()}
      {this.renderUserRoute()}
      {this.renderVisitedRoute()}
    </div>
  );

  render = () =>
    this.everythingLoaded() ? (
      this.state.profile === 'signin' ? (
        <Signin />
      ) : (
        <div className={this.props.classes.root}>
          {this.renderNotifications()}
          {this.renderAppBar()}
          {this.renderSideMenu()}
          {this.renderRoutes()}
        </div>
      )
    ) : (
      <span>Loading...</span>
    );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Main));
