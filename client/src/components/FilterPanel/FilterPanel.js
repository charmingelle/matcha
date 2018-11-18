import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
    flexDirection: 'row'
  },
  formControlSelect: {
    width: '100%'
  }
});

const EARTH_RADIUS = 6371;
const MAX_DISTANCE = Math.PI * EARTH_RADIUS;
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

class TextFields extends React.Component {
  state = {
    age: 18,
    distance: 1,
    fame: 0,
    name: [],
    interests: []
  };

  componentDidMount() {
    this.setState({
      profileLocation: this.props.profileLocation,
      interests: this.props.interests,
      users: this.props.users,
      filteredUsers: this.props.filteredUsers
    });
  }

  handleAgeChange = event => {
    if (event.target.value >= 18) {
      this.setState({
        age: event.target.value
      });
    }
  };

  handleRadiusChange = event => {
    if (event.target.value >= 1) {
      this.setState({
        distance: event.target.value
      });
    }
  };

  handleInterestsChange = event => {
    this.setState({ name: event.target.value });
  };

  handleFameChange = event => {
    if (event.target.value >= 0) {
      this.setState({
        fame: event.target.value
      });
    }
  };

  deg2rad = deg => deg * (Math.PI / 180);

  getDistance = (profileLocation, userLocation) => {
    if (!profileLocation || !userLocation) {
      return MAX_DISTANCE;
    }
    let dLat = this.deg2rad(userLocation[0] - profileLocation[0]);
    let dLon = this.deg2rad(userLocation[1] - profileLocation[1]);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(profileLocation[0])) *
        Math.cos(this.deg2rad(userLocation[0])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
  };

  filter = () => {
    const filteredUsers = this.state.users.filter(
      user =>
        user.age >= this.state.age &&
        this.getDistance(this.state.profileLocation, user.location) <=
          this.state.distance &&
        (user.interests.length === 0 ||
          user.interests.some(interest => {
            if (this.state.name.length === 0) {
              return true;
            }
            return this.state.name.includes(interest);
          })) &&
        user.fame >= this.state.fame
    );

    this.setState({
      filteredUsers
    });
    this.props.onChange(filteredUsers);
  };

  render() {
    if (!this.state.interests) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <TextField
          label="Age +"
          value={this.state.age}
          onChange={this.handleAgeChange}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
        />
        <TextField
          label="Radius (km)"
          value={this.state.distance}
          onChange={this.handleRadiusChange}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
        />

        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="select-multiple-checkbox">Interests</InputLabel>
          <Select
            className={classes.formControlSelect}
            multiple
            value={this.state.name}
            onChange={this.handleInterestsChange}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {this.state.interests.map(name => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={this.state.name.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Fame rating +"
          value={this.state.fame}
          onChange={this.handleFameChange}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
        />

        <Button variant="outlined" onClick={this.filter}>
          Filter
        </Button>
      </div>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TextFields);
