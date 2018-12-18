import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { saveVisited } from './../../api/api.js';

const styles = {
  link: {
    color: 'initial',
    textDecoration: 'none',
    '&:hover': {
      color: '#3f51b5'
    }
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: 15
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
};

class SmallUser extends React.Component {
  addToVisited = () => {
    if (!this.props.visited.includes(this.props.user.login)) {
      let newVisited = this.props.visited;

      newVisited.push(this.props.user.login);
      saveVisited(newVisited).then(() => {
        this.props.socket.emit('check', {
          sender: this.props.sender,
          receiver: this.props.login
        });
        this.props.updateVisited(newVisited);
      });
    }
  };

  render = () => {
    const {
      classes,
      user: { login, firstname, lastname, gallery, avatarid }
    } = this.props;

    return (
      <Link
        className={classes.link}
        to={`/users/${login}`}
        onClick={this.addToVisited}
      >
        <div className={classes.root}>
          <Avatar
            alt={`${firstname} ${lastname}`}
            src={`users/photos/${gallery[avatarid]}`}
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
