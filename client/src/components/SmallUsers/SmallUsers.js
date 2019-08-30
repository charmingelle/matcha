import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SmallUser from './SmallUser/SmallUser';
import { styles } from './SmallUsers.styles';

class SmallUsers extends React.Component {
  componentDidMount = () =>
    this.props.getUserList().then(users => this.setState({ users }));

  renderUserList = () => (
    <ul className={this.props.classes.list}>
      {this.state.users.map((user, index) => (
        <li key={index}>
          <SmallUser user={user} updateVisited={this.props.updateVisited} />
        </li>
      ))}
    </ul>
  );

  renderSmallUsers = () => (
    <div className={this.props.classes.root}>
      <h1 className={this.props.classes.title}>
        <span className={this.props.classes.icon}>{this.props.icon}</span>{' '}
        {this.props.title}
      </h1>
      {this.renderUserList()}
    </div>
  );

  render = () =>
    !this.state
      ? null
      : this.state.users.length
      ? this.renderSmallUsers()
      : null;
}

SmallUsers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SmallUsers);
