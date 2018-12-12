import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {}
};

class SortingPanel extends React.Component {
  componentDidMount = () => {
    this.setState({
      ageOrder: 0,
      locationOrder: 0,
      fameOrder: 0,
      commonInterestsOrder: 0
    });
  };

  changeOrder = orderName => {
    let order;

    if (this.state[orderName] === 0) {
      order = 1;
    } else {
      order = -this.state[orderName];
    }
    this.setState({
      [orderName]: order
    });
    return order;
  };

  sortByAge = () => {
    const order = this.changeOrder("ageOrder");
    let sortedUsers = this.props.users;

    this.setState({
      locationOrder: 0,
      fameOrder: 0,
      commonInterestsOrder: 0
    });
    sortedUsers.sort((a, b) => order * (b.age - a.age));
    this.props.updateUsers(sortedUsers);
  };

  getDistance = (pos1, pos2) => {
    return Math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);
  };

  sortByLocation = () => {
    const order = this.changeOrder("locationOrder");
    let sortedUsers = this.props.users;

    this.setState({
      ageOrder: 0,
      fameOrder: 0,
      commonInterestsOrder: 0
    });
    sortedUsers.sort(
      (a, b) =>
        order *
        (this.getDistance(b.location, this.props.profile.location) -
          this.getDistance(a.location, this.props.profile.location))
    );
    this.props.updateUsers(sortedUsers);
  };

  sortByFame = () => {
    const order = this.changeOrder("fameOrder");
    let sortedUsers = this.props.users;

    this.setState({
      ageOrder: 0,
      locationOrder: 0,
      commonInterestsOrder: 0
    });
    sortedUsers.sort((a, b) => order * (b.fame - a.fame));
    this.props.updateUsers(sortedUsers);
  };

  sortByCommonInterests = () => {
    const order = this.changeOrder("commonInterestsOrder");
    let sortedUsers = this.props.users;
    let usersInterests = sortedUsers.map(user => user.interests);
    let myInterests = this.props.profile.interests;
    let intersections = usersInterests.map(userInterests =>
      userInterests.filter(value => -1 !== myInterests.indexOf(value))
    );

    this.setState({
      ageOrder: 0,
      locationOrder: 0,
      fameOrder: 0
    });
    sortedUsers.forEach(
      (sortedUser, index) => (sortedUser.weight = intersections[index].length)
    );
    sortedUsers.sort((a, b) => order * (b.weight - a.weight));
    this.props.updateUsers(sortedUsers);
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const {
      ageOrder,
      locationOrder,
      fameOrder,
      commonInterestsOrder
    } = this.state;
    const arrowDown = <span>&#8595;</span>;
    const arrowUp = <span>&#8593;</span>;

    return (
      <div className={classes.root}>
        <button onClick={this.sortByAge}>
          Age
          {ageOrder === 1 && arrowDown}
          {ageOrder === -1 && arrowUp}
        </button>
        <button onClick={this.sortByLocation}>
          Location
          {locationOrder === 1 && arrowDown}
          {locationOrder === -1 && arrowUp}
        </button>
        <button onClick={this.sortByFame}>
          Fame
          {fameOrder === 1 && arrowDown}
          {fameOrder === -1 && arrowUp}
        </button>
        <button onClick={this.sortByCommonInterests}>
          Common interests
          {commonInterestsOrder === 1 && arrowDown}
          {commonInterestsOrder === -1 && arrowUp}
        </button>
      </div>
    );
  };
}

SortingPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SortingPanel);
