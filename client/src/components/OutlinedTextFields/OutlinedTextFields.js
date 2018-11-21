import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({});

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
    const { label, placeholder, disabled } = this.props;

    return (
      <TextField
        className={this.props.classes.root}
        id="outlined-full-width"
        label={label}
        placeholder={placeholder}
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true
        }}
        onChange={this.handleChange}
        value={this.state[this.props.name]}
        disabled={disabled}
      />
    );
  }
}

OutlinedTextField.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OutlinedTextField);
