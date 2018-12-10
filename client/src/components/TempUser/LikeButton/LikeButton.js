import React from 'react';
import { getLikeStatus, changeLikeStatus } from './../../../api/api.js';

export default class LikeButton extends React.Component {
  componentDidMount = () =>
    getLikeStatus(this.props.login)
      .then(response => response.json())
      .then(data =>
        this.setState({
          canLike: data.canLike
        })
      );

  changeLikeStatus = () =>
    changeLikeStatus(this.props.login, this.state.canLike)
      .then(response => response.json())
      .then(data => {
        if (this.state.canLike) {
          this.props.socket.emit('like', {
            sender: this.props.sender,
            receiver: this.props.login
          });
        } else {
          this.props.socket.emit('unlike', {
            sender: this.props.sender,
            receiver: this.props.login
          });
        }
        this.props.changeFame(data.step);
        this.setState({
          canLike: !this.state.canLike
        });
      });

  render = () => {
    if (!this.state) {
      return <div />;
    }
    return (
      <button onClick={this.changeLikeStatus}>
        {this.state.canLike ? 'Like' : 'Displike'}
      </button>
    );
  };
}
