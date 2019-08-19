import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import User from './../User/User.js';
import { styles } from './Visited.styles';
import { withContext } from '../../utils/utils';

class Visited extends React.Component {
  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ul className={classes.userList}>
          {this.props.context.visited.map((user, index) => (
            <li key={index}>
              <User user={user} full={false} />
            </li>
          ))}
        </ul>
      </div>
    );
  };
}

Visited.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Visited));
