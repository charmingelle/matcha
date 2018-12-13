import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
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
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
    flexDirection: "row"
  },
  formControlSelect: {
    width: "100%"
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

class FilterPanel extends React.Component {
  componentDidMount = () => {
    this.setState({
      startAge: 18,
      endAge: 100,
      distance: 5,
      minFameRating: 0,
      maxFameRating: "",
      amountOfCommonInterests: 0,
      selectedInterests: []
    });
  };

  changeParam = (param, event) =>
    this.setState({
      [param]: event.target.value
    });

  filter = () => {
    this.props.setFilterParams(this.state);
  };

  handleInterestsChange = event => {
    this.setState({ selectedInterests: event.target.value });
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes, interests } = this.props;
    const {
      startAge,
      endAge,
      distance,
      minFameRating,
      maxFameRating,
      amountOfCommonInterests,
      selectedInterests
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
          <label htmlFor="minFame">Minimum fame rating</label>
          <input
            name="minFame"
            type="number"
            min="0"
            value={minFameRating}
            onChange={this.changeParam.bind(this, "minFameRating")}
          />
          <label htmlFor="maxFame">Maximum fame rating</label>
          <input
            name="maxFame"
            type="number"
            min="0"
            value={maxFameRating}
            onChange={this.changeParam.bind(this, "maxFameRating")}
          />
        </div>
        <div className={classes.amountOfCommonInterestsFilter}>
          <label htmlFor="amountOfCommonInterests">
            Minimum amount of common interests
          </label>
          <input
            name="amountOfCommonInterests"
            type="number"
            min="0"
            value={amountOfCommonInterests}
            onChange={this.changeParam.bind(this, "amountOfCommonInterests")}
          />
        </div>
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="select-multiple-checkbox">
            Interests
          </InputLabel>
          <Select
            className={classes.formControlSelect}
            multiple
            value={selectedInterests}
            onChange={this.handleInterestsChange}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {interests.map(name => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={selectedInterests.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <button onClick={this.filter}>Filter</button>
      </div>
    );
  };
}

FilterPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilterPanel);
