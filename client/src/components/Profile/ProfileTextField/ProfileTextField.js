import React from "react";
import TextField from "@material-ui/core/TextField";

export default class ProfileTextField extends React.Component {
  state = {
    [this.props.name]: ""
  };

  componentDidMount = () =>
    this.setState({
      [this.props.name]: this.props.value
    });

  handleChange = event => {
    this.setState({ [this.props.name]: event.target.value });
    this.props.onChange({ [this.props.name]: event.target.value });
  };

  render() {
    const { label, placeholder, disabled } = this.props;

    return (
      <TextField
        id="outlined-full-width"
        label={label}
        placeholder={placeholder}
        fullWidth
        margin="normal"
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
