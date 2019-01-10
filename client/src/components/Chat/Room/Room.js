import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  marioChat: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    width: "80%"
  },
  chatWindow: {
    flexGrow: 1,
    overflow: "auto",
    borderBottom: "1px solid #e9e9e9"
  },
  outputPs: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  outputPOther: {
    position: "relative",
    marginRight: "10%",
    marginTop: 5,
    width: "80%",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: "#ffffff",
    "&:last-child": {
      marginBottom: 5
    }
  },
  outputPMine: {
    position: "relative",
    marginLeft: "10%",
    marginTop: 5,
    width: "80%",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    borderRadius: 4,
    backgroundColor: "rgba(245, 0, 87, 0.1)",
    "&:last-child": {
      marginBottom: 5
    }
  },
  messageText: {
    margin: 0
  },
  messageTime: {
    textAlign: "end",
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.54)"
  },
  typingP: {
    width: "80%",
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#ffffff"
  },
  message: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#ffffff"
  },
  send: {
    padding: "18px 0",
    width: "100%",
    border: "none",
    outline: "1px solid #e9e9e9"
  }
});

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      typing: ""
    };
  }

  componentDidMount = () => {
    this.props.socket.on("chat", () => {
      this.setState({
        typing: ""
      });
    });
    this.props.socket.on("typing", data => {
      if (this.props.receiver === data.sender) {
        this.setState({
          typing: data.sender
        });
      }
    });
    this.props.socket.on("stoppedTyping", data => {
      if (this.props.receiver === data.sender) {
        this.setState({
          typing: ""
        });
      }
    });
  };

  componentWillUnmount = () => {
    this.props.socket.off("chat");
    this.props.socket.off("typing");
    this.props.socket.off("stoppedTyping");
  };

  componentWillReceiveProps = () => {
    this.props.socket.emit("stoppedTyping", {
      sender: this.props.sender,
      receiver: this.props.receiver
    });
    this.setState({
      message: "",
      typing: ""
    });
  };

  changeHandler = event => {
    this.props.socket.emit("typing", {
      sender: this.props.sender,
      receiver: this.props.receiver
    });
    if (event.target.value === "") {
      this.props.socket.emit("stoppedTyping", {
        sender: this.props.sender,
        receiver: this.props.receiver
      });
    }
    this.setState({
      message: event.target.value
    });
  };

  keyPressHandler = event => {
    if (event.key === "Enter") {
      this.send();
    }
  };

  send = () => {
    if (this.state.message !== "") {
      this.props.socket.emit("chat", {
        sender: this.props.sender,
        receiver: this.props.receiver,
        message: this.state.message
      });
      this.setState({
        message: ""
      });
    }
  };

  render = () => {
    const { message, typing } = this.state;
    const { classes, sender, log } = this.props;

    return (
      <div className={classes.marioChat}>
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
                  record.sender === sender
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
          color="primary"
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
