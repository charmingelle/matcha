import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
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
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import UserList from '../UserList/UserList';
import Profile from '../Profile/Profile';
import User from '../User/User';
import Chat from '../Chat/Chat';
import Notifications from '../Notifications/Notifications';
import DialogWindow from '../DialogWindow/DialogWindow';
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
  api = this.props.context.api;

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

      return await this.api.saveLocation([
        position.coords.latitude,
        position.coords.longitude,
      ]);
    } catch (navigatorError) {
      try {
        let location = await fetch('http://ip-api.com/json', {
          method: 'POST',
        }).then(res => res.json());

        return await this.api.saveLocation([location.lat, location.lon]);
      } catch (thirdPartyServiceError) {
        return null;
      }
    }
  };

  addNotification = message => {
    setTimeout(() => {
      this.setState({
        notifications: [...this.state.notifications].splice(1),
      });
    }, 10000);
    this.setState({
      notifications: [message, ...this.state.notifications],
    });
  };

  chatIsVisible = user => {
    const urlParts = window.location.pathname.split('/');

    return urlParts[1] === 'chat' && urlParts[2] === user;
  };

  addSocketEventListeners = () => {
    this.props.context.socket.on('like', ({ sender, senderName }) =>
      this.addNotification(
        <Link
          className={this.props.classes.notificationLink}
          to={`/users/${sender}`}
        >
          {`${senderName} has just liked you`}
        </Link>,
      ),
    );
    this.props.context.socket.on('check', ({ sender, senderName }) =>
      this.addNotification(
        <Link
          className={this.props.classes.notificationLink}
          to={`/users/${sender}`}
        >
          {`${senderName} has just checked your profile`}
        </Link>,
      ),
    );
    this.props.context.socket.on('chat', data => {
      let newChatData = this.props.context.chatData;
      let user;

      if (data.sender !== this.props.context.profile.login) {
        user = data.sender;
        if (!this.chatIsVisible(user)) {
          this.addNotification(
            <Link
              className={this.props.classes.notificationLink}
              to={`/chat/${user}`}
            >
              {`${data.senderName} has sent you a message`}
            </Link>,
          );
        }
      } else {
        user = data.receiver;
      }
      newChatData[user].log.push(data);
      this.props.context.set('chatData', newChatData);
    });
    this.props.context.socket.on('likeBack', ({ sender, senderName }) =>
      this.addNotification(
        <Link
          className={this.props.classes.notificationLink}
          to={`/chat/${sender}`}
        >
          {`${senderName} has just liked you back! You can chat now.`}
        </Link>,
      ),
    );
    this.props.context.socket.on('unlike', ({ senderName }) =>
      this.addNotification(
        `Unfortunately ${senderName} has disconnected from you`,
      ),
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
      const profile = await this.api.getProfile();
      const { locatable } = profile;

      if (locatable) {
        this.props.context.set('profile', profile);
      } else {
        const newLocation = await this.getLocation();

        this.props.context.set('profile', {
          ...profile,
          ...(newLocation && { location: newLocation }),
        });
      }
      this.props.context.set(
        'socket',
        socketIOClient({
          query: `login=${profile.login}`,
        }),
      );
      this.addSocketEventListeners();
    } catch (error) {
      console.error(error);
    }
  };

  loadChatData = () =>
    this.api
      .getChatData()
      .then(
        chatData => this.props.context.set('chatData', chatData),
        console.error,
      );

  loadSuggestions = () =>
    this.api
      .getSuggestions()
      .then(
        suggestions => this.props.context.set('suggestions', suggestions),
        console.error,
      );

  loadVisited = () =>
    this.api
      .getVisited()
      .then(
        visited => this.props.context.set('visited', visited),
        console.error,
      );

  loadInterests = () =>
    this.api
      .getAllinterests()
      .then(
        interests => this.props.context.set('interests', interests),
        console.error,
      );

  loadLikedBy = () =>
    this.api
      .getLikedBy()
      .then(
        likedBy => this.props.context.set('likedBy', likedBy),
        console.error,
      );

  loadCheckedBy = () =>
    this.api
      .getCheckedBy()
      .then(
        checkedBy => this.props.context.set('checkedBy', checkedBy),
        console.error,
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

  signout = () =>
    this.api.signout().then(() => this.props.context.set('auth', false));

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

  hideMenu = () =>
    this.setState({
      showMenu: false,
    });

  handleMenuClose = event =>
    !this.anchorEl.contains(event.target) && this.setState({ showMenu: false });

  everythingIsLoaded = () =>
    this.props.context.socket !== null &&
    this.props.context.profile !== null &&
    this.props.context.chatData !== null &&
    this.props.context.suggestions !== null &&
    this.props.context.visited !== null &&
    this.props.context.interests !== null &&
    this.props.context.likedBy !== null &&
    this.props.context.checkedBy !== null;

  renderNotifications = () => (
    <Notifications
      messages={this.state.notifications}
      closeNotification={this.closeNotification}
    />
  );

  renderAppBar = tabName => {
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
            {tabName}
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
        onClick={this.hideMenu}
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
            {this.renderMenuItem('/settings', 'Settings', SettingsIcon)}
            {Object.keys(chatData).length > 0 &&
              this.renderMenuItem(
                `/chat/${Object.keys(chatData)[0]}`,
                'Chat',
                ChatIcon,
              )}
            {this.renderMenuItem('/checked', 'Checked', CheckIcon)}
          </MenuList>
        </Paper>
      </ClickAwayListener>
    );
  };

  renderErrorMessageComponent = message => this.renderAppBar(message);

  renderRoute = (appBarName, path, Component, props, notExact) => (
    <Route
      exact={!notExact}
      path={path}
      render={() => (
        <>
          {this.renderAppBar(appBarName)}
          {Component && (
            <TabContainer key={appBarName}>
              <Component {...props} />
            </TabContainer>
          )}
        </>
      )}
    />
  );

  renderChatRoute = () =>
    Object.keys(this.props.context.chatData).length > 0 && (
      <Route
        exact
        path="/chat"
        render={() => (
          <>
            {this.renderAppBar('Chat')}
            <TabContainer>
              <Chat receiver={Object.keys(this.props.context.chatData)[0]} />
            </TabContainer>
          </>
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
            <>
              {this.renderAppBar('Chat')}
              <TabContainer>
                <Chat receiver={match.params.receiver} />
              </TabContainer>
            </>
          ) : (
            this.renderErrorMessageComponent(
              'User not found or unavailable for chatting.',
            )
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
          <>
            {this.renderAppBar(match.params.login)}
            <TabContainer>
              <div className={this.props.classes.singleUserContainer}>
                <User user={this.props.context.suggestions[index]} full />
              </div>
            </TabContainer>
          </>
        ) : (
          this.renderErrorMessageComponent('User not found or unavailable.')
        );
      }}
    />
  );

  renderRoutes = () => (
    <div className={this.props.classes.appContent}>
      <Switch>
        {this.renderRoute('Suggestions', '/', UserList, {
          users: this.props.context.suggestions,
        })}
        {this.renderRoute('Settings', '/settings', Profile)}
        {this.renderChatRoute()}
        {this.renderChatReceiverRoute()}
        {this.renderUserRoute()}
        {this.renderRoute('Checked', '/checked', UserList, {
          users: this.props.context.visited,
        })}
        {this.renderRoute('404: Not found', '/', undefined, undefined, true)}
      </Switch>
    </div>
  );

  block = async () => {
    this.props.context.socket.emit('unlike', {
      sender: this.props.context.profile.login,
      senderName: `${this.props.context.profile.firstname} ${this.props.context.profile.lastname}`,
      receiver: this.props.context.dialogLogin,
    });
    await this.api.block(this.props.context.dialogLogin);
    this.loadSuggestions();
    this.loadVisited();
  };

  renderBlogDialog = () => (
    <DialogWindow
      open="isBlockDialogOpen"
      title={`Are you sure you would like to block ${this.props.context.dialogName}?`}
      subtitle={`Blocked users don't appear appear in suggestions.
        You won't be able to check this user's details and contact him in the future.`}
      confirmButtonText="Block User"
      confirmCallback={this.block}
    />
  );

  reportFake = () => {
    this.api.reportFake(this.props.context.dialogLogin);
    this.loadSuggestions();
    this.loadVisited();
  };

  renderFakeDialog = () => (
    <DialogWindow
      open="isFakeDialogOpen"
      title={`Are you sure you would like to report ${this.props.context.dialogName} as fake?`}
      confirmButtonText="Report as Fake"
      confirmCallback={this.reportFake}
    />
  );

  render = () =>
    this.everythingIsLoaded() ? (
      <div className={this.props.classes.root}>
        {this.renderNotifications()}
        {this.renderSideMenu()}
        {this.renderRoutes()}
        {this.renderBlogDialog()}
        {this.renderFakeDialog()}
      </div>
    ) : null;
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Main));
