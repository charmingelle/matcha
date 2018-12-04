import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getMessages } from './../../../api/api.js';

const styles = theme => ({
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
      isLoading: false,
      lastloadedid: null,
      moreData: true
    };
    this.socket = this.props.socket;
  }

  componentDidMount = () => {
    getMessages(this.state.sender, this.state.receiver, this.state.lastloadedid)
      .then(response => response.json())
      .then(log => {
        if (log.length !== 0) {
          this.setState({ lastloadedid: log[log.length - 1].id });
        }
        this.setState({ log });
      })
      .then(() => {
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
      });
  };

  componentWillUnmount = () => {
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

  render = () => {
    const { receiver, log, typing } = this.state;
    const { classes } = this.props;

    return (
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
              <strong className={classes.outputString}>{record.sender}:</strong>
              {record.message}
            </p>
          ))}
        </div>
      </div>
    );
  };
}

Room.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Room);
