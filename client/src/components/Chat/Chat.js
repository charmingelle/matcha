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

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
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
    this.setState({
      users: {},
      selectedUser: null
    });
    getChatLogins()
      .then(response => response.json())
      .then(users => {
        console.log('users', users);
        let objectUsers = {};

        users.forEach(
          user =>
            (objectUsers[user] = {
              log: [],
              typing: false,
              message: ''
            })
        );
        this.setState({ users: objectUsers, selectedUser: users[0] });
      })
      .then(() => {
        this.socket.on('chat', data => {
          let user = null;

          if (this.props.sender === data.sender) {
            user = data.receiver;
          } else if (this.props.sender === data.receiver) {
            user = data.sender;
          }
          if (user) {
            let newUsers = this.state.users;
            let newLog = newUsers[user].log;

            newLog.unshift({
              sender: data.sender,
              message: data.message
            });
            newUsers[user].log = newLog;
            newUsers[user].typing = false;
            this.setState({
              users: newUsers
            });
          }
        });
        this.socket.on('typing', data => {
          if (this.props.sender === data.receiver) {
            let newUsers = this.state.users;

            newUsers[data.sender].typing = true;
            this.setState({
              users: newUsers
            });
          }
        });
        this.socket.on('stoppedTyping', data => {
          if (this.props.sender === data.receiver) {
            let newUsers = this.state.users;

            newUsers[data.sender].typing = false;
            this.setState({
              users: newUsers
            });
          }
        });
      });
  };

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
    let newUsers = this.state.users;

    newUsers[this.state.selectedUser].message = event.target.value;
    this.setState({
      users: newUsers
    });
  };

  keyPressHandler = event => {
    if (event.key === 'Enter') {
      this.send();
    }
  };

  send = () => {
    if (this.state.users[this.state.selectedUser].message !== '') {
      this.socket.emit('chat', {
        sender: this.props.sender,
        receiver: this.state.selectedUser,
        message: this.state.users[this.state.selectedUser].message
      });
      let newUsers = this.state.users;

      newUsers[this.state.selectedUser].message = '';
      this.setState({
        users: newUsers
      });
      this.setState({
        users: newUsers
      });
    }
  };

  render = () => {
    console.log('this.state', this.state);
    if (!this.state || !this.state.users || !this.state.selectedUser) {
      return <span>Loading...</span>;
    }
    const { users, selectedUser } = this.state;
    const { classes } = this.props;

    console.log('this.state.selectedUser', this.state.selectedUser);
    return (
      <div className={classes.root}>
        <List component="nav" className={classes.users}>
          {Object.keys(users).map((user, index) => (
            <div key={index}>
              <ListItem
                button
                className={user === selectedUser ? classes.selectedUser : ''}
                onClick={() => this.setState({ selectedUser: user })}
              >
                <ListItemText primary={user} />
              </ListItem>
              <Divider light />
            </div>
          ))}
        </List>
        
        {/* <div className={classes.marioChat}>
          <div className={classes.chatWindow}>
            <div>
              {users[selectedUser].typing && (
                <p className={classes.typingP}>
                  <em>{selectedUser} is typing a message...</em>
                </p>
              )}
            </div>
            <div>
              {users[selectedUser].log.map((record, index) => (
                <p className={classes.outputP} key={index}>
                  <strong className={classes.outputStrong}>
                    {record.sender}:
                  </strong>
                  {record.message}
                </p>
              ))}
            </div>
          </div>
          <Input
            type="text"
            className={classes.message}
            value={users[selectedUser].message}
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
        </div> */}
        
        <Room sender={this.props.sender} receiver={this.state.selectedUser} />
      </div>
    );
  };
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
