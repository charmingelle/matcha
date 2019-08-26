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

  changeLikeStatus = () =>
    changeLikeStatus(this.props.login, this.state.canLike).then(
      ({ step, chatData }) => {
        this.state.canLike
          ? this.props.context.socket.emit('like', {
              sender: this.props.context.profile.login,
              receiver: this.props.login,
            })
          : this.props.context.socket.emit('unlike', {
              sender: this.props.context.profile.login,
              receiver: this.props.login,
            });
        this.props.changeFame(step);
        this.props.context.set('chatData', chatData);
        this.setState({
          canLike: !this.state.canLike,
        });
      },
    );

  render = () => {
    if (!this.state) {
      return null;
    }
    const { disabled, classes } = this.props;

    return (
      <IconButton
        disabled={disabled}
        aria-label="Like"
        onClick={this.changeLikeStatus}
      >
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
