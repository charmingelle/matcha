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
import { withContext } from '../../../utils/utils';
import { styles } from './ProfilePhotos.styles';

class ProfilePhotos extends React.Component {
  api = this.props.context.api;

  photoid = null;

  upload = id => {
    const uploadEl = document.getElementById('file-upload');

    this.photoid = id;
    uploadEl.click();
  };

  makeAvatar = id =>
    this.api.setAvatar(id).then(avatarid =>
      this.props.context.set('profile', {
        ...this.props.context.profile,
        avatarid,
      }),
    );

  getImageOnloadHandler = (image, canvas) => async () => {
    const {
      context: {
        profile: { gallery },
      },
    } = this.props;

    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    if (this.photoid === null) {
      this.photoid = gallery.length;
    }
    const fileName = await this.api.savePhoto(canvas.toDataURL(), this.photoid);

    gallery[this.photoid] = fileName;
    this.props.context.set('profile', {
      ...this.props.context.profile,
      gallery,
    });
    this.photoid = null;
    this.props.context.updateCanRenderLikeButton(true);
  };

  uploadPhoto = ({ target }) => {
    const image = new Image();
    const canvas = document.createElement('canvas');

    image.onload = this.getImageOnloadHandler(image, canvas);
    image.src = window.URL.createObjectURL(target.files[0]);
  };

  renderUploadButton = () => {
    const {
      classes,
      context: {
        profile: { gallery },
      },
    } = this.props;

    return (
      <>
        <Button
          className={
            gallery.length < 5 ? classes.customFileUpload : classes.hidden
          }
          variant="contained"
          color="primary"
        >
          <label
            className={classes.customFileUploadLabel}
            htmlFor="file-upload"
          >
            UPLOAD NEW PHOTO
            <CloudUploadIcon className={classes.rightIcon} />
          </label>
        </Button>
        <input
          className={classes.hidden}
          id="file-upload"
          accept=".jpg, .jpeg, .png"
          type="file"
          onChange={this.uploadPhoto}
        />
      </>
    );
  };

  renderPhoto = (photo, index) => {
    const {
      classes,
      context: {
        profile: { avatarid },
      },
    } = this.props;

    return (
      <li key={index}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <img className={classes.img} src={`/${photo}`} alt={`${photo}`} />
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
      </li>
    );
  };

  renderPhotos = () => {
    const {
      classes,
      context: {
        profile: { gallery },
      },
    } = this.props;

    return (
      <ul className={classes.photoList}>{gallery.map(this.renderPhoto)}</ul>
    );
  };

  render = () => (
    <div className={this.props.classes.root}>
      {this.renderUploadButton()}
      {this.renderPhotos()}
    </div>
  );
}

ProfilePhotos.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(ProfilePhotos));
