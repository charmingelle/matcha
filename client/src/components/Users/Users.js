import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getUsers, saveVisited } from './../../api/api.js';
import FilterPanel from './FilterPanel/FilterPanel.js';
import TempUser from './../TempUser/TempUser.js';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper
  },
  userList: {
    margin: 0,
    minWidth: '614px',
    maxWidth: '614px',
    padding: 0,
    listStyleType: 'none'
  }
});

class Users extends React.Component {
  async componentDidMount() {
    this.props.changeTab(0);
    const data = await getUsers();

    this.setState({
      selectedUser: -1,
      users: data,
      filteredUsers: data
    });
  }

  showFilteredUsers = filteredUsers => {
    this.setState({ filteredUsers });
  };

  back = () => {
    this.setState({
      selectedUser: -1
    });
  };

  addToVisited = login => {
    if (!this.props.visited.includes(login)) {
      let newVisited = this.props.visited;

      newVisited.push(login);
      saveVisited(newVisited).then(() => {
        this.props.socket.emit('check', {
          sender: this.props.sender,
          receiver: login
        });
        this.props.updateVisited(newVisited);
      });
    }
  };

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
        <ul className={classes.userList}>
          {this.state.filteredUsers.map((user, index) => (
            <li key={index}>
              <TempUser
                user={user}
                full={false}
                socket={this.props.socket}
                sender={this.props.sender}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Users);

// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import InfoIcon from '@material-ui/icons/Info';
// import LeftButtonIcon from '@material-ui/icons/ChevronLeft';
// import RightButtonIcon from '@material-ui/icons/ChevronRight';
// import { Link } from 'react-router-dom';

// gridList: {
//   width: '100%',
//   maxWidth: '1000px'
// },
// gridListTile: {
//   padding: '0 !important',
//   width: '100% !important'
// },
// photo: {
//   width: '100%'
// },
// icon: {
//   color: 'rgba(255, 255, 255, 0.54)'
// },
// details: {
//   width: '100% !important',
//   background: 'rgba(0, 0, 0, 0.5)'
// },
// leftButton: {
//   position: 'absolute',
//   left: 0,
//   top: 0,
//   color: 'white'
// },
// rightButton: {
//   position: 'absolute',
//   right: 0,
//   top: 0,
//   color: 'white'
// },
// userContainer: {
//   margin: '40px',
//   border: '1px solid rgba(0, 0, 0, 0.54)'
// },
// userInfo: {
//   display: 'flex',
//   padding: '15px'
// },
// userName: {
//   marginRight: '10px'
// },
// userTimeContainer: {
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center'
// },
// userOnline: {
//   width: '5px',
//   height: '5px',
//   borderRadius: '100%',
//   backgroundColor: 'green'
// },
// userPhotoContainer: {
//   position: 'relative',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center'
// },
// userLeft: {
//   position: 'absolute',
//   left: 0,
//   top: '50%',
//   transform: 'translate(0, -50%)'
// },
// userRight: {
//   position: 'absolute',
//   right: 0,
//   top: '50%',
//   transform: 'translate(0, -50%)'
// },
// userPhoto: {
//   maxWidth: '100%',
//   maxHeight: '100%'
// },
// userActions: {
//   display: 'flex',
//   padding: '15px'
// },
// userLikeButton: {
//   margin: '5px'
// },
// userFame: {
//   margin: '5px'
// }

//   <GridList cellHeight="auto" className={classes.gridList}>
//   {this.state.filteredUsers.map((user, index) => {
//     return (
//       <GridListTile key={index} className={classes.gridListTile}>
//         <img
//           className={classes.photo}
//           src={`users/photos/${user.gallery[user.currentPhoto]}`}
//           alt={`${user.firstname} ${user.lastname}`}
//         />{" "}
//         */}
//         {user.currentPhoto > 0 && (
//           <Button
//             onClick={() => this.showPreviousPhoto(index)}
//             className={classes.leftButton}
//           >
//             <LeftButtonIcon />
//           </Button>
//         )}
//         {user.currentPhoto < user.gallery.length - 1 && (
//           <Button
//             onClick={() => this.showNextPhoto(index)}
//             className={classes.rightButton}
//           >
//             <RightButtonIcon />
//           </Button>
//         )}
//         <GridListTileBar
//           title={`${user.firstname} ${user.lastname}`}
//           subtitle={<span>{user.bio}</span>}
//           actionIcon={
//             <Link
//               to={`/users/${user.login}`}
//               onClick={this.addToVisited.bind(this, user.login)}
//             >
//               <IconButton className={this.props.classes.icon}>
//                 <InfoIcon />
//               </IconButton>
//             </Link>
//           }
//         />
//       </GridListTile>
//     );
//   })}
// </GridList>
