import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { getMessages } from './../../../api/api.js';

const styles = theme => ({
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

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sender: this.props.sender,
      receiver: this.props.receiver,
      log: [],
      typing: false,
      message: ''
    };
    this.socket = this.props.socket;
  }

  componentDidMount = () => {
    getMessages(this.props.sender, this.props.receiver)
      .then(response => response.json())
      .then(log => this.setState({ log }))
      .then(() => {
        this.socket.on('chat', data => {
          let user = null;

          if (this.props.sender === data.sender) {
            user = data.receiver;
          } else if (this.props.sender === data.receiver) {
            user = data.sender;
          }
          if (user) {
            let newLog = this.state.log;

            newLog.unshift({
              sender: data.sender,
              receiver: data.receiver,
              message: data.message,
              now: Date.now()
            });
            this.setState({
              log: newLog,
              typing: false
            });
          }
        });
        this.socket.on('typing', data => {
          if (this.props.sender === data.receiver) {
            this.setState({
              typing: true
            });
          }
        });
        this.socket.on('stoppedTyping', data => {
          if (this.props.sender === data.receiver) {
            this.setState({
              typing: false
            });
          }
        });
      });
  };

  changeHandler = event => {
    this.socket.emit('typing', {
      sender: this.state.sender,
      receiver: this.state.receiver
    });
    if (event.target.value === '') {
      this.socket.emit('stoppedTyping', {
        sender: this.state.sender,
        receiver: this.state.receiver
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
        sender: this.state.sender,
        receiver: this.state.receiver,
        message: this.state.message
      });
      this.setState({
        message: ''
      });
    }
  };

  render = () => {
    const { receiver, log, typing, message } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.marioChat}>
        <div className={classes.chatWindow}>
          <div>
            {typing && (
              <p className={classes.typingP}>
                <em>{receiver} is typing a message...</em>
              </p>
            )}
          </div>
          <div>
            {log.map((record, index) => (
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
          value={message}
          placeholder="Say something..."
          onChange={this.changeHandler}
          onKeyPress={this.keyPressHandler}
          disableUnderline={true}
        />
        <Button className={classes.send} onClick={this.send} variant="outlined">
          Send
        </Button>
      </div>
    );
  };
}

Room.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Room);
