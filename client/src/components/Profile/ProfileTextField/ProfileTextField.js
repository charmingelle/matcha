import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class ProfileTextField extends React.Component {
  state = {
    [this.props.name]: this.props.value,
  };

  handleChange = ({ target: { value } }) => {
    this.setState({ [this.props.name]: value });
    this.props.onChange({ [this.props.name]: value });
  };

  render() {
    const { name, label, placeholder, type, disabled } = this.props;

    return (
      <TextField
        label={label}
        placeholder={placeholder}
        value={this.state[name]}
        onChange={this.handleChange}
        type={type}
        disabled={disabled}
        margin="normal"
      />
    );
  }
}
