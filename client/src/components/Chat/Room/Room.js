import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
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
  outputString: {
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

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sender: this.props.sender,
      receiver: this.props.receiver,
      message: this.props.message,
      log: [],
      typing: false,
      isLoading: false,
      lastloadedid: null,
      moreData: true
    };
    this.socket = this.props.socket;
  }

  addSocketEventListeners = () => {
    this.socket.on('chat', data => {
      let user = null;

      if (this.state.sender === data.sender) {
        user = data.receiver;
      } else if (this.state.sender === data.receiver) {
        user = data.sender;
      }
      if (user) {
        let newLog = this.state.log;

        newLog.unshift(data);
        this.setState({
          log: newLog,
          typing: false
        });
      }
    });
    this.socket.on('typing', data => {
      if (this.state.sender === data.receiver) {
        this.setState({
          typing: true
        });
      }
    });
    this.socket.on('stoppedTyping', data => {
      if (this.state.sender === data.receiver) {
        this.setState({
          typing: false
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
    const { receiver, message, log, typing } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.marioChat}>
        <div className={classes.chatWindow} onScroll={this.scrollHandler}>
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
                <span>{`${new Date(
                  parseInt(record.time)
                ).toLocaleString()} `}</span>
                <strong className={classes.outputString}>
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
