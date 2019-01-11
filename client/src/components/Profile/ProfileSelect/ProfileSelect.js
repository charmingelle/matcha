import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const styles = theme => ({
  formControl: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    minWidth: 120
  }
});

class ProfileSelect extends React.Component {
  state = {
    [this.props.name]: ""
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
    const { classes, title, items } = this.props;

    return (
      <FormControl className={classes.formControl}>
        <InputLabel
          ref={ref => {
            this.InputLabelRef = ref;
          }}
          htmlFor="outlined-age-simple"
        >
          {title}
        </InputLabel>
        <Select
          value={this.state[[this.props.name]]}
          onChange={this.handleChange}
          input={<Input id="outlined-age-simple" />}
        >
          {items.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

ProfileSelect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSelect);
