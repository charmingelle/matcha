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
  render = () => {
    const {
      classes,
      receiver,
      context: { chatData },
    } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav" className={classes.users}>
          {Object.keys(chatData).map((login, index) => {
            const avatar =
              chatData[login].gallery.length > 0
                ? chatData[login].gallery[chatData[login].avatarid]
                : 'avatar.png';

            return (
              <Link className={classes.link} key={index} to={`/chat/${login}`}>
                <ListItem
                  button
                  className={
                    login === receiver ? classes.selectedUser : classes.user
                  }
                >
                  <Avatar alt={login} src={`/${avatar}`} />
                  <ListItemText primary={login} />
                  {chatData[login].online && (
                    <div className={classes.onlineDot} />
                  )}
                </ListItem>
                <Divider light />
              </Link>
            );
          })}
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
