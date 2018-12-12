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
      locationOrder: 1,
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

  sortByLocation = () => {
    const order = this.changeOrder("locationOrder");
    let sortedUsers = this.props.users;

    this.setState({
      ageOrder: 0,
      fameOrder: 0,
      commonInterestsOrder: 0
    });
    sortedUsers.sort((a, b) => order * (b.distance - a.distance));
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

    this.setState({
      ageOrder: 0,
      locationOrder: 0,
      fameOrder: 0
    });
    sortedUsers.sort(
      (a, b) => order * (b.amountOfCommonInterests - a.amountOfCommonInterests)
    );
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
