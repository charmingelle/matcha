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
  getProfile,
  saveLocation,
  signout,
  getChatData,
  getSuggestions,
  getVisited,
  getAllinterests,
  getLikedBy,
  getCheckedBy,
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

  getNavigatorPosition = () =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject),
    );

  getLocation = async () => {
    try {
      const position = await this.getNavigatorPosition();

      return await saveLocation([
        position.coords.latitude,
        position.coords.longitude,
      ]);
    } catch (navigatorError) {
      try {
        let location = await fetch('http://ip-api.com/json', {
          method: 'POST',
        }).then(res => res.json());

        return await saveLocation([location.lat, location.lon]);
      } catch (thirdPartyServiceError) {
        return null;
      }
    }
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
    this.props.context.socket.on('like', ({ sender }) =>
      this.addNotification(`${sender} has just liked you`),
    );
    this.props.context.socket.on('check', ({ sender }) =>
      this.addNotification(`${sender} has just checked your profile`),
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
    this.props.context.socket.on('likeBack', ({ sender }) =>
      this.addNotification(`${sender} has just liked you back!`),
    );
    this.props.context.socket.on('unlike', ({ sender }) =>
      this.addNotification(`Unfortunately ${sender} has disconnected from you`),
    );
    this.props.context.socket.on('chatDataUpdate', chatData =>
      this.props.context.set('chatData', chatData),
    );
    this.props.context.socket.on('fameUpdate', ({ login, fame }) =>
      this.props.context.updateFame(login, fame),
    );
  };

  loadUserProfile = async () => {
    try {
      const profile = await getProfile();
      const newLocation = await this.getLocation();

      console.log({
        newLocation,
      });

      this.props.context.set('profile', {
        ...profile,
        location: newLocation ? newLocation : profile.location,
        changeStatus: null,
        error: false,
        canRenderLikeButton: profile.gallery.length > 0,
      });
      this.props.context.set(
        'socket',
        socketIOClient({
          query: `login=${profile.login}`,
        }),
      );
      this.addSocketEventListeners();
    } catch (error) {
      this.props.context.set('profile', null);
    }
  };

  loadChatData = () =>
    getChatData().then(
      chatData => this.props.context.set('chatData', chatData),
      () => this.props.context.set('profile', null),
    );

  loadSuggestions = () =>
    getSuggestions().then(
      suggestions => this.props.context.set('suggestions', suggestions),
      () => this.props.context.set('profile', null),
    );

  loadVisited = () =>
    getVisited().then(
      visited => this.props.context.set('visited', visited),
      () => this.props.context.set('profile', null),
    );

  loadInterests = () =>
    getAllinterests().then(
      interests => this.props.context.set('interests', interests),
      () => this.props.context.set('profile', null),
    );

  loadLikedBy = () =>
    getLikedBy().then(
      likedBy => this.props.context.set('likedBy', likedBy),
      () => this.props.context.set('profile', null),
    );

  loadCheckedBy = () =>
    getCheckedBy().then(
      checkedBy => this.props.context.set('checkedBy', checkedBy),
      () => this.props.context.set('profile', null),
    );

  componentDidMount = () =>
    Promise.all([
      this.loadUserProfile(),
      this.loadChatData(),
      this.loadSuggestions(),
      this.loadVisited(),
      this.loadInterests(),
      this.loadLikedBy(),
      this.loadCheckedBy(),
    ]);

  signout = () => signout().then(() => this.props.context.set('profile', null));

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

  everythingLoaded = () => {
    console.log(
      'everythingLoaded',
      this.props.context.profile !== null &&
        this.props.context.chatData !== null &&
        this.props.context.suggestions !== null &&
        this.props.context.visited !== null &&
        this.props.context.interests !== null &&
        this.props.context.likedBy !== null &&
        this.props.context.checkedBy !== null,
    );
    console.log('profile', this.props.context.profile);

    return (
      this.props.context.profile !== null &&
      this.props.context.chatData !== null &&
      this.props.context.suggestions !== null &&
      this.props.context.visited !== null &&
      this.props.context.interests !== null &&
      this.props.context.likedBy !== null &&
      this.props.context.checkedBy !== null
    );
  };

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
      <div className={this.props.classes.root}>
        {this.renderNotifications()}
        {this.renderAppBar()}
        {this.renderSideMenu()}
        {this.renderRoutes()}
      </div>
    ) : (
      <Signin />
    );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Main));
