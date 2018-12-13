import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {}
};

class User extends React.Component {
  render = () => {
    const { classes, user } = this.props;

    return (
      <div className={classes.root}>
        <div>
          <img alt="" src={user.gallery[user.avatarid]} />
        </div>
        <div>
          <span>{`${user.firstname} ${user.lastname}`}</span>
        </div>
      </div>
    );
  };
}

User.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(User);
