import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SmallUser from './SmallUser/SmallUser.js';
import { styles } from './SmallUsers.styles';

class SmallUsers extends React.Component {
  componentDidMount = () =>
    this.props
      .getUserList()
      .then(response => response.json())
      .then(data =>
        this.setState({
          users: data,
        }),
      );

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes, title, icon } = this.props;
    const { users } = this.state;

    if (users.length > 0) {
      return (
        <div className={classes.root}>
          <h1 className={classes.title}>
            <span className={classes.icon}>{icon}</span> {title}
          </h1>
          <ul className={classes.list}>
            {users.map((user, index) => (
              <li key={index}>
                <SmallUser
                  user={user}
                  updateVisited={this.props.updateVisited}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return <div />;
  }
}

SmallUsers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SmallUsers);
