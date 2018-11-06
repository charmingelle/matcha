import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  icon: {
    color: 'white'
  },
  avatar: {
    color: 'yellow'
  },
  hidden: {
    display: 'none'
  }
});

class ProfilePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.id = null;
    this.state = this.props;
  }

  upload = id => {
    const uploadEl = document.getElementById('file-upload');

    this.id = id;
    uploadEl.click();
  };

  makeAvatar = id => {
    this.setState({ avatarID: id });
    this.props.onChange({ avatarID: this.state.avatarID });
  };

  uploadPhoto = event => {
    let newGallery = JSON.parse(JSON.stringify(this.state.gallery));
    const image = new Image();

    image.onload = () => {
      newGallery[this.id] = image.src;
      this.setState({ gallery: newGallery });
      this.props.onChange({ gallery: this.state.gallery });
    };
    image.src = window.URL.createObjectURL(event.target.files[0]);
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <input
          id="file-upload"
          accept=".jpg, .jpeg, .png"
          type="file"
          onChange={this.uploadPhoto}
          className={classes.hidden}
        />
        <GridList cellHeight={200} spacing={1} className={classes.gridList}>
          {this.state.gallery.map((photo, id) => (
            <GridListTile key={id} cols={2} rows={2}>
              <img src={photo} alt="" onClick={this.upload.bind(this, id)} />
              <GridListTileBar
                titlePosition="top"
                actionIcon={
                  <IconButton
                    className={
                      this.state.avatarID === id ? classes.avatar : classes.icon
                    }
                    onClick={this.makeAvatar.bind(this, id)}
                  >
                    <StarBorderIcon />
                  </IconButton>
                }
                actionPosition="left"
                className={classes.titleBar}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  };
}

ProfilePhotos.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfilePhotos);
