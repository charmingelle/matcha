import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  ageFilter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  startAgeLabelBlock: {},
  startAgeInputBlock: {
    display: "flex"
  },
  endAgeLabelBlock: {},
  endAgeInputBlock: {
    display: "flex"
  },
  distanceFilter: {
    display: "flex",
    flexDirection: "column"
  },
  fameFilter: {
    display: "flex",
    flexDirection: "column"
  },
  amountOfCommonInterestsFilter: {
    display: "flex",
    flexDirection: "column"
  }
};

class FilterPanel extends React.Component {
  componentDidMount = () => {
    this.setState({
      // ageFilter: false,
      // locationFilter: false,
      // fameFilter: false,
      // commonInterestsFilter: false,
      startAge: 18,
      endAge: 100,
      distance: 0,
      fameRating: 0,
      amountOfCommonInterests: 0
    });
  };

  changeAmountOfCommonInterests = event =>
    this.setState({
      amountOfCommonInterests: event.target.value
    });

  changeParam = (param, event) =>
    this.setState({
      [param]: event.target.value
    });

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const {
      startAge,
      endAge,
      distance,
      fameRating,
      amountOfCommonInterests
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.ageFilter}>
          <div className={classes.startAgeLabelBlock}>
            <label className={classes.startAgeLabel} htmlFor="startAge">
              Start Age {startAge}
            </label>
          </div>
          <div className={classes.startAgeInputBlock}>
            <span>18</span>
            <input
              type="range"
              name="startAge"
              min="18"
              max="100"
              step="1"
              value={startAge}
              onChange={this.changeParam.bind(this, "startAge")}
            />
            <span>100</span>
          </div>
          <div className={classes.endAgeLabelBlock}>
            <label className={classes.endAgeLabel} htmlFor="endAge">
              End Age {endAge}
            </label>
          </div>
          <div className={classes.endAgeInputBlock}>
            <span>18</span>
            <input
              type="range"
              name="endAge"
              min="18"
              max="100"
              step="1"
              value={endAge}
              onChange={this.changeParam.bind(this, "endAge")}
            />
            <span>100</span>
          </div>
        </div>
        <div />
        <div className={classes.distanceFilter}>
          <label htmlFor="distance">Maximum distance to person (km)</label>
          <input
            name="distance"
            type="number"
            min="0"
            value={distance}
            onChange={this.changeParam.bind(this, "distance")}
          />
        </div>
        <div className={classes.fameFilter}>
          <label htmlFor="fame">Minimal fame rating</label>
          <input
            name="fame"
            type="number"
            min="0"
            value={fameRating}
            onChange={this.changeParam.bind(this, "fame")}
          />
        </div>
        <div className={classes.amountOfCommonInterestsFilter}>
          <label htmlFor="amountOfCommonInterests">
            Minimal amount of common interests
          </label>
          <input
            name="amountOfCommonInterests"
            type="number"
            min="0"
            value={amountOfCommonInterests}
            onChange={this.changeParam.bind(this, "amountOfCommonInterests")}
          />
        </div>
        <div />
        <button>Filter</button>
      </div>
    );
  };
}

FilterPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilterPanel);
