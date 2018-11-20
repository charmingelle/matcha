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
import UserDetails from './../UserDetails/UserDetails.js';
import FilterPanel from './../FilterPanel/FilterPanel.js';

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
    width: '100% !important',
    height: 'initial !important'
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
      user.expanded = false;
      user.currentPhoto = user.avatarid;
    });
    this.setState({
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
    let updatedUsers = this.state.users;

    updatedUsers[index].expanded = true;
    this.setState({
      users: updatedUsers
    });
  };

  hideDetails = index => {};

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FilterPanel
          profileLocation={this.props.profileLocation}
          interests={this.props.interests}
          users={this.state.users}
          filteredUsers={this.state.users}
          onChange={this.showFilteredUsers}
        />
        <GridList cellHeight={180} className={classes.gridList}>
          {this.state.filteredUsers.map((user, index) => {
            if (!user.expanded) {
              return (
                <GridListTile key={index} className={classes.gridListTile}>
                  <img
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
              );
            }
            return (
              <div className={classes.details}>
                <IconButton
                  onClick={() => this.showDetails(index)}
                  className={this.props.classes.icon}
                >
                  <InfoIcon />
                </IconButton>
              </div>
            );
          })}
        </GridList>
      </div>
    );
  };
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TitlebarGridList);
