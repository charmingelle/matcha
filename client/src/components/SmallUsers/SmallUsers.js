import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SmallUser from "./../SmallUser/SmallUser.js";

const styles = {
  root: {}
};

class SmallUsers extends React.Component {
  componentDidMount = () =>
    this.props
      .getUserList()
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
    const { classes, title } = this.props;
    const { users } = this.state;

    return (
      <div className={classes.root}>
        <h1>{title}</h1>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <SmallUser user={user} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

SmallUsers.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SmallUsers);
