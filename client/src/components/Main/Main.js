import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ListIcon from '@material-ui/icons/List';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ChatIcon from '@material-ui/icons/Chat';
import CheckIcon from '@material-ui/icons/Check';
import SignoutIcon from '@material-ui/icons/RemoveCircleOutline';
import Typography from '@material-ui/core/Typography';
import Profile from './../Profile/Profile.js';
import User from './../User/User.js';
import Users from './../Users/Users.js';
import Signin from './../Signin/Signin.js';
import Visited from './../Visited/Visited.js';
import Chat from './../Chat/Chat.js';
import { getUserProfile, saveLocation, signout } from './../../api/api.js';

function TabContainer(props) {
  return (
    <Typography
      style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
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
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    backgroundColor: theme.palette.background.paper
  },
  appContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  link: {
    color: 'black',
    textDecoration: 'none',
    indicator: 'false'
  }
});

class ScrollableTabsButtonForce extends React.Component {
  state = {
    tabid: 0,
    profile: null
  };

  ipLookUp = userid => {
    fetch('http://ip-api.com/json', {
      method: 'POST'
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

  componentDidMount() {
    getUserProfile().then(res => {
      if (res.status === 200) {
        res.json().then(data => {
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
                data.user.gallery.filter(image => image !== '').length > 0
            }
          });
          // this.getLocation(data.user.id);
        });
      } else {
        this.setState({ profile: 'signin' });
      }
    });
  }

  onProfileChange = target => {
    this.setState({ profile: target });
  };

  signout = () => {
    signout().then(() => this.setState({ profile: 'signin' }));
  };

  handleChange = (event, value) => {
    this.setState({ tabid: value });
  };

  render = () => {
    if (this.state.profile === null) {
      return <span>Loading...</span>;
    }
    if (this.state.profile === 'signin') {
      return <Signin />;
    }
    const { classes } = this.props;
    const {
      tabid,
      profile,
      profile: { visited, interests, location, login, canLike }
    } = this.state;

    return (
      <BrowserRouter>
        <div className={classes.root}>
          <AppBar position="fixed" color="default">
            <Tabs
              className={classes.tabs}
              value={tabid}
              onChange={this.handleChange}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Users" icon={<ListIcon />} component={Link} to="/" />
              <Tab
                label="Profile"
                icon={<PersonPinIcon />}
                component={Link}
                to="/profile"
              />
              <Tab
                label="Chat"
                icon={<ChatIcon />}
                component={Link}
                to="/chat"
              />
              <Tab
                label="Visited"
                icon={<CheckIcon />}
                component={Link}
                to="/visited"
              />
              <Tab
                label="Sign Out"
                icon={<SignoutIcon />}
                onClick={this.signout}
                component={Link}
                to="/"
              />
            </Tabs>
          </AppBar>
          <AppBar
            position="relative"
            color="default"
            style={{ zIndex: 'initial' }}
          >
            <Tabs
              className={classes.tabs}
              value={tabid}
              onChange={this.handleChange}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Users" icon={<ListIcon />} component={Link} to="/" />
              <Tab
                label="Profile"
                icon={<PersonPinIcon />}
                component={Link}
                to="/profile"
              />
              <Tab
                label="Chat"
                icon={<ChatIcon />}
                component={Link}
                to="/chat"
              />
              <Tab
                label="Visited"
                icon={<CheckIcon />}
                component={Link}
                to="/visited"
              />
              <Tab
                label="Sign Out"
                icon={<SignoutIcon />}
                onClick={this.signout}
                component={Link}
                to="/"
              />
            </Tabs>
          </AppBar>
          <div className={classes.appContent}>
            <Route
              exact
              path="/"
              render={() => (
                <TabContainer>
                  <Users
                    visited={visited}
                    interests={interests}
                    profileLocation={location}
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
                    editable={true}
                  />
                </TabContainer>
              )}
            />
            <Route
              exact
              path="/chat"
              render={() => (
                <TabContainer>
                  <Chat author={login} />
                </TabContainer>
              )}
            />
            <Route
              exact
              path="/users/:login"
              render={({ match }) => (
                <TabContainer>
                  <User login={match.params.login} canLike={canLike} />
                </TabContainer>
              )}
            />
            <Route
              exact
              path="/visited"
              render={() => (
                <TabContainer>
                  <Visited />
                </TabContainer>
              )}
            />
          </div>
        </div>
      </BrowserRouter>
    );
  };
}

ScrollableTabsButtonForce.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScrollableTabsButtonForce);
