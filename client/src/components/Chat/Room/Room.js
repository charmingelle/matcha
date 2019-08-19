import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { styles } from './Room.styles';
import { withContext } from '../../../utils/utils';

class Room extends React.Component {
  state = {
    message: '',
    typing: '',
  };

  componentDidMount = () => {
    this.props.context.socket.on('chat', () => {
      this.setState({
        typing: '',
      });
    });
    this.props.context.socket.on('typing', data => {
      if (this.props.receiver === data.sender) {
        this.setState({
          typing: data.sender,
        });
      }
    });
    this.props.context.socket.on('stoppedTyping', data => {
      if (this.props.receiver === data.sender) {
        this.setState({
          typing: '',
        });
      }
    });
  };

  componentWillReceiveProps = () => {
    this.props.context.socket.emit('stoppedTyping', {
      sender: this.props.context.profile.login,
      receiver: this.props.receiver,
    });
    this.setState({
      message: '',
      typing: '',
    });
  };

  changeHandler = event => {
    this.props.context.socket.emit('typing', {
      sender: this.props.context.profile.login,
      receiver: this.props.receiver,
    });
    if (event.target.value === '') {
      this.props.context.socket.emit('stoppedTyping', {
        sender: this.props.context.profile.login,
        receiver: this.props.receiver,
      });
    }
    this.setState({
      message: event.target.value,
    });
  };

  keyPressHandler = event => {
    if (event.key === 'Enter') {
      this.send();
    }
  };

  send = () => {
    if (this.state.message !== '') {
      this.props.context.socket.emit('chat', {
        sender: this.props.context.profile.login,
        receiver: this.props.receiver,
        message: this.state.message,
      });
      this.setState({
        message: '',
      });
    }
  };

  render = () => {
    const { message, typing } = this.state;
    const { classes, log } = this.props;

    return (
      <div className={classes.chat}>
        <div className={classes.chatWindow}>
          {typing && (
            <p className={classes.typingP}>
              <em>{typing} is typing a message...</em>
            </p>
          )}
          <div className={classes.outputPs}>
            {log.map((record, index) => (
              <div
                className={
                  record.sender === this.props.context.profile.login
                    ? classes.outputPMine
                    : classes.outputPOther
                }
                key={index}
              >
                <p className={classes.messageText}>{record.message}</p>
                <span className={classes.messageTime}>{`${new Date(
                  parseInt(record.time),
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
          color="primary"
        >
          Send
        </Button>
      </div>
    );
  };
}

Room.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Room));
