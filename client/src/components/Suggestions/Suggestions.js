import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getSuggestions } from './../../api/api.js';
import SortingPanel from './../SortingPanel/SortingPanel.js';
import FilterPanel from './../FilterPanel/FilterPanel.js';
import User from './../User/User.js';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'auto',
    padding: '10px',
    backgroundColor: '#eeeeee'
  },
  userList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  }
};

class Suggestions extends React.Component {
  constructor(props) {
    super(props);
    this.users = null;
    this.sortParam = 'distance';
    this.sortOrder = 1;
    this.startAge = 18;
    this.endAge = 100;
    this.distance = 5;
    this.minFameRating = 0;
    this.maxFameRating = '';
    this.amountOfCommonInterests = 0;
    this.selectedInterests = [];
  }

  componentDidMount = () => {
    getSuggestions()
      .then(response => response.json())
      .then(data => {
        data.forEach(user => {
          user.distance = this.getDistance(
            this.props.profile.location,
            user.location
          );
          user.amountOfCommonInterests = user.interests.filter(
            value => -1 !== this.props.profile.interests.indexOf(value)
          ).length;
        });
        this.users = data;
        this.setState({
          filteredUsers: this.sort(this.filter(data))
        });
      });
  };

  getDistance = (pos1, pos2) =>
    Math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);

  sort = users => {
    if (this.sortParam === 'age') {
      return users.sort((a, b) => this.sortOrder * (b.age - a.age));
    }
    if (this.sortParam === 'distance') {
      return users.sort((a, b) => this.sortOrder * (b.distance - a.distance));
    }
    if (this.sortParam === 'fame') {
      return users.sort((a, b) => this.sortOrder * (b.fame - a.fame));
    }
    if (this.sortParam === 'amountOfCommonInterests') {
      return users.sort(
        (a, b) =>
          this.sortOrder *
          (b.amountOfCommonInterests - a.amountOfCommonInterests)
      );
    }
  };

  setSortParams = (param, order) => {
    this.sortParam = param;
    this.sortOrder = order;
    this.setState({
      filteredUsers: this.sort(this.filter(this.users))
    });
  };

  filter = users =>
    users.filter(
      user =>
        user.age >= this.startAge &&
        user.age <= this.endAge &&
        user.distance <= this.distance &&
        user.fame >= this.minFameRating &&
        ((this.maxFameRating !== '' && user.fame <= this.maxFameRating) ||
          this.maxFameRating === '') &&
        user.amountOfCommonInterests >= this.amountOfCommonInterests &&
        this.selectedInterests.every(interest =>
          user.interests.includes(interest)
        )
    );

  setFilterParams = params => {
    this.startAge = params.startAge;
    this.endAge = params.endAge;
    this.distance = params.distance;
    this.minFameRating = params.minFameRating;
    this.maxFameRating = params.maxFameRating;
    this.amountOfCommonInterests = params.amountOfCommonInterests;
    this.selectedInterests = params.selectedInterests;
    this.setState({
      filteredUsers: this.sort(this.filter(this.users))
    });
  };

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const { filteredUsers } = this.state;

    return (
      <div className={classes.root}>
        <FilterPanel
          setFilterParams={this.setFilterParams}
          interests={this.props.profile.allInterests}
        />
        <SortingPanel setSortParams={this.setSortParams} />
        <ul className={classes.userList}>
          {filteredUsers.map(user => (
            <li key={user.login}>
              <User
                photoFolder="users/photos/"
                user={user}
                full={false}
                socket={this.props.socket}
                sender={this.props.sender}
                visited={this.props.visited}
                updateVisited={this.props.updateVisited}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Suggestions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Suggestions);
