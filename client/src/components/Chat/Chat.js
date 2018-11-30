import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { getChatLogins } from './../../api/api.js';
import socketIOClient from 'socket.io-client';

const styles = theme => ({
  chatWindow: {
    width: '100%',
    height: '100%',
    border: '1px solid black'
  }
});

class Chat extends React.Component {
  constructor() {
    super();
    this.socket = socketIOClient('http://localhost:5000');
  }

  componentDidMount = () => {
    this.setState({
      log: ''
    });
    this.socket.on('chat', data =>
      this.setState({ log: `${this.state.log}<span>${data.author}</span>: <span>${data.message}</span>` })
    );
    // getChatLogins()
    //   .then(response => response.json())
    //   .then(data => console.log(data));
  };

  changeHandler = event =>
    this.setState({
      message: event.target.value
    });

  send = () => {
    if (this.state.message !== '') {
      this.socket.emit('chat', {
        author: this.props.author,
        message: this.state.message
      });
    }
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    return (
      <div>
        <div className={this.props.classes.chatWindow}>{this.state.log}</div>
        <TextField
          label="Say something"
          onChange={this.changeHandler}
          variant="outlined"
        />
        <Button onClick={this.send}>Send</Button>
      </div>
    );
  };
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
