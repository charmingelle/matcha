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
  },
  marioChat: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '80%'
  },
  chatWindow: {
    flexGrow: 1,
    overflow: 'auto',
    borderBottom: '1px solid #e9e9e9'
  },
  message: {
    width: '100%',
    padding: '14px'
  },
  outputStrong: {
    marginRight: '5px'
  },
  outputP: {
    padding: '14px 0px',
    margin: '0 14px',
    color: '#555'
  },
  typingP: {
    color: '#aaa',
    padding: '14px 0px',
    margin: '0 14px'
  },
  send: {
    padding: '18px 0',
    width: '100%',
    border: 'none',
    outline: '1px solid #e9e9e9'
  }
});

class Chat extends React.Component {
  constructor() {
    super();
    this.socket = socketIOClient('http://localhost:5000');
  }

  componentDidMount = () => {
    getChatLogins()
      .then(response => response.json())
      .then(users => this.setState({ users, selectedUser: users[0] }));
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { users, selectedUser } = this.state;
    const { classes } = this.props;

    return (
      <BrowserRouter>
        <div className={classes.root}>
          <List component="nav" className={classes.users}>
            {users.map((user, index) => (
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
