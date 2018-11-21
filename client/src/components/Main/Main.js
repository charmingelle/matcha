import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ListIcon from '@material-ui/icons/List';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ChatIcon from '@material-ui/icons/Chat';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Profile from './../Profile/Profile.js';
import Users from './../Users/Users.js';
import Signin from '../Signin/Signin.js';
import { getUserProfile, saveLocation, signout } from './../../api/api.js';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  signoutButton: {
    width: 'fit-content'
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
              error: false
            }
          });
          this.getLocation(data.user.id);
        });
      } else {
        this.setState({ profile: 'signin' });
      }
    });
  }

  handleChange = (event, value) => {
    this.setState({ tabid: value });
  };

  onProfileChange = target => {
    this.setState({ profile: target });
  };

  signout = () => {
    signout().then(() => this.setState({ profile: 'signin' }));
  };

  render = () => {
    if (this.state.profile === null) {
      return <span>Loading...</span>;
    }
    if (this.state.profile === 'signin') {
      return <Signin />;
    }
    const { classes } = this.props;
    const { tabid } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={tabid}
            onChange={this.handleChange}
            scrollable
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Users" icon={<ListIcon />} />
            <Tab label="Profile" icon={<PersonPinIcon />} />
            <Tab label="Chat" icon={<ChatIcon />} />
            <Button className={classes.signoutButton} onClick={this.signout}>
              Sign Out
            </Button>
          </Tabs>
        </AppBar>
        {tabid === 0 && (
          <TabContainer>
            <Users
              interests={this.state.profile.interests}
              profileLocation={this.state.profile.location}
            />
          </TabContainer>
        )}
        {tabid === 1 && (
          <TabContainer>
            <Profile
              name="profile"
              value={this.state.profile}
              onChange={this.onProfileChange}
              editable={true}
            />
          </TabContainer>
        )}
        {tabid === 2 && <TabContainer>Chat</TabContainer>}
      </div>
    );
  };
}

ScrollableTabsButtonForce.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScrollableTabsButtonForce);
