import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {}
};

class SortingPanel extends React.Component {
  componentDidMount = () => {
    this.setState({
      age: 0,
      distance: 1,
      fame: 0,
      amountOfCommonInterests: 0
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

  sortBy = param => {
    const order = this.changeOrder(param);

    Object.keys(this.setState).forEach(
      key =>
        key !== param &&
        this.setState({
          [key]: 0
        })
    );
    this.props.setSortParams(param, order);
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const { age, distance, fame, amountOfCommonInterests } = this.state;
    const arrowDown = <span>&#8595;</span>;
    const arrowUp = <span>&#8593;</span>;

    return (
      <div className={classes.root}>
        <button onClick={this.sortBy.bind(this, "age")}>
          Age
          {age === 1 && arrowDown}
          {age === -1 && arrowUp}
        </button>
        <button onClick={this.sortBy.bind(this, "distance")}>
          Location
          {distance === 1 && arrowDown}
          {distance === -1 && arrowUp}
        </button>
        <button onClick={this.sortBy.bind(this, "fame")}>
          Fame
          {fame === 1 && arrowDown}
          {fame === -1 && arrowUp}
        </button>
        <button onClick={this.sortBy.bind(this, "amountOfCommonInterests")}>
          Amount of common interests
          {amountOfCommonInterests === 1 && arrowDown}
          {amountOfCommonInterests === -1 && arrowUp}
        </button>
      </div>
    );
  };
}

SortingPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SortingPanel);
