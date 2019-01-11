import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";

const styles = {
  link: {
    color: "initial",
    textDecoration: "none",
    "&:hover": {
      color: "#3f51b5"
    }
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingRight: 15
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
};

class SmallUser extends React.Component {
  render = () => {
    const {
      classes,
      user: { login, firstname, lastname, gallery, avatarid }
    } = this.props;
    const avatar = gallery.length > 0 ? gallery[avatarid] : "avatar.png";

    return (
      <Link
        className={classes.link}
        to={`/users/${login}`}
        onClick={() => this.props.updateVisited(this.props.user.login)}
      >
        <div className={classes.root}>
          <Avatar
            alt={`${firstname} ${lastname}`}
            src={require(`./../../../../photos/${avatar}`)}
            className={classes.avatar}
          />
          <span className={classes.name}>{`${firstname} ${lastname}`}</span>
        </div>
      </Link>
    );
  };
}

SmallUser.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SmallUser);
