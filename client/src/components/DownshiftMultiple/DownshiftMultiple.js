import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

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

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) {
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
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(interests, value) {
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
}

class DownshiftMultiple extends React.Component {
  state = {
    inputValue: '',
    selectedItem: [],
    interests: [],
    suggestions: [],
  };

  componentDidMount() {
    this.setState({ selectedItem: this.props.value, interests: this.props.all });
  }

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
    const { interests, selectedItem } = this.state;

    this.setState({
      inputValue: target.value,
      suggestions: [
        ...getSuggestions(interests, target.value)
      ],
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
      interests
    });
    this.props.onChange({ interests: selectedItem });
  };

  handleDelete = item => () => {
    const selectedItem = this.state.selectedItem;

    selectedItem.splice(selectedItem.indexOf(item), 1);
    this.setState({
      selectedItem: selectedItem
    });
  };

  render() {
    const { classes } = this.props;
    const { inputValue, selectedItem, interests, suggestions } = this.state;

    if (!interests) {
      return null;
    }

    return (
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            <Interests
              fullWidth
              interests={interests}
              handleAdding={this.handleChange}
              inputProps={getInputProps({
                startAdornment: selectedItem.map((item, index) => (
                  <Chip
                    key={index}
                    tabIndex={-1}
                    label={item}
                    className={classes.chip}
                    onDelete={this.handleDelete(item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: 'Select multiple interests',
              })}
              label="Interests"
            />
            {isOpen ? (
              <Paper className={classes.paper} square>
                {suggestions.map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  })
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    margin: '8px',
    flexGrow: 1,
    height: 250,
  },
  container: {
    margin: '8px',
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

let popperNode;

class IntegrationDownshift extends React.Component {
  render() {
    const { classes, name, value, all, onChange } = this.props;
  
    return (
      <div className={classes.root}>
        <DownshiftMultiple classes={classes} name={name} value={value} all={all} onChange={onChange} />
      </div>
    );
  }
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationDownshift);
