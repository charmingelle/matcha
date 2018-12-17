import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'inherit',
    backgroundColor: '#ffffff'
  },
  ageFilter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    margin: '8px 8px 8px 0'
  },
  startAgeInputBlock: {
    display: 'flex'
  },
  endAgeInputBlock: {
    display: 'flex'
  },
  distanceFilter: {
    minWidth: '50px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    margin: '8px'
  },
  fameFilter: {
    minWidth: '50px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    margin: '8px'
  },
  amountOfCommonInterestsFilter: {
    minWidth: '50px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    margin: '8px'
  },
  formControl: {
    minWidth: '50px',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    margin: theme.spacing.unit
  },
  formControlSelect: {},
  filterButton: {
    margin: '8px 0 8px 8px',
    minWidth: '50px',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: '8px'
  },
  slider: {
    minWidth: '50px'
  },
  labelAll: {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  inputAll: {
    minWidth: '50px',
    paddingTop: '6px',
    paddingBottom: '7px',
    border: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    outline: 'none',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '16px',
    '&:hover': {
      borderBottom: '2px solid rgba(0, 0, 0, 0.87)'
    }
  },
  spanAll: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  spanSpecial: {
    color: 'rgba(0, 0, 0, 0.87)'
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
      maxFameRating: '',
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
          <div>
            <label className={classes.labelAll} htmlFor="startAge">
              Start Age <span className={classes.spanSpecial}>{startAge}</span>
            </label>
          </div>
          <div className={classes.startAgeInputBlock}>
            <span className={classes.spanAll}>18</span>
            <input
              className={classes.slider}
              type="range"
              name="startAge"
              min="18"
              max="100"
              step="1"
              value={startAge}
              onChange={this.changeParam.bind(this, 'startAge')}
            />
            <span className={classes.spanAll}>100</span>
          </div>
          <div>
            <label className={classes.labelAll} htmlFor="endAge">
              End Age <span className={classes.spanSpecial}>{endAge}</span>
            </label>
          </div>
          <div className={classes.endAgeInputBlock}>
            <span className={classes.spanAll}>18</span>
            <input
              className={classes.slider}
              type="range"
              name="endAge"
              min="18"
              max="100"
              step="1"
              value={endAge}
              onChange={this.changeParam.bind(this, 'endAge')}
            />
            <span className={classes.spanAll}>100</span>
          </div>
        </div>
        <div className={classes.distanceFilter}>
          <label className={classes.labelAll} htmlFor="distance">
            Maximum distance (km)
          </label>
          <input
            className={classes.inputAll}
            name="distance"
            type="number"
            min="0"
            value={distance}
            onChange={this.changeParam.bind(this, 'distance')}
          />
        </div>
        <div className={classes.fameFilter}>
          <label className={classes.labelAll} htmlFor="minFame">
            Min fame
          </label>
          <input
            className={classes.inputAll}
            name="minFame"
            type="number"
            min="0"
            value={minFameRating}
            onChange={this.changeParam.bind(this, 'minFameRating')}
          />
          <label className={classes.labelAll} htmlFor="maxFame">
            Max fame
          </label>
          <input
            className={classes.inputAll}
            name="maxFame"
            type="number"
            min="0"
            value={maxFameRating}
            onChange={this.changeParam.bind(this, 'maxFameRating')}
          />
        </div>
        <div className={classes.amountOfCommonInterestsFilter}>
          <label className={classes.labelAll} htmlFor="amountOfCommonInterests">
            Minimum amount of common interests
          </label>
          <input
            className={classes.inputAll}
            name="amountOfCommonInterests"
            type="number"
            min="0"
            value={amountOfCommonInterests}
            onChange={this.changeParam.bind(this, 'amountOfCommonInterests')}
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
            renderValue={selected => selected.join(', ')}
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
        <Button
          className={classes.filterButton}
          variant="contained"
          color="secondary"
          onClick={this.filter}
        >
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
