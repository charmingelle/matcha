import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import EditIcon from "@material-ui/icons/Edit";
import { saveUserPhoto, setAvatar } from "./../../../api/api.js";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  upload: {
    marginTop: "15px",
    color: "rgba(0, 0, 0, 0.54)",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  rightIcon: {
    marginLeft: 10
  },
  hidden: {
    display: "none"
  },
  photoList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  photoContainer: {
    margin: "50px",
    width: "614px"
  },
  imgContainer: {
    position: "relative",
    top: "6px"
  },
  photo: {
    width: "100%"
  },
  photoActions: {
    display: "flex",
    flexDirection: "column"
  },
  avatarNote: {
    lineHeight: "38.8px",
    textAlign: "center",
    fontWeight: 500,
    color: "#3f51b5"
  },
  customFileUpload: {
    marginTop: "50px"
  },
  card: {
    margin: 50,
    width: 500
  },
  content: {
    height: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  img: {
    maxWidth: "100%",
    maxHeight: "100%"
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
    const uploadEl = document.getElementById("file-upload");

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
    const canvas = document.createElement("canvas");

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvas
        .getContext("2d")
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
                  src={require(`./../../../../public/users/photos/${photo}`)}
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
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfilePhotos);
