import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { saveUserPhoto, setAvatar } from "./../../../api/api.js";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  upload: {
    marginTop: "15px"
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
    minWidth: "614px",
    maxWidth: "614px",
    margin: "15px",
    border: "1px solid rgba(0, 0, 0, 0.54)"
  },
  photo: {
    maxWidth: "100%",
    maxHeight: "100%"
  },
  photoActions: {
    margin: "15px",
    display: "flex",
    justifyContent: "space-around"
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
        <input
          className={gallery.length < 5 ? classes.upload : classes.hidden}
          id="file-upload"
          accept=".jpg, .jpeg, .png"
          type="file"
          onChange={this.uploadPhoto}
        />
        <ul className={classes.photoList}>
          {gallery.map((photo, index) => (
            <li className={classes.photoContainer} key={index}>
              <img
                className={classes.photo}
                alt=""
                src={`users/photos/${photo}`}
              />
              <div className={classes.photoActions}>
                {avatarid === index ? (
                  "Avatar"
                ) : (
                  <button onClick={this.makeAvatar.bind(this, index)}>
                    Put on avatar
                  </button>
                )}
                <button onClick={this.upload.bind(this, index)}>
                  Replace a photo
                </button>
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
