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

// import { createStore } from 'redux';

// let interests = [];

// const addInterests = (state = [], action) => {
//   if (action.type === 'ADD_INTEREST') {
//     return [...state, action.interest];
//   }
//   return state;
// };

// let store = createStore(addInterests);

// store.subscribe(() => {
//   // console.log('subscribe', store.getState());
//   interests = [...interests, ...store.getState()];
//   // console.log('interests', interests);
//   console.log(interests);
// });

// store.dispatch({'type': 'ADD_INTEREST', 'interest': {'label': 'running'}});
// store.dispatch({'type': 'ADD_INTEREST', 'interest': {'label': 'singing'}});

// fetch('/interests', {
//   method: 'POST',
//   credentials: 'include',
// })
//   .then(response => response.json())
//   .then(interests => {
//     interests.forEach(interest => {
//       store.dispatch({ type: 'ADD_INTEREST', interest: interest });
//     });
//   });

// function enterPressHandler(event) {
//   if (event.key === 'Enter') {
//     store.dispatch({ type: 'ADD_INTEREST', interest: event.target.value });
//   }
// }

// class Interests extends React.Component {
//   state = {
//     interests: this.props.interests,
//   };

//   onEnter = interest => {
//     const { interests } = this.props

//     if (interests.includes(interest)) {
//       return;
//     }

//     this.setState({
//       interests: [...interests, interest],
//     });
//   };

//   render() {
//     const { inputProps, ...other } = this.props;
//     const { ref, ...otherInputProps } = inputProps;

//     return (
//       <TextField
//         InputProps={{
//           inputRef: ref,
//           onKeyPress: this.onEnter,
//           ...otherInputProps,
//         }}
//         {...other}
//       />
//     );
//   }
// }

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
      key={suggestion}
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
    interests: null,
    suggestions: [],
  };

  async componentDidMount() {
    const interests = await fetch('/interests', {
      method: 'POST',
      credentials: 'include',
    }).then(response => response.json());

    this.setState({ interests });
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

    if (keycode(event) === 'enter' && inputValue.length) {
      this.handleChange(inputValue);
    }
  };

  handleInputChange = ({ target }) => {
    const { interests, selectedItem } = this.state;

    this.setState({
      inputValue: target.value,
      suggestions: [
        ...getSuggestions(interests, target.value),
        ...getSuggestions(selectedItem, target.value),
      ],
    });
  };

  handleChange = item => {
    let { selectedItem } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    this.setState({
      inputValue: '',
      selectedItem,
    });
  };

  handleDelete = item => () => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem];
      selectedItem.splice(selectedItem.indexOf(item), 1);
      return { selectedItem };
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
                startAdornment: selectedItem.map(item => (
                  <Chip
                    key={item}
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

function IntegrationDownshift(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <DownshiftMultiple classes={classes} />
    </div>
  );
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationDownshift);
