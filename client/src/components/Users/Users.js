import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import LeftButtonIcon from '@material-ui/icons/ChevronLeft';
import RightButtonIcon from '@material-ui/icons/ChevronRight';
import { getUsers } from './../../api/api.js';
import FilterPanel from './FilterPanel/FilterPanel.js';
import Profile from './../Profile/Profile.js';
import { BrowserRouter, Route, Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: '100%',
    maxWidth: '1000px'
  },
  gridListTile: {
    padding: '0 !important',
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white'
  },
  rightButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white'
  }
});

class TitlebarGridList extends React.Component {
  async componentDidMount() {
    const data = await getUsers();

    data.forEach(user => {
      user.currentPhoto = user.avatarid;
      user.gallery = user.gallery.filter(photo => photo !== '');
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

    updatedUsers[index].currentPhoto--;
    this.setState({
      users: updatedUsers
    });
  };

  showNextPhoto = index => {
    let updatedUsers = this.state.users;

    updatedUsers[index].currentPhoto++;
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
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;

    return (
      <BrowserRouter>
        <div>
          <Route
            exact
            path="/user/:login"
            render={({ match }) => {
              let value = null;

              for (let i = 0; i < this.state.users.length; i++) {
                if (this.state.users[i].login === match.params.login) {
                  value = this.state.users[i];
                }
              }
              return (
                <Profile
                  name="profile"
                  value={value}
                  login={match.params.login}
                  backButton
                  editable={false}
                  back={this.back}
                  profileActions
                  canLike={this.props.canLike}
                />
              );
            }}
          />
          <Route
            exact
            path="/"
            render={() => (
              <div className={classes.root}>
                <FilterPanel
                  profileLocation={this.props.profileLocation}
                  interests={this.props.interests}
                  users={this.state.users}
                  filteredUsers={this.state.users}
                  onChange={this.showFilteredUsers}
                />
                <GridList cellHeight="auto" className={classes.gridList}>
                  {this.state.filteredUsers.map((user, index) => {
                    console.log('user.currentPhoto', user.gallery.length);
                    console.log(
                      'user.currentPhoto < user.gallery.length',
                      user.currentPhoto < user.gallery.length
                    );
                    return (
                      <GridListTile
                        key={index}
                        className={classes.gridListTile}
                      >
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
                            <LeftButtonIcon />
                          </Button>
                        )}
                        {user.currentPhoto < user.gallery.length - 1 && (
                          <Button
                            onClick={() => this.showNextPhoto(index)}
                            className={classes.rightButton}
                          >
                            <RightButtonIcon />
                          </Button>
                        )}
                        <GridListTileBar
                          title={`${user.firstname} ${user.lastname}`}
                          subtitle={<span>{user.bio}</span>}
                          actionIcon={
                            <Link to={`/user/${user.login}`}>
                              <IconButton
                                // onClick={() => this.showDetails(index)}
                                className={this.props.classes.icon}
                              >
                                <InfoIcon />
                              </IconButton>
                            </Link>
                          }
                        />
                      </GridListTile>
                    );
                  })}
                </GridList>
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    );
  };
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TitlebarGridList);
