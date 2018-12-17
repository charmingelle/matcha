import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
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
  outputPs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  outputPOther: {
    position: 'relative',
    marginRight: '10%',
    marginTop: 5,
    width: '80%',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    '&:last-child': {
      marginBottom: 5
    }
  },
  outputPMine: {
    position: 'relative',
    marginLeft: '10%',
    marginTop: 5,
    width: '80%',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    backgroundColor: 'rgba(245, 0, 87, 0.1)',
    '&:last-child': {
      marginBottom: 5
    }
  },
  messageText: {
    margin: 0
  },
  messageTime: {
    textAlign: 'end',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.54)'
  },
  typingP: {
    width: '80%',
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#ffffff'
  },
  message: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffffff'
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
      message: this.props.message,
      log: [],
      typing: '',
      isLoading: false,
      lastloadedid: null,
      moreData: true
    };
    this.socket = this.props.socket;
  }

  addSocketEventListeners = () => {
    this.socket.on('chat', data => {
      let newLog = this.state.log;

      newLog.unshift(data);
      this.setState({
        log: newLog,
        typing: ''
      });
      if (this.state.lastloadedid === null) {
        this.setState({
          lastloadedid: data.id
        });
      }
    });
    this.socket.on('typing', data => {
      if (this.state.receiver === data.sender) {
        this.setState({
          typing: data.sender
        });
      }
    });
    this.socket.on('stoppedTyping', data => {
      if (this.state.receiver === data.sender) {
        this.setState({
          typing: ''
        });
      }
    });
  };

  componentDidMount = () => {
    this.addSocketEventListeners();
    if (this.props.log.length !== 0) {
      this.setState({
        log: this.props.log,
        lastloadedid: this.props.log[this.props.log.length - 1].id
      });
    } else {
      getMessages(
        this.state.sender,
        this.state.receiver,
        this.state.lastloadedid
      )
        .then(response => response.json())
        .then(log => {
          if (log.length !== 0) {
            this.setState({ lastloadedid: log[log.length - 1].id });
          }
          this.setState({ log });
        });
    }
  };

  componentWillUnmount = () => {
    this.props.updateMessage(this.state.receiver, this.state.message);
    this.props.updateLog(this.state.receiver, this.state.log);
    this.socket.off('chat');
    this.socket.off('typing');
    this.socket.off('stoppedTyping');
  };

  isScrolledToBottom = target => {
    return target.scrollTop >= target.scrollHeight - target.offsetHeight;
  };

  scrollHandler = event => {
    if (this.isScrolledToBottom(event.target)) {
      if (!this.state.isLoading && this.state.moreData) {
        this.setState({
          isLoading: true
        });
        getMessages(
          this.state.sender,
          this.state.receiver,
          this.state.lastloadedid
        )
          .then(response => response.json())
          .then(log => {
            if (log.length === 0) {
              this.setState({
                moreData: false
              });
            } else {
              let newLog = this.state.log;

              newLog.push(...log);
              this.setState({
                log: newLog,
                lastloadedid: newLog[newLog.length - 1].id
              });
            }
          })
          .then(() =>
            this.setState({
              isLoading: false
            })
          );
      }
    }
  };

  changeHandler = event => {
    console.log('event.target.value', event.target.value);
    this.socket.emit('typing', {
      sender: this.props.sender,
      receiver: this.state.receiver
    });
    if (event.target.value === '') {
      this.socket.emit('stoppedTyping', {
        sender: this.props.sender,
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
        sender: this.props.sender,
        receiver: this.state.receiver,
        message: this.state.message
      });
      this.setState({
        message: ''
      });
    }
  };

  render = () => {
    const { message, log, typing } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.marioChat}>
        <div className={classes.chatWindow} onScroll={this.scrollHandler}>
          {typing && (
            <p className={classes.typingP}>
              <em>{typing} is typing a message...</em>
            </p>
          )}
          <div className={classes.outputPs}>
            {log.map((record, index) => (
              <div
                className={
                  record.sender === this.state.sender
                    ? classes.outputPMine
                    : classes.outputPOther
                }
                key={index}
              >
                <p className={classes.messageText}>{record.message}</p>
                <span className={classes.messageTime}>{`${new Date(
                  parseInt(record.time)
                ).toLocaleString()} `}</span>
              </div>
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
        <Button
          className={classes.send}
          onClick={this.send}
          variant="contained"
          color="secondary"
        >
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
