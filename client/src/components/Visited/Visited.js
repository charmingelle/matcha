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
import { getVisited } from './../../api/api.js';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'auto',
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
    color: 'white'
  },
  rightButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: 'white'
  }
});

class Users extends React.Component {
  async componentDidMount() {
    this.props.changeTab(3);
    const data = await getVisited();

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
      <div className={classes.root}>
        <GridList cellHeight="auto" className={classes.gridList}>
          {this.state.filteredUsers.map((user, index) => {
            return (
              <GridListTile key={index} className={classes.gridListTile}>
                <img
                  className={classes.photo}
                  src={`users/photos/${user.gallery[user.currentPhoto]}`}
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
                    <Link to={`/users/${user.login}`}>
                      <IconButton className={this.props.classes.icon}>
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
    );
  };
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Users);
