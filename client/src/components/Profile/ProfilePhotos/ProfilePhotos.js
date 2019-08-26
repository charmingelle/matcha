import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import EditIcon from '@material-ui/icons/Edit';
import { saveUserPhoto, setAvatar } from '../../../api/api';
import { withContext } from '../../../utils/utils';
import { styles } from './ProfilePhotos.styles';

class ProfilePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.photoid = null;
    this.state = {
      gallery: this.props.gallery,
      avatarid: this.props.avatarid,
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
      saveUserPhoto(canvas.toDataURL(), this.photoid).then(data => {
        newGallery[this.photoid] = data.fileName;
        this.setState({ gallery: newGallery });
        this.photoid = null;
        this.props.context.updateCanRenderLikeButton(true);
      });
    };
    image.src = window.URL.createObjectURL(event.target.files[0]);
  };

  render = () => {
    const { classes } = this.props;
    const { gallery, avatarid } = this.state;

    return (
      <div className={classes.root}>
        <Button
          className={
            gallery.length < 5 ? classes.customFileUpload : classes.hidden
          }
          variant="contained"
          color="primary"
        >
          <label htmlFor="file-upload">UPLOAD NEW PHOTO</label>
          <CloudUploadIcon className={classes.rightIcon} />
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
            <Card className={classes.card} key={index}>
              <CardContent className={classes.content}>
                <img
                  className={classes.img}
                  src={`/${photo}`}
                  alt={`${photo}`}
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="default"
                  onClick={this.upload.bind(this, index)}
                >
                  Replace
                  <EditIcon className={classes.rightIcon} color="primary" />
                </Button>
                {avatarid === index ? (
                  <span className={classes.avatarNote}>AVATAR</span>
                ) : (
                  <Button
                    size="small"
                    color="default"
                    onClick={this.makeAvatar.bind(this, index)}
                  >
                    Put on avatar
                    <PhotoCameraIcon
                      className={classes.rightIcon}
                      color="primary"
                    />
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </ul>
      </div>
    );
  };
}

ProfilePhotos.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(ProfilePhotos));
