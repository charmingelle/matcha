import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Room from './Room/Room';
import { styles } from './Chat.styles';
import { withContext } from '../../utils/utils';

class Chat extends React.Component {
  getAvatarSrc = (chatData, login) =>
    `/${chatData[login].gallery[chatData[login].avatarid]}`;

  renderRoomLink = (login, index) => {
    const {
      classes,
      receiver,
      context: { chatData },
    } = this.props;
    const avatar = this.getAvatarSrc(chatData, login);

    return (
      <Link className={classes.link} key={index} to={`/chat/${login}`}>
        <ListItem
          button
          className={login === receiver ? classes.selectedUser : classes.user}
        >
          <Avatar alt={login} src={avatar} />
          <ListItemText primary={login} />
          {chatData[login].online && <div className={classes.onlineDot} />}
        </ListItem>
        <Divider light />
      </Link>
    );
  };

  render = () => {
    const {
      classes,
      receiver,
      context: { chatData },
    } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav" className={classes.users}>
          {Object.keys(chatData).map(this.renderRoomLink)}
        </List>
        <Room
          receiver={receiver}
          log={chatData[receiver].log}
          updateMessage={this.updateMessage}
        />
      </div>
    );
  };
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Chat));
