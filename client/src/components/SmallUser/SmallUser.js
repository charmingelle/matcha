import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { saveVisited } from './../../api/api.js';

const styles = {
  link: {
    color: 'initial',
    textDecoration: 'none'
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: '5px'
  },
  avatar: {
    height: '100px'
  },
  name: {
    // color: 'rgba(0, 0, 0, 0.54)',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
};

class SmallUser extends React.Component {
  addToVisited = () => {
    console.log('this.props.visited', this.props.visited);
    console.log('this.props.login', this.props.user.login);
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
          <img
            className={classes.avatar}
            alt=""
            src={`users/photos/${gallery[avatarid]}`}
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
