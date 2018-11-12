import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
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
    radius: 1,
    fame: 0,
    name: [],
    names: []
  };

  componentDidMount() {
    this.setState({
      names: this.props.interests
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
        radius: event.target.value
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

  render() {
    if (!this.state.names) {
      return <span>Loader is here</span>;
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
          value={this.state.radius}
          onChange={this.handleRadiusChange}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"     
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-checkbox">Interests</InputLabel>
          <Select
            className={classes.formControlSelect}
            multiple
            value={this.state.name}
            onChange={this.handleInterestsChange}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {this.state.names.map(name => (
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
      </div>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TextFields);
