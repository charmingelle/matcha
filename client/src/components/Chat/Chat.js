import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { getChatLogins } from './../../api/api.js';
import socketIOClient from 'socket.io-client';

const styles = theme => ({
  marioChat: {
    maxWidth: '600px',
    margin: '30px auto',
    border: '1px solid #ddd',
    boxShadow: '1px 3px 5px rgba(0,0,0,0.05)',
    borderКadius: '2px'
  },
  chatWindow: {
    height: '400px',
    overflow: 'auto',
    background: '#f9f9f9'
  },
  message: {
    width: '100%'
  },
  outputStrong: {
    marginRight: '5px'
  },
  outputP: {
    padding: '14px 0px',
    margin: '0 14px',
    borderBottom: '1px solid #e9e9e9',
    color: '#555'
  },
  typingP: {
    color: '#aaa',
    padding: '14px 0px',
    margin: '0 14px'
  },
  send: {
    padding: '18px 0',
    width: '100%'
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
      typing: {}
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
    // getChatLogins()
    //   .then(response => response.json())
    //   .then(data => console.log(data));
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
    const { classes } = this.props;

    return (
      <div className={classes.marioChat}>
        <div className={classes.chatWindow}>
          <div>
            {Object.keys(this.state.typing).map((record, index) => (
              <p className={classes.typingP} key={index}>
                <em>{record} is typing a message...</em>
              </p>
            ))}
          </div>
          <div>
            {this.state.log.map((record, index) => (
              <p className={classes.outputP} key={index}>
                <strong className={classes.outputStrong}>
                  {record.author}:
                </strong>
                {record.message}
              </p>
            ))}
          </div>
        </div>
        <TextField
          className={classes.message}
          value={this.state.message}
          label="Say something"
          onChange={this.changeHandler}
          onKeyPress={this.keyPressHandler}
          variant="outlined"
        />
        <Button className={classes.send} onClick={this.send}>
          Send
        </Button>
      </div>
    );
  };
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
