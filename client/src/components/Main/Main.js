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
import UserList from '../UserList/UserList';
import Profile from '../Profile/Profile';
import User from '../User/User';
import Signin from '../Signin/Signin';
import Chat from '../Chat/Chat';
import Notifications from '../Notifications/Notifications';
import {
  getUserProfile,
  saveLocation,
  signout,
  getChatData,
  getSuggestions,
  getVisited,
} from '../../api/api';
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

class Main extends React.Component {
  state = {
    tabid: 0,
    notifications: [],
    showMenu: false,
    tabName: 'Suggestions',
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

  chatIsVisible = user => {
    const urlParts = window.location.pathname.split('/');

    return urlParts[1] === 'chat' && urlParts[2] === user;
  };

  addSocketEventListeners = () => {
    this.props.context.socket.on('like', data =>
      this.addNotification(`${data.sender} has just liked you`),
    );
    this.props.context.socket.on('check', data =>
      this.addNotification(`${data.sender} has just checked your profile`),
    );
    this.props.context.socket.on('chat', data => {
      let newChatData = this.props.context.chatData;
      let user;

      if (data.sender !== this.props.context.profile.login) {
        user = data.sender;
        if (!this.chatIsVisible(user)) {
          this.addNotification(`${user} has sent you a message`);
        }
      } else {
        user = data.receiver;
      }
      newChatData[user].log.unshift(data);
      this.props.context.set('chatData', newChatData);
    });
    this.props.context.socket.on(
      'likeBack',
      ({ data: { sender }, chatData }) => {
        this.addNotification(`${sender} has just liked you back!`);
        this.props.context.set('chatData', chatData);
      },
    );
    this.props.context.socket.on('unlike', ({ data: { sender }, chatData }) => {
      this.addNotification(`Unfortunately ${sender} has disconnected from you`);
      this.props.context.set('chatData', chatData);
    });
  };

  loadUserProfile = async () => {
    try {
      const { user, allInterests } = await getUserProfile();

      this.props.context.set(
        'socket',
        socketIOClient({
          query: `login=${user.login}`,
        }),
      );
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
      this.getLocation(user.id);
    } catch (error) {
      this.props.context.set('profile', 'signin');
    }
  };

  loadChatData = () =>
    getChatData().then(
      chatData => this.props.context.set('chatData', chatData),
      console.error,
    );

  loadSuggestions = () =>
    getSuggestions().then(
      suggestions => this.props.context.set('suggestions', suggestions),
      console.error,
    );

  loadVisited = () =>
    getVisited().then(
      visited => this.props.context.set('visited', visited),
      console.error,
    );

  componentDidMount = () =>
    Promise.all([
      this.loadUserProfile(),
      this.loadChatData(),
      this.loadSuggestions(),
      this.loadVisited(),
    ]);

  signout = () =>
    signout().then(() => this.props.context.set('profile', 'signin'));

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
    this.props.context.profile &&
    this.props.context.chatData &&
    this.props.context.suggestions &&
    this.props.context.visited;

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
    const {
      classes,
      context: { chatData },
    } = this.props;
    const { showMenu } = this.state;

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

  renderRoute = (path, Component, props) => (
    <Route
      exact
      path={path}
      render={() => (
        <TabContainer>
          <Component {...props} />
        </TabContainer>
      )}
    />
  );

  renderChatRoute = () =>
    Object.keys(this.props.context.chatData).length > 0 && (
      <Route
        exact
        path="/chat"
        render={() => (
          <TabContainer>
            <Chat receiver={Object.keys(this.props.context.chatData)[0]} />
          </TabContainer>
        )}
      />
    );

  renderChatReceiverRoute = () =>
    Object.keys(this.props.context.chatData).length > 0 && (
      <Route
        exact
        path="/chat/:receiver"
        render={({ match }) =>
          Object.keys(this.props.context.chatData).includes(
            match.params.receiver,
          ) ? (
            <TabContainer>
              <Chat receiver={match.params.receiver} />
            </TabContainer>
          ) : (
            <div className={this.props.classes.routeErrorContainer}>
              User not found or unavailable for chatting.
            </div>
          )
        }
      />
    );

  getUserIndex = match =>
    this.props.context.suggestions.indexOf(
      this.props.context.suggestions.find(
        suggestion => match.params.login === suggestion.login,
      ),
    );

  renderUserRoute = () => (
    <Route
      exact
      path="/users/:login"
      render={({ match }) => {
        const index = this.getUserIndex(match);

        return index !== -1 ? (
          <TabContainer>
            <div className={this.props.classes.singleUserContainer}>
              <User user={this.props.context.suggestions[index]} full />
            </div>
          </TabContainer>
        ) : (
          <div className={this.props.classes.routeErrorContainer}>
            User not found or unavailable due to sexual preferences.
          </div>
        );
      }}
    />
  );

  renderRoutes = () => (
    <div className={this.props.classes.appContent}>
      {this.renderRoute('/', UserList, {
        users: this.props.context.suggestions,
      })}
      {this.renderRoute('/profile', Profile)}
      {this.renderChatRoute()}
      {this.renderChatReceiverRoute()}
      {this.renderUserRoute()}
      {this.renderRoute('/visited', UserList, {
        users: this.props.context.visited,
      })}
    </div>
  );

  render = () =>
    this.everythingLoaded() ? (
      this.props.context.profile === 'signin' ? (
        <Signin />
      ) : (
        <div className={this.props.classes.root}>
          {this.renderNotifications()}
          {this.renderAppBar()}
          {this.renderSideMenu()}
          {this.renderRoutes()}
        </div>
      )
    ) : null;
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Main));
