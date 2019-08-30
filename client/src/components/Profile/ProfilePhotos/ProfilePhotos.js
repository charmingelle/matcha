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
  photoid = null;
  state = {
    gallery: this.props.gallery,
    avatarid: this.props.avatarid,
  };

  upload = id => {
    const uploadEl = document.getElementById('file-upload');

    this.photoid = id;
    uploadEl.click();
  };

  makeAvatar = id => this.setState({ avatarid: id }, () => setAvatar(id));

  getImageOnloadHandler = (gallery, image, canvas) => async () => {
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    if (this.photoid === null) {
      this.photoid = gallery.length;
    }
    const { fileName } = await saveUserPhoto(canvas.toDataURL(), this.photoid);

    gallery[this.photoid] = fileName;
    this.setState({ gallery });
    this.photoid = null;
    this.props.context.updateCanRenderLikeButton(true);
  };

  uploadPhoto = ({ target }) => {
    let gallery = JSON.parse(JSON.stringify(this.state.gallery));
    const image = new Image();
    const canvas = document.createElement('canvas');

    image.onload = this.getImageOnloadHandler(gallery, image, canvas);
    image.src = window.URL.createObjectURL(target.files[0]);
  };

  renderUploadButton = () => {
    const { classes } = this.props;
    const { gallery } = this.state;

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
    const { classes } = this.props;
    const { avatarid } = this.state;

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
    const { classes } = this.props;
    const { gallery } = this.state;

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
