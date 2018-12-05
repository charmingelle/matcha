import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { getChatLogins } from './../../api/api.js';
import socketIOClient from 'socket.io-client';
import Room from './Room/Room.js';
import { BrowserRouter, Route, Link } from 'react-router-dom';

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
  selectedUser: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  }
});

class Chat extends React.Component {
  constructor() {
    super();
    this.users = {};
    this.socket = socketIOClient('http://localhost:5000');
    this.socket.emit('test');
  }

  componentDidMount = () => {
    this.props.changeTab(2);
    getChatLogins()
      .then(response => response.json())
      .then(users => {
        users.forEach(
          user =>
            (this.users[user] = {
              log: [],
              draft: ''
            })
        );
        this.setState({
          selectedUser: users[0]
        });
      });
  };

  updateLog = (receiver, newLog) => {
    this.users[receiver].log = newLog;
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
                updateLog={this.updateLog}
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
