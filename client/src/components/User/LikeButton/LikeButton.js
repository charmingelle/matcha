import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './LikeButton.styles';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { withContext } from '../../../utils/utils';

class LikeButton extends React.Component {
  api = this.props.context.api;

  componentDidMount = () =>
    this.api
      .getLikeStatus(this.props.login)
      .then(canLike => this.setState({ canLike }));

  changeLikeStatus = async () => {
    const {
      context: {
        socket,
        profile: { login: sender, firstname, lastname },
      },
      login: receiver,
    } = this.props;
    const { canLike } = this.state;

    canLike
      ? socket.emit('like', {
          sender,
          senderName: `${firstname} ${lastname}`,
          receiver,
        })
      : socket.emit('unlike', {
          sender,
          senderName: `${firstname} ${lastname}`,
          receiver,
        });
    this.setState({ canLike: !canLike });
  };

  render = () =>
    this.state ? (
      <IconButton
        disabled={this.props.disabled}
        aria-label="Like"
        onClick={this.changeLikeStatus}
      >
        <FavoriteIcon
          className={
            this.state.canLike
              ? this.props.classes.unset
              : this.props.classes.red
          }
        />
      </IconButton>
    ) : null;
}

LikeButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(LikeButton));
