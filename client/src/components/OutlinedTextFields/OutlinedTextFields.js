import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

class OutlinedTextField extends React.Component {
  state = {
    [this.props.name]: ''
  };

  componentDidMount() {
    this.setState({
      [this.props.name]: this.props.value
    });
  }

  handleChange = event => {
    this.setState({ [this.props.name]: event.target.value });
    this.props.onChange({ [this.props.name]: event.target.value });
  };

  render() {
    const { label, placeholder } = this.props;

    return (
      <TextField
        id="outlined-full-width"
        label={label}
        style={{ margin: 8 }}
        placeholder={placeholder}
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true
        }}
        onChange={this.handleChange}
        value={this.state[this.props.name]}
      />
    );
  }
}

OutlinedTextField.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OutlinedTextField);
