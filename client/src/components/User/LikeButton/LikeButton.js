import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { getLikeStatus, changeLikeStatus } from './../../../api/api.js';
import { withContext } from '../../../utils/utils';
import { styles } from './LikeButton.styles';

class LikeButton extends React.Component {
  componentDidMount = () =>
    getLikeStatus(this.props.login)
      .then(response => response.json())
      .then(data =>
        this.setState({
          canLike: data.canLike,
        }),
      );

  changeLikeStatus = () =>
    changeLikeStatus(this.props.login, this.state.canLike)
      .then(response => response.json())
      .then(data => {
        if (this.state.canLike) {
          this.props.context.socket.emit('like', {
            sender: this.props.context.profile.login,
            receiver: this.props.login,
          });
        } else {
          this.props.context.socket.emit('unlike', {
            sender: this.props.context.profile.login,
            receiver: this.props.login,
          });
        }
        this.props.changeFame(data.step);
        this.props.context.set('chatData', data.chatData);
        this.setState({
          canLike: !this.state.canLike,
        });
      });

  render = () => {
    if (!this.state) {
      return <div />;
    }
    const { classes } = this.props;

    return (
      <IconButton aria-label="Like" onClick={this.changeLikeStatus}>
        <FavoriteIcon
          className={this.state.canLike ? classes.unset : classes.red}
        />
      </IconButton>
    );
  };
}

LikeButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(LikeButton));
