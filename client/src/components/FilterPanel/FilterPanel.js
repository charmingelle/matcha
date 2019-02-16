import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

const styles = {
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 8,
    backgroundColor: "#ffffff",
    transform: "translate(0px, 0px)",
    transition: "transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms"
  },
  hidden: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 8,
    backgroundColor: "#ffffff",
    transform: "translate(0, -430px)",
    transition: "transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms"
  },
  ageFilter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 8
  },
  ageInputBlock: {
    display: "flex",
    alignItems: "center",
    width: 300,
    height: 40
  },
  filter: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 8
  },
  formControl: {
    marginBottom: 8
  },
  slider: {
    WebkitAppearance: "none",
    width: "100%",
    background: "transparent",
    "&:focus": {
      outline: "none"
    },
    "&::-webkit-slider-thumb": {
      WebkitAppearance: "none",
      height: "36px",
      width: "16px",
      borderRadius: "4px",
      background: "#ffffff",
      cursor: "pointer",
      marginTop: "-14px",
      boxShadow:
        "1px 1px 1px rgba(0, 0, 0, 0.7), 0px 0px 1px rgba(0, 0, 0, 0.7)"
    },
    "&::-webkit-slider-runnable-track": {
      width: "100%",
      height: "8.4px",
      cursor: "pointer",
      background: "#3f51b5",
      borderRadius: "4px"
    }
  },
  labelAll: {
    fontSize: "12px",
    color: "rgba(0, 0, 0, 0.54)"
  },
  spanAll: {
    color: "rgba(0, 0, 0, 0.54)"
  },
  spanSpecial: {
    color: "#3f51b5"
  }
};

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
      selectedInterests: [],
      expanded: false
    });
  };

  changeParam = (param, min, max, event) => {
    if (event.target.value >= min && (!max || event.target.value <= max)) {
      this.setState({
        [param]: event.target.value
      });
    }
  };

  filter = () => {
    if (this.state.expanded) {
      this.props.setFilterParams(this.state);
    }
    this.setState({
      expanded: !this.state.expanded
    });
    this.props.move();
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
      selectedInterests,
      expanded
    } = this.state;

    return (
      <div className={expanded ? classes.root : classes.hidden}>
        <div className={classes.ageFilter}>
          <div>
            <label className={classes.labelAll} htmlFor="startAge">
              Start Age <span className={classes.spanSpecial}>{startAge}</span>
            </label>
          </div>
          <div className={classes.ageInputBlock}>
            <span className={classes.spanAll}>18</span>
            <input
              className={classes.slider}
              type="range"
              name="startAge"
              min="18"
              max="100"
              step="1"
              value={startAge}
              onChange={this.changeParam.bind(this, "startAge", 18, 100)}
            />
            <span className={classes.spanAll}>100</span>
          </div>
          <div>
            <label className={classes.labelAll} htmlFor="endAge">
              End Age <span className={classes.spanSpecial}>{endAge}</span>
            </label>
          </div>
          <div className={classes.ageInputBlock}>
            <span className={classes.spanAll}>18</span>
            <input
              className={classes.slider}
              type="range"
              name="endAge"
              min="18"
              max="100"
              step="1"
              value={endAge}
              onChange={this.changeParam.bind(this, "endAge", 18, 100)}
            />
            <span className={classes.spanAll}>100</span>
          </div>
        </div>
        <div className={classes.filter}>
          <label className={classes.labelAll} htmlFor="distance">
            Maximum distance (km)
          </label>
          <Input
            name="distance"
            type="number"
            value={distance}
            onChange={this.changeParam.bind(this, "distance", 0, null)}
          />
        </div>
        <div className={classes.filter}>
          <label className={classes.labelAll} htmlFor="minFame">
            Minimum fame
          </label>
          <Input
            name="minFame"
            type="number"
            value={minFameRating}
            onChange={this.changeParam.bind(this, "minFameRating", 0, null)}
          />
        </div>
        <div className={classes.filter}>
          <label className={classes.labelAll} htmlFor="maxFame">
            Maximum fame
          </label>
          <Input
            name="maxFame"
            type="number"
            value={maxFameRating}
            onChange={this.changeParam.bind(this, "maxFameRating", 0, null)}
          />
        </div>
        <div className={classes.filter}>
          <label className={classes.labelAll} htmlFor="amountOfCommonInterests">
            Common interests amount
          </label>
          <Input
            name="amountOfCommonInterests"
            type="number"
            value={amountOfCommonInterests}
            onChange={this.changeParam.bind(
              this,
              "amountOfCommonInterests",
              0,
              null
            )}
          />
        </div>
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="select-multiple-checkbox">
            Interests
          </InputLabel>
          <Select
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
        <Button variant="contained" color="primary" onClick={this.filter}>
          Filter
        </Button>
      </div>
    );
  };
}

FilterPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilterPanel);
