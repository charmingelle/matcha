import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import leftButtonIcon from '@material-ui/icons/ArrowRightAlt';
import { getUsers } from './../../api/api.js';
import FilterPanel from './../FilterPanel/FilterPanel.js';
import Profile from './../Profile/Profile.js';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: '50%'
  },
  gridListTile: {
    width: '100% !important'
  },
  photo: {
    width: '100%'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  details: {
    width: '100% !important',
    background: 'rgba(0, 0, 0, 0.5)'
  },
  leftButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: 'rgba(255, 255, 255, 0.54)'
  },
  rightButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: 'rgba(255, 255, 255, 0.54)'
  }
});

class TitlebarGridList extends React.Component {
  async componentDidMount() {
    const data = await getUsers();

    data.forEach(user => {
      user.currentPhoto = user.avatarid;
    });
    this.setState({
      selectedUser: -1,
      users: data,
      filteredUsers: data
    });
  }

  showFilteredUsers = filteredUsers => {
    this.setState({ filteredUsers });
  };

  showPreviousPhoto = index => {
    let updatedUsers = this.state.users;

    if (updatedUsers[index].currentPhoto > 0) {
      updatedUsers[index].currentPhoto--;
    }
    this.setState({
      users: updatedUsers
    });
  };

  showNextPhoto = index => {
    let updatedUsers = this.state.users;

    if (updatedUsers[index].currentPhoto < 4) {
      updatedUsers[index].currentPhoto++;
    }
    this.setState({
      users: updatedUsers
    });
  };

  showDetails = index => {
    this.setState({
      selectedUser: index
    });
  };

  back = () => {
    this.setState({
      selectedUser: -1
    });
  }

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;

    if (this.state.selectedUser !== -1) {
      return (
        <Profile
          name="profile"
          value={this.state.users[this.state.selectedUser]}
          backButton
          editable={false}
          back={this.back}
        />
      );
    }
    return (
      <div className={classes.root}>
        <FilterPanel
          profileLocation={this.props.profileLocation}
          interests={this.props.interests}
          users={this.state.users}
          filteredUsers={this.state.users}
          onChange={this.showFilteredUsers}
        />
        <GridList cellHeight="auto" className={classes.gridList}>
          {this.state.filteredUsers.map((user, index) => (
            <GridListTile key={index} className={classes.gridListTile}>
              <img
                className={classes.photo}
                src={user.gallery[user.currentPhoto]}
                alt={`${user.firstname} ${user.lastname}`}
              />{' '}
              */}
              {user.currentPhoto > 0 && (
                <Button
                  onClick={() => this.showPreviousPhoto(index)}
                  className={classes.leftButton}
                >
                  Left
                </Button>
              )}
              {user.currentPhoto < 4 && (
                <Button
                  onClick={() => this.showNextPhoto(index)}
                  className={classes.rightButton}
                >
                  Right
                </Button>
              )}
              <GridListTileBar
                title={`${user.firstname} ${user.lastname}`}
                subtitle={<span>{user.bio}</span>}
                actionIcon={
                  <IconButton
                    onClick={() => this.showDetails(index)}
                    className={this.props.classes.icon}
                  >
                    <InfoIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  };
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TitlebarGridList);
