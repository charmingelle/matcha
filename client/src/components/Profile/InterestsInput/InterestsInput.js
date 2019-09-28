import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import { styles } from './InterestsInput.styles';

const Interests = props => {
  const { inputProps, handleAdding, ...other } = props;
  const { ref, ...otherInputProps } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...otherInputProps,
      }}
      {...other}
    />
  );
};

const renderSuggestion = ({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) => {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={index}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion}
    </MenuItem>
  );
};

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

const getSuggestions = (interests, value) => {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : interests.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }
        return keep;
      });
};

class DownshiftMultiple extends React.Component {
  state = {
    inputValue: '',
    selectedItem: this.props.value,
    interests: this.props.all,
    suggestions: [],
  };

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state;

    if (
      selectedItem.length &&
      !inputValue.length &&
      keycode(event) === 'backspace'
    ) {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }

    if (keycode(event) === 'space' && inputValue.length) {
      this.handleChange(inputValue.trim());
    }
  };

  handleInputChange = ({ target }) => {
    const { interests } = this.state;

    this.setState({
      inputValue: target.value,
      suggestions: [...getSuggestions(interests, target.value)],
    });
  };

  handleChange = item => {
    let { interests, selectedItem } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }
    if (interests.indexOf(item) === -1) {
      interests = [...interests, item];
    }
    this.setState({
      inputValue: '',
      selectedItem,
      interests,
    });
    this.props.onChange({ interests: selectedItem });
  };

  handleDelete = item => () => {
    const selectedItem = this.state.selectedItem;

    selectedItem.splice(selectedItem.indexOf(item), 1);
    this.setState({
      selectedItem: selectedItem,
    });
  };

  renderInterests = getInputProps => (
    <Interests
      fullWidth
      interests={this.state.interests}
      handleAdding={this.handleChange}
      inputProps={getInputProps({
        startAdornment: this.state.selectedItem.map((item, index) => (
          <Chip
            key={index}
            tabIndex={-1}
            label={item}
            className={this.props.classes.chip}
            onDelete={this.handleDelete(item)}
          />
        )),
        onChange: this.handleInputChange,
        onKeyDown: this.handleKeyDown,
        placeholder: 'Select multiple interests',
      })}
      label="Interests"
    />
  );

  renderSuggestions = (getItemProps, selectedItem, highlightedIndex) => (
    <Paper className={this.props.classes.paper} square>
      {this.state.suggestions.map((suggestion, index) =>
        renderSuggestion({
          suggestion,
          index,
          itemProps: getItemProps({ item: suggestion }),
          highlightedIndex,
          selectedItem,
        }),
      )}
    </Paper>
  );

  renderChildren = () => ({
    getInputProps,
    getItemProps,
    isOpen,
    selectedItem,
    highlightedIndex,
  }) => (
    <div className={this.props.classes.container}>
      {this.renderInterests(getInputProps)}
      {isOpen &&
        this.renderSuggestions(getItemProps, selectedItem, highlightedIndex)}
    </div>
  );

  render = () => {
    const { inputValue, selectedItem, interests } = this.state;

    return interests ? (
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
      >
        {this.renderChildren()}
      </Downshift>
    ) : null;
  };
}

DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired,
};

class IntegrationDownshift extends React.Component {
  render = () => {
    const { classes, name, value, all, onChange } = this.props;

    return (
      <div className={classes.root}>
        <DownshiftMultiple
          classes={classes}
          name={name}
          value={value}
          all={all}
          onChange={onChange}
        />
      </div>
    );
  };
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationDownshift);
