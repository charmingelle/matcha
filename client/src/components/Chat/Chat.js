import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Room from './Room/Room.js';
import { getChatLogins } from './../../api/api.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  link: {
    textDecoration: 'none'
  },
  users: {
    width: '20%',
    padding: 'unset',
    borderRight: '1px solid rgba(0, 0, 0, 0.08)'
  },
  onlineDot: {
    width: '5px',
    height: '5px',
    borderRadius: '100%',
    backgroundColor: 'green'
  },
  selectedUser: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  }
});

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.users = {};
    this.socket = this.props.socket;
  }

  componentDidMount = () => {
    this.props.changeTab(2);
    getChatLogins()
      .then(response => response.json())
      .then(users => {
        users.forEach(
          user =>
            (this.users[user.login] = {
              online: user.online,
              log: [],
              message: ''
            })
        );
        this.setState({
          selectedUser: users[0].login
        });
      });
  };

  updateLog = (receiver, log) => {
    this.users[receiver].log = log;
  };

  updateMessage = (receiver, message) => {
    this.users[receiver].message = message;
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { selectedUser } = this.state;
    const { classes } = this.props;

    return (
      <BrowserRouter>
        <div className={classes.root}>
          <List component="nav" className={classes.users}>
            {Object.keys(this.users).map((user, index) => (
              <Link className={classes.link} key={index} to={`/chat/${user}`}>
                <ListItem
                  button
                  className={user === selectedUser ? classes.selectedUser : ''}
                  onClick={() => this.setState({ selectedUser: user })}
                >
                  <ListItemText primary={user} />
                  {this.users[user].online && <div className={classes.onlineDot} />}
                </ListItem>
                <Divider light />
              </Link>
            ))}
          </List>
          <Route
            exact
            path="/chat/:receiver"
            component={({ match }) => (
              <Room
                socket={this.socket}
                sender={this.props.sender}
                receiver={match.params.receiver}
                log={this.users[match.params.receiver].log}
                message={this.users[match.params.receiver].message}
                updateLog={this.updateLog}
                updateMessage={this.updateMessage}
              />
            )}
          />
        </div>
      </BrowserRouter>
    );
  };
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
