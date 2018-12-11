import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getCheckedBy } from "./../../api/api.js";

const styles = {
  root: {}
};

class CheckedBy extends React.Component {
  componentDidMount = () =>
    getCheckedBy()
      .then(response => response.json())
      .then(data =>
        this.setState({
          users: data
        })
      );

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const { users } = this.state;

    return (
      <div className={classes.root}>
        <h1>Checked By</h1>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    );
  }
}

CheckedBy.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CheckedBy);
