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
	},
});

class ProfilePhotos extends React.Component {
	constructor() {
		super();
		this.id = null;
	}

  state = {
    tileData: [
      {
        img: 'https://i.ytimg.com/vi/3VWGMXR9dx0/maxresdefault.jpg',
        isAvatar: true,
        featured: true
      },
      {
        img:
          'http://creativeanchor.com/wp-content/uploads/2018/03/marvelous-female-portrait-photography-by-kai-bottcher.jpg',
        isAvatar: false,
        featured: true
      },
      {
        img:
          'https://i.pinimg.com/originals/39/e9/b3/39e9b39628e745a39f900dc14ee4d9a7.jpg',
        isAvatar: false,
        featured: true
      }
    ]
	};

	upload = (id) => {
		const uploadEl = document.getElementById('file-upload');

		this.id = id;
		uploadEl.click();
	}

  makeAvatar = (id) => {
		let newTileData = JSON.parse(JSON.stringify(this.state.tileData));
		
		newTileData.forEach((tile, index) => {
			id === index ? tile.isAvatar = true : tile.isAvatar = false;
		});
		this.setState({ tileData: newTileData });
  };

	uploadPhoto = (event) => {
		let newTileData = JSON.parse(JSON.stringify(this.state.tileData));		
		const image = new Image();

		image.onload = () => {
			newTileData[this.id].img = image.src;
			this.setState({ tileData: newTileData });
		};
		image.src = window.URL.createObjectURL(event.target.files[0]);
	}

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
				<input id="file-upload" accept=".jpg, .jpeg, .png" type="file" onChange={this.uploadPhoto} className={classes.hidden} />
        <GridList cellHeight={200} spacing={1} className={classes.gridList}>
          {this.state.tileData.map((tile, id) => (
            <GridListTile
              key={tile.img}
              cols={tile.featured ? 2 : 1}
							rows={tile.featured ? 2 : 1}
            >
              <img src={tile.img} alt={tile.title} onClick={this.upload.bind(this, id)} />
              <GridListTileBar
                titlePosition="top"
                actionIcon={
                  <IconButton
                    className={tile.isAvatar ? classes.avatar : classes.icon}
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
