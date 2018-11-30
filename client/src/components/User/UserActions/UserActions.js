import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LikeButton from './LikeButton/LikeButton.js';
import BlockButton from './BlockButton/BlockButton.js';
import { reportFake } from './../../../api/api.js';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8px',
    paddingBottom: '8px'
  }
});

class UserActions extends React.Component {
  componentDidMount = () =>
    this.setState({
      canLike: this.props.canLike,
      fame: this.props.fame,
      fake: this.props.fake
    });

  changeFame = step =>
    this.setState({
      fame: this.state.fame + step
    });

  reportFake = () =>
    reportFake(this.props.login).then(() =>
      this.setState({
        fake: true
      })
    );

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes, login, online, time } = this.props;

    return (
      <div className={classes.root}>
        {this.state.canLike && (
          <LikeButton login={login} changeFame={this.changeFame} />
        )}
        <div>
          <span>Fame: </span>
          <span>{this.state.fame}</span>
        </div>
        {online ? (
          <div>Online</div>
        ) : (
          <div>
            <span>Last login time: </span>
            <span>{new Date(parseInt(time)).toLocaleString()}</span>
          </div>
        )}
        {this.state.fake ? (
          <div>Fake</div>
        ) : (
          <Button onClick={this.reportFake}>Report Fake</Button>
        )}
        <BlockButton login={login} />
      </div>
    );
  };
}

UserActions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserActions);
