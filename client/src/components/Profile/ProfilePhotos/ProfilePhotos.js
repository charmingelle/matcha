import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import { saveUserPhoto, setAvatar } from './../../../api/api.js';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  upload: {
    marginTop: '15px'
  },
  photoList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  photoContainer: {
    minWidth: '614px',
    maxWidth: '614px',
    margin: '15px',
    border: '1px solid rgba(0, 0, 0, 0.54)'
  },
  photo: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  photoActions: {
    margin: '15px',
    display: 'flex',
    justifyContent: 'space-around'
  }
});

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
    console.log('upload is called, id = ', id);
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
      if (!this.photoid) {
        this.photoid = newGallery.length;
      }
      newGallery[this.photoid] = canvas.toDataURL();
      saveUserPhoto(newGallery[this.photoid], this.photoid);
      this.setState({ gallery: newGallery });
      this.photoid = null;
    };
    image.src = window.URL.createObjectURL(event.target.files[0]);
  };

  render = () => {
    const { classes } = this.props;
    const { gallery, avatarid } = this.state;

    return (
      <div className={classes.root}>
        {gallery.length < 5 && (
          <input
            className={classes.upload}
            id="file-upload"
            accept=".jpg, .jpeg, .png"
            type="file"
            onChange={this.uploadPhoto}
          />
        )}
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
                  'Avatar'
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

// import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import IconButton from '@material-ui/core/IconButton';
// import CheckIcon from '@material-ui/icons/Check';
// import { saveUserPhoto, setAvatar } from './../../../api/api.js';

// const styles = theme => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     overflow: 'hidden',
//     backgroundColor: theme.palette.background.paper
//   },
//   gridList: {
//     width: '100%',
//     height: '450px',
//     // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
//     transform: 'translateZ(0)',
//     flexDirection: 'row',
//     flexWrap: 'unset'
//   },
//   gridListTile: {
//     padding: '0 !important',
//     width: 'auto !important'
//   },
//   gridListTileEmpty: {
//     width: '450px !important'
//   },
//   photo: {
//     width: 'auto',
//     height: '100%'
//   },
//   titleBar: {
//     background:
//       'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
//       'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
//   },
//   icon: {
//     color: 'white'
//   },
//   avatar: {
//     color: '#00f700'
//   },
//   hidden: {
//     display: 'none'
//   }
// });

// class ProfilePhotos extends React.Component {
//   constructor(props) {
//     super(props);
//     this.photoid = null;
//     this.state = {
//       userid: this.props.userid,
//       gallery: this.props.gallery,
//       avatarid: this.props.avatarid
//     };
//   }

//   upload = id => {
//     const uploadEl = document.getElementById('file-upload');

//     this.photoid = id;
//     uploadEl.click();
//   };

//   makeAvatar = (id, event) => {
//     event.stopPropagation();
//     this.setState({ avatarid: id });
//     setAvatar(id);
//   };

//   uploadPhoto = event => {
//     let newGallery = JSON.parse(JSON.stringify(this.state.gallery));
//     const image = new Image();
//     const canvas = document.createElement('canvas');

//     image.onload = () => {
//       canvas.width = image.width;
//       canvas.height = image.height;
//       canvas
//         .getContext('2d')
//         .drawImage(image, 0, 0, canvas.width, canvas.height);
//       newGallery[this.photoid] = canvas.toDataURL();
//       this.setState({ gallery: newGallery });
//       saveUserPhoto(newGallery[this.photoid], this.photoid);
//     };
//     image.src = window.URL.createObjectURL(event.target.files[0]);
//   };

//   render = () => {
//     const { classes, editable } = this.props;

//     return (
//       <div className={classes.root}>
//         <input
//           id="file-upload"
//           accept=".jpg, .jpeg, .png"
//           type="file"
//           onChange={this.uploadPhoto}
//           className={classes.hidden}
//         />
//         <GridList cellHeight="auto" spacing={1} className={classes.gridList}>
//           {this.state.gallery.map((photo, photoid) => (
//             <GridListTile
//               key={photoid}
//               cols={2}
//               rows={2}
//               onClick={this.upload.bind(this, photoid)}
//               className={
//                 photo === '' ? classes.gridListTileEmpty : classes.gridListTile
//               }
//             >
//               <img className={classes.photo} src={`users/photos/${photo}`} alt="" />
//               {editable && (
//                 <GridListTileBar
//                   titlePosition="top"
//                   actionIcon={
//                     <IconButton
//                       className={
//                         this.state.avatarid === photoid
//                           ? classes.avatar
//                           : classes.icon
//                       }
//                       onClick={this.makeAvatar.bind(this, photoid)}
//                     >
//                       <CheckIcon />
//                     </IconButton>
//                   }
//                   actionPosition="left"
//                   className={classes.titleBar}
//                 />
//               )}
//             </GridListTile>
//           ))}
//         </GridList>
//       </div>
//     );
//   };
// }

// ProfilePhotos.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles)(ProfilePhotos);
