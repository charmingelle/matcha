import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { styles } from './SmallUser.styles';

class SmallUser extends React.Component {
  render = () => {
    const {
      classes,
      user: { login, firstname, lastname, gallery, avatarid },
    } = this.props;
    const avatar = gallery[avatarid];

    return (
      <Link
        className={classes.link}
        to={`/users/${login}`}
        onClick={() => this.props.context.updateVisited(login)}
      >
        <div className={classes.root}>
          <Avatar
            alt={`${firstname} ${lastname}`}
            src={`/${avatar}`}
            className={classes.avatar}
          />
          <span className={classes.name}>{`${firstname} ${lastname}`}</span>
        </div>
      </Link>
    );
  };
}

SmallUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SmallUser);
