import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/StarBorder';
import DisplikeIcon from '@material-ui/icons/Star';
import { getLikeStatus } from './../../api/api.js';

export default class LikeButton extends React.Component {
  componentDidMount = () => {
    getLikeStatus(this.props.login)
      .then(response => response.json())
      .then(data =>
        this.setState({
          like: data.canLike
        })
      );
  };

  render = () => {
    if (!this.state) {
      return <div />;
    }
    return (
      <IconButton>
        {this.state.like ? <LikeIcon /> : <DisplikeIcon />}
      </IconButton>
    );
  };
}
