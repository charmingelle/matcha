import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    margin: '40px',
    border: '1px solid rgba(0, 0, 0, 0.54)'
  },
  info: {
    display: 'flex',
    padding: '15px'
  },
  name: {
    marginRight: '10px'
  },
  timeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  online: {
    width: '5px',
    height: '5px',
    borderRadius: '100%',
    backgroundColor: 'green'
  },
  photoContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  left: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate(0, -50%)'
  },
  right: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translate(0, -50%)'
  },
  photo: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  goodActions: {
    display: 'flex',
    padding: '15px'
  },
  badActions: {
    padding: '15px'
  },
  fakeButton: {
    marginRight: '5px'
  },
  likeButton: {
    margin: '5px'
  },
  fame: {
    margin: '5px'
  },
  showMore: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '15px'
  },
  details: {
    margin: '15px'
  },
  bold: {
    fontWeight: 'bold'
  }
});

class TempUser extends React.Component {
  componentDidMount = () => {
    this.setState(this.props.user);
    this.setState({
      currentPhoto: 0,
      full: this.props.full
    });

    let newGallery = this.props.user.gallery.filter(photo => photo !== '');
    let temp = newGallery[0];

    newGallery[0] = newGallery[this.props.user.avatarid];
    newGallery[this.props.user.avatarid] = temp;
    this.setState({
      gallery: newGallery
    });
  };

  showPreviousPhoto = () => {
    this.setState({
      currentPhoto: this.state.currentPhoto - 1
    });
  };

  showNextPhoto = () => {
    this.setState({
      currentPhoto: this.state.currentPhoto + 1
    });
  };

  toggleFull = () => {
    this.setState({
      full: !this.state.full
    });
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;
    const {
      firstname,
      lastname,
      online,
      time,
      currentPhoto,
      gallery,
      fame,
      full,
      age,
      gender,
      preferences,
      bio,
      interests
    } = this.state;

    console.log('interests', interests);

    return (
      <div className={classes.container}>
        <div className={classes.info}>
          <div className={classes.name}>
            {firstname} {lastname}
          </div>
          <div className={classes.timeContainer}>
            {online ? (
              <div className={classes.online} />
            ) : (
              <div>
                Last seen on {new Date(parseInt(time)).toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className={classes.photoContainer}>
          {currentPhoto > 0 && (
            <button className={classes.left} onClick={this.showPreviousPhoto}>
              Left
            </button>
          )}
          {
            <img
              className={classes.photo}
              alt="face"
              src={`users/photos/${gallery[currentPhoto]}`}
            />
          }
          {currentPhoto < gallery.length - 1 && (
            <button className={classes.right} onClick={this.showNextPhoto}>
              Right
            </button>
          )}
        </div>
        <div className={classes.actions}>
          <div className={classes.goodActions}>
            <button className={classes.likeButton}>Like</button>
            <div className={classes.fame}>{fame > 0 && fame}</div>
          </div>
          <div className={classes.badActions}>
            <button className={classes.fakeButton}>Report Fake</button>
            <button>Block</button>
          </div>
        </div>
        <div className={classes.showMore}>
          <button onClick={this.toggleFull}>
            {full ? 'Show less' : 'Show more'}
          </button>
        </div>
        {full && (
          <div className={classes.details}>
            <div>
              <span className={classes.bold}>Age: </span>
              {age}
            </div>
            <div>
              <span className={classes.bold}>Gender: </span>
              {gender}
            </div>
            <div>
              <span className={classes.bold}>Sexual preferences: </span>
              {preferences}
            </div>
            {bio && (
              <div>
                <span className={classes.bold}>Biography: </span>
                {bio}
              </div>
            )}
            {interests.length > 0 && (
              <div>
                <span className={classes.bold}>Interests: </span>
                {interests.join(', ')}
              </div>
            )}
            <div />
          </div>
        )}
      </div>
    );
  };
}

TempUser.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TempUser);
