import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getSuggestions } from "./../../api/api.js";
import SortingPanel from "./../SortingPanel/SortingPanel.js";
import FilterPanel from "./../FilterPanel/FilterPanel.js";

const styles = {
  root: {}
};

class Suggestions extends React.Component {
  constructor(props) {
    super(props);
    this.users = null;
    this.sortParam = "distance";
    this.sortOrder = 1;
    this.startAge = 18;
    this.endAge = 100;
    this.distance = 5;
    this.fameRating = 0;
    this.amountOfCommonInterests = 0;
  }

  componentDidMount = () => {
    this.props.changeTab(1);
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
    if (this.sortParam === "age") {
      return users.sort((a, b) => this.sortOrder * (b.age - a.age));
    }
    if (this.sortParam === "distance") {
      return users.sort((a, b) => this.sortOrder * (b.distance - a.distance));
    }
    if (this.sortParam === "fame") {
      return users.sort((a, b) => this.sortOrder * (b.fame - a.fame));
    }
    if (this.sortParam === "amountOfCommonInterests") {
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

  filter = users => {
    return users.filter(
      user =>
        user.age >= this.startAge &&
        user.age <= this.endAge &&
        user.distance <= this.distance &&
        user.fame >= this.fameRating &&
        user.amountOfCommonInterests >= this.amountOfCommonInterests
    );
  };

  setFilterParams = params => {
    this.startAge = params.startAge;
    this.endAge = params.endAge;
    this.distance = params.distance;
    this.fameRating = params.fameRating;
    this.amountOfCommonInterests = params.amountOfCommonInterests;
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
        <SortingPanel setSortParams={this.setSortParams} />
        <FilterPanel setFilterParams={this.setFilterParams} />
        <ul>
          {filteredUsers.map((user, index) => (
            <li key={index}>{`${user.login}: age ${user.age}, distance ${
              user.distance
            }, fame ${user.fame}, interests ${user.interests}
            `}</li>
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
