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
import { styles } from './FilterPanel.styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class FilterPanel extends React.Component {
  state = {
    startAge: 18,
    endAge: 100,
    distance: 5,
    minFameRating: 0,
    maxFameRating: '',
    amountOfCommonInterests: 0,
    selectedInterests: [],
    expanded: false,
  };

  changeParam = (param, intMin, intMax) => ({ target: { value } }) =>
    value >= intMin &&
    (!intMax || value <= intMax) &&
    this.setState({
      [param]: value,
    });

  filter = () => {
    this.state.expanded && this.props.setFilterParams(this.state);
    this.setState(
      {
        expanded: !this.state.expanded,
      },
      () => this.props.move(),
    );
  };

  handleInterestsChange = event =>
    this.setState({ selectedInterests: event.target.value });

  renderAgeBlock = () => {
    const { classes } = this.props;
    const { startAge, endAge } = this.state;

    return (
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
            onChange={this.changeParam('startAge', 18, parseInt(endAge))}
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
            onChange={this.changeParam('endAge', parseInt(startAge), 100)}
          />
          <span className={classes.spanAll}>100</span>
        </div>
      </div>
    );
  };

  renderDistanceBlock = () => {
    const { classes } = this.props;
    const { distance } = this.state;

    return (
      <div className={classes.filter}>
        <label className={classes.labelAll} htmlFor="distance">
          Maximum distance (km)
        </label>
        <Input
          name="distance"
          type="number"
          value={distance}
          onChange={this.changeParam('distance', 0)}
        />
      </div>
    );
  };

  renderMinFameBlock = () => {
    const { classes } = this.props;
    const { minFameRating } = this.state;

    return (
      <div className={classes.filter}>
        <label className={classes.labelAll} htmlFor="minFame">
          Minimum fame
        </label>
        <Input
          name="minFame"
          type="number"
          value={minFameRating}
          onChange={this.changeParam('minFameRating', 0)}
        />
      </div>
    );
  };

  renderMaxFameBlock = () => {
    const { classes } = this.props;
    const { maxFameRating } = this.state;

    return (
      <div className={classes.filter}>
        <label className={classes.labelAll} htmlFor="maxFame">
          Maximum fame
        </label>
        <Input
          name="maxFame"
          type="number"
          value={maxFameRating}
          onChange={this.changeParam('maxFameRating', 0)}
        />
      </div>
    );
  };

  renderCommonInterestsBlock = () => {
    const { classes } = this.props;
    const { amountOfCommonInterests } = this.state;

    return (
      <div className={classes.filter}>
        <label className={classes.labelAll} htmlFor="amountOfCommonInterests">
          Common interests amount
        </label>
        <Input
          name="amountOfCommonInterests"
          type="number"
          value={amountOfCommonInterests}
          onChange={this.changeParam('amountOfCommonInterests', 0)}
        />
      </div>
    );
  };

  renderInterestsBlock = () => {
    const { classes, interests } = this.props;
    const { selectedInterests } = this.state;

    return (
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="select-multiple-checkbox">
          Interests
        </InputLabel>
        <Select
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
    );
  };

  renderFilterButton = () => (
    <Button variant="contained" color="primary" onClick={this.filter}>
      Filter
    </Button>
  );

  render = () =>
    this.state && (
      <div
        className={
          this.state.expanded
            ? this.props.classes.root
            : this.props.classes.hidden
        }
      >
        {this.renderAgeBlock()}
        {this.renderDistanceBlock()}
        {this.renderMinFameBlock()}
        {this.renderMaxFameBlock()}
        {this.renderCommonInterestsBlock()}
        {this.renderInterestsBlock()}
        {this.renderFilterButton()}
      </div>
    );
}

FilterPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterPanel);
