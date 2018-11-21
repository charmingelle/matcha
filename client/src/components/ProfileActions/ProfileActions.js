import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LikeButton from './../LikeButton/LikeButton.js';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '8px',
    paddingBottom: '8px'
  }
});

class ProfileActions extends React.Component {
  componentDidMount = () => {
    console.log('this.props', this.props);

    this.setState({
      canLike: this.props.canLike
    });
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    return (
      <div className={this.props.classes.root}>
        {this.state.canLike && <LikeButton login={this.props.login} />}
        <div>this.props.fame</div>
        <div>this.props.lastLoginTime</div>
        <Button>Report Fake</Button>
        <Button>Block</Button>
      </div>
    );
  };
}

ProfileActions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileActions);
