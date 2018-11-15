import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { getUsers } from './../../api/usersRequests.js';
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
  }
});

class TitlebarGridList extends React.Component {
  async componentDidMount() {
    const data = await getUsers();

    this.setState({
      users: data,
      filteredUsers: data
    });
  }

  showFilteredUsers = filteredUsers => {
    this.setState({ filteredUsers });
  };

  render = () => {
    if (!this.state) {
      return <span>Loader is here</span>;
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
          {this.state.filteredUsers.map(user => (
            <GridListTile
              key={user.gallery[user.avatarid]}
              className={classes.gridListTile}
            >
              <img
                src={user.gallery[user.avatarid]}
                alt={`${user.firstname} ${user.lastname}`}
              />
              <UserDetails details={user} />
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
