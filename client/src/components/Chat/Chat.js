import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
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
  message: {
    width: '100%',
    padding: '14px'
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
    this.props.changeTab(2);
    getChatLogins()
      .then(response => response.json())
      .then(users =>
        this.setState({
          users,
          selectedUser: users[0],
          drafts: {},
          message: ''
        })
      );
  };

  // saveDraft = (receiver, draft) => {
  //   let newDrafts = this.state.drafts;

  //   newDrafts[receiver] = draft;
  //   this.setState({
  //     drafts: newDrafts
  //   });
  //   console.log('this.state.drafts', this.state.drafts);
  // };

  changeHandler = event => {
    this.socket.emit('typing', {
      sender: this.props.sender,
      receiver: this.state.selectedUser
    });
    if (event.target.value === '') {
      this.socket.emit('stoppedTyping', {
        sender: this.props.sender,
        receiver: this.state.selectedUser
      });
    }
    this.setState({
      message: event.target.value
    });
  };

  keyPressHandler = event => {
    if (event.key === 'Enter') {
      this.send();
    }
  };

  send = () => {
    if (this.state.message !== '') {
      this.socket.emit('chat', {
        sender: this.props.sender,
        receiver: this.state.selectedUser,
        message: this.state.message
      });
      this.setState({
        message: ''
      });
    }
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { users, selectedUser, message } = this.state;
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
          <div className={classes.marioChat}>
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
              <Input
                type="text"
                className={classes.message}
                value={message}
                placeholder="Say something..."
                onChange={this.changeHandler}
                onKeyPress={this.keyPressHandler}
                disableUnderline={true}
              />
              <Button
                className={classes.send}
                onClick={this.send}
                variant="outlined"
              >
                Send
              </Button>
          </div>
        </div>
      </BrowserRouter>
    );
  };
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
