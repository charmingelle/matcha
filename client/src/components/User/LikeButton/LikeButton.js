import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { getLikeStatus } from '../../../api/api';
import { withContext } from '../../../utils/utils';
import { styles } from './LikeButton.styles';

class LikeButton extends React.Component {
  componentDidMount = () =>
    getLikeStatus(this.props.login).then(canLike => this.setState({ canLike }));

  changeLikeStatus = async () => {
    const {
      context: {
        socket,
        profile: { login: sender },
      },
      login: receiver,
    } = this.props;
    const { canLike } = this.state;

    canLike
      ? socket.emit('like', { sender, receiver })
      : socket.emit('unlike', { sender, receiver });
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
