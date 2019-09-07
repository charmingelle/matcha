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
    senderName: '',
  };

  componentDidMount = () => {
    this.props.context.socket.on('chat', () => {
      this.setState({
        typing: '',
        senderName: '',
      });
    });
    this.props.context.socket.on('typing', ({ sender, senderName }) => {
      if (this.props.receiver === sender) {
        this.setState({
          typing: sender,
          senderName,
        });
      }
    });
    this.props.context.socket.on('stoppedTyping', ({ sender }) => {
      if (this.props.receiver === sender) {
        this.setState({
          typing: '',
          senderName: '',
        });
      }
    });
  };

  changeHandler = event => {
    this.props.context.socket.emit('typing', {
      sender: this.props.context.profile.login,
      senderName: `${this.props.context.profile.firstname} ${this.props.context.profile.lastname}`,
      receiver: this.props.receiver,
    });
    if (event.target.value === '') {
      this.props.context.socket.emit('stoppedTyping', {
        sender: this.props.context.profile.login,
        senderName: `${this.props.context.profile.firstname} ${this.props.context.profile.lastname}`,
        receiver: this.props.receiver,
      });
    }
    this.setState({
      message: event.target.value,
    });
  };

  keyPressHandler = event => event.key === 'Enter' && this.send();

  send = () => {
    if (this.state.message !== '') {
      this.props.context.socket.emit('chat', {
        sender: this.props.context.profile.login,
        senderName: `${this.props.context.profile.firstname} ${this.props.context.profile.lastname}`,
        receiver: this.props.receiver,
        message: this.state.message,
      });
      this.setState({
        message: '',
      });
    }
  };

  renderTyping = (classes, typing) =>
    typing && typing === this.props.receiver ? (
      <p className={classes.typing}>
        <em>{this.state.senderName} is typing a message...</em>
      </p>
    ) : null;

  renderMessage = ({ sender, message, time }, index) => {
    const {
      classes,
      context: {
        profile: { login },
      },
    } = this.props;

    return (
      <div
        className={sender === login ? classes.outputMine : classes.outputOther}
        key={index}
      >
        <p className={classes.messageText}>{message}</p>
        <span className={classes.messageTime}>
          {new Date(parseInt(time)).toLocaleString()}
        </span>
      </div>
    );
  };

  renderChatWindow = (classes, log, typing) => (
    <div className={classes.chatWindow}>
      {this.renderTyping(classes, typing)}
      <div className={classes.outputs}>{log.map(this.renderMessage)}</div>
    </div>
  );

  renderInput = (classes, message) => (
    <Input
      type="text"
      className={classes.message}
      value={message}
      placeholder="Say something..."
      onChange={this.changeHandler}
      onKeyPress={this.keyPressHandler}
      disableUnderline={true}
    />
  );

  renderSendButton = classes => (
    <Button
      className={classes.send}
      onClick={this.send}
      variant="contained"
      color="primary"
    >
      Send
    </Button>
  );

  render = () => {
    const { message, typing } = this.state;
    const { classes, log } = this.props;

    return (
      <div className={classes.chat}>
        {this.renderChatWindow(classes, log, typing)}
        {this.renderInput(classes, message)}
        {this.renderSendButton(classes)}
      </div>
    );
  };
}

Room.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Room));
