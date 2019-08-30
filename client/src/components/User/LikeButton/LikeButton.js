import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { getLikeStatus, changeLikeStatus } from '../../../api/api';
import { withContext } from '../../../utils/utils';
import { styles } from './LikeButton.styles';

class LikeButton extends React.Component {
  componentDidMount = () =>
    getLikeStatus(this.props.login).then(({ canLike }) =>
      this.setState({ canLike }),
    );

  changeLikeStatus = async () => {
    const {
      context: {
        socket,
        profile: { login: sender },
        set,
      },
      login: receiver,
      changeFame,
    } = this.props;
    const { canLike } = this.state;
    const { step, chatData } = await changeLikeStatus(receiver, canLike);

    canLike
      ? socket.emit('like', { sender, receiver })
      : socket.emit('unlike', { sender, receiver });
    changeFame(step);
    set('chatData', chatData);
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
