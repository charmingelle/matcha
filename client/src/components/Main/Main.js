import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Typography from '@material-ui/core/Typography';
import Profile from './../Profile/Profile.js';
import ListIcon from '@material-ui/icons/List';
import Users from './../Users/Users.js';
import { getUserProfile, saveLocation } from './../../api/profileRequests.js';

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
  }
});

class ScrollableTabsButtonForce extends React.Component {
  state = {
    tabid: 0
  };

  ipLookUp = userid => {
    fetch('http://ip-api.com/json', {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => saveLocation(userid, [data.lat, data.lon]))
      .catch(error => console.error(error));
  };

  getLocation = userid => {
    navigator.geolocation.getCurrentPosition(
      position =>
        saveLocation(userid, [
          position.coords.latitude,
          position.coords.longitude
        ]),
      () => this.ipLookUp(userid)
    );
  };

  async componentDidMount() {
    const data = await getUserProfile(4);

    this.setState({
      profile: {
        id: data.user.id,
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
  }

  handleChange = (event, value) => {
    this.setState({ tabid: value });
  };

  onProfileChange = target => {
    this.setState({ profile: target });
  };

  render() {
    if (!this.state.profile) {
      return <span>Loader is here</span>;
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
            <Tab label="Item Three" icon={<PhoneIcon />} />
            <Tab label="Item Four" icon={<HelpIcon />} />
            <Tab label="Item Five" icon={<ShoppingBasket />} />
            <Tab label="Item Six" icon={<ThumbDown />} />
            <Tab label="Item Seven" icon={<ThumbUp />} />
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
            />
          </TabContainer>
        )}
        {tabid === 2 && <TabContainer>Item Three</TabContainer>}
        {tabid === 3 && <TabContainer>Item Four</TabContainer>}
        {tabid === 4 && <TabContainer>Item Five</TabContainer>}
        {tabid === 5 && <TabContainer>Item Six</TabContainer>}
        {tabid === 6 && <TabContainer>Item Seven</TabContainer>}
      </div>
    );
  }
}

ScrollableTabsButtonForce.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScrollableTabsButtonForce);