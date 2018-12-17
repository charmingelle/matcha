import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { saveUserPhoto, setAvatar } from './../../../api/api.js';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  upload: {
    marginTop: '15px',
    color: 'rgba(0, 0, 0, 0.54)',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  hidden: {
    display: 'none'
  },
  photoList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  photoContainer: {
    margin: '50px',
    width: '614px'
  },
  imgContainer: {
    position: 'relative',
    top: '6px'
  },
  photo: {
    width: '100%'
  },
  photoActions: {
    display: 'flex',
    flexDirection: 'column'
  },
  // profileButtons: {
  //   marginTop: '1px'
  // },
  avatarNote: {
    lineHeight: '38.8px',
    textAlign: 'center',
    fontWeight: 500,
    color: '#f50057'
  },
  customFileUpload: {
    marginTop: '50px'
  }
};

class ProfilePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.photoid = null;
    this.state = {
      gallery: this.props.gallery,
      avatarid: this.props.avatarid
    };
  }

  upload = id => {
    const uploadEl = document.getElementById('file-upload');

    this.photoid = id;
    uploadEl.click();
  };

  makeAvatar = id => {
    this.setState({ avatarid: id });
    setAvatar(id);
  };

  uploadPhoto = event => {
    let newGallery = JSON.parse(JSON.stringify(this.state.gallery));
    const image = new Image();
    const canvas = document.createElement('canvas');

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvas
        .getContext('2d')
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      if (this.photoid === null) {
        this.photoid = newGallery.length;
      }
      saveUserPhoto(canvas.toDataURL(), this.photoid)
        .then(response => response.json())
        .then(data => {
          newGallery[this.photoid] = data.fileName;
          this.setState({ gallery: newGallery });
          this.photoid = null;
        });
    };
    image.src = window.URL.createObjectURL(event.target.files[0]);
  };

  render = () => {
    const { classes } = this.props;
    const { gallery, avatarid } = this.state;

    return (
      <div className={classes.root}>
        {/* <input
          className={gallery.length < 5 ? classes.upload : classes.hidden}
          id="file-upload"
          accept=".jpg, .jpeg, .png"
          type="file"
          onChange={this.uploadPhoto}
        /> */}
        <Button
          className={
            gallery.length < 5 ? classes.customFileUpload : classes.hidden
          }
          variant="contained"
          color="secondary"
        >
          <label htmlFor="file-upload">UPLOAD A PHOTO</label>
        </Button>
        <input
          className={classes.hidden}
          id="file-upload"
          accept=".jpg, .jpeg, .png"
          type="file"
          onChange={this.uploadPhoto}
        />
        <ul className={classes.photoList}>
          {gallery.map((photo, index) => (
            <li className={classes.photoContainer} key={index}>
              <div className={classes.imgContainer}>
                <img
                  className={classes.photo}
                  alt=""
                  src={`users/photos/${photo}`}
                />
              </div>
              <div className={classes.photoActions}>
                {avatarid === index ? (
                  <span className={classes.avatarNote}>AVATAR</span>
                ) : (
                  <Button
                    className={classes.profileButtons}
                    variant="outlined"
                    color="secondary"
                    onClick={this.makeAvatar.bind(this, index)}
                  >
                    On avatar
                  </Button>
                )}
                <Button
                  className={classes.profileButtons}
                  variant="contained"
                  color="secondary"
                  onClick={this.upload.bind(this, index)}
                >
                  Replace
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
}

ProfilePhotos.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfilePhotos);
