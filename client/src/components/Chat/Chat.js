import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
// import TextField from '@material-ui/core/TextField';
import { getChatLogins } from './../../api/api.js';
import socketIOClient from 'socket.io-client';
import Column from 'antd/lib/table/Column';

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
  marioChat: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '80%'
  },
  chatWindow: {
    flexGrow: 1,
    overflow: 'auto',
    borderBottom: '1px solid #e9e9e9',
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
      message: '',
      log: [],
      typing: {},
      users: []
    });
    this.socket.on('chat', data => {
      let newLog = this.state.log;
      let newTyping = this.state.typing;

      newLog.unshift({
        author: data.author,
        message: data.message
      });
      delete newTyping[data.author];
      this.setState({
        log: newLog,
        typing: newTyping
      });
    });
    this.socket.on('typing', data => {
      let newTyping = this.state.typing;

      newTyping[data.author] = true;
      this.setState({
        typing: newTyping
      });
    });
    getChatLogins()
      .then(response => response.json())
      .then(users => this.setState({ users }));
  };

  changeHandler = event =>
    this.setState({
      message: event.target.value
    });

  keyPressHandler = event => {
    this.socket.emit('typing', {
      author: this.props.author
    });
    if (event.key === 'Enter') {
      this.send();
    }
  };

  send = () => {
    if (this.state.message !== '') {
      this.socket.emit('chat', {
        author: this.props.author,
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
    console.log('this.state', this.state);
    const { message, log, typing, users } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav" className={classes.users}>
          {users.map((user, index) => (
            <div key={index}>
              <ListItem button>
                <ListItemText primary={user} />
              </ListItem>
              <Divider light />
            </div>
          ))}
        </List>

        <div className={classes.marioChat}>
          <div className={classes.chatWindow}>
            <div>
              {Object.keys(typing).map((record, index) => (
                <p className={classes.typingP} key={index}>
                  <em>{record} is typing a message...</em>
                </p>
              ))}
            </div>
            <div>
              {log.map((record, index) => (
                <p className={classes.outputP} key={index}>
                  <strong className={classes.outputStrong}>
                    {record.author}:
                  </strong>
                  {record.message}
                </p>
              ))}
            </div>
          </div>
          {/* <TextField
            className={classes.message}
            value={message}
            label="Say something"
            onChange={this.changeHandler}
            onKeyPress={this.keyPressHandler}
            variant="outlined"
          /> */}
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
    );
  };
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
