import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/StarBorder';
import DisplikeIcon from '@material-ui/icons/Star';
import { getLikeStatus, changeLikeStatus } from './../../../../api/api.js';

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
      <IconButton onClick={this.changeLikeStatus}>
        {this.state.canLike ? <LikeIcon /> : <DisplikeIcon />}
      </IconButton>
    );
  };
}
