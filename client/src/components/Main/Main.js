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
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import UserList from '../UserList/UserList';
import Profile from '../Profile/Profile';
import User from '../User/User';
import Chat from '../Chat/Chat';
import Notifications from '../Notifications/Notifications';
import { styles } from './Main.styles';
import { withContext } from '../../utils/utils';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
      newChatData[user].log.unshift(data);
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
      const newLocation = await this.getLocation();

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

  changeTabName = tabName => () =>
    this.setState({
      tabName,
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
            User not found or unavailable.
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
      {this.renderRoute('/settings', Profile)}
      {this.renderChatRoute()}
      {this.renderChatReceiverRoute()}
      {this.renderUserRoute()}
      {this.renderRoute('/checked', UserList, {
        users: this.props.context.visited,
      })}
    </div>
  );

  renderDialog = () => (
    <Dialog
      open={this.props.context.isDialogOpen}
      onClose={() => this.props.context.set('isDialogOpen', false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Are you sure you would like to block ${this.props.context.blockName}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Blocked users don't appear appear in suggestions. You won't be able to
          check this user's details and contact him in the future.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => this.props.context.set('isDialogOpen', false)}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            this.api.block(this.props.context.blockLogin);
            this.loadChatData();
            this.loadSuggestions();
            this.loadVisited();
            this.props.context.set('isDialogOpen', false);
          }}
          color="primary"
          autoFocus
        >
          Block User
        </Button>
      </DialogActions>
    </Dialog>
  );

  render = () =>
    this.everythingIsLoaded() ? (
      <div className={this.props.classes.root}>
        {this.renderNotifications()}
        {this.renderAppBar()}
        {this.renderSideMenu()}
        {this.renderRoutes()}
        {this.renderDialog()}
      </div>
    ) : null;
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Main));
