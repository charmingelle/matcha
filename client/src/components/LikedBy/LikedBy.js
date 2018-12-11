import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { getLikedBy } from "./../../api/api.js";

const styles = {
  root: {}
};

class LikedBy extends React.Component {
  componentDidMount = () =>
    getLikedBy()
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
        <h1>Liked By</h1>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    );
  }
}

LikedBy.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LikedBy);
