import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import tileData from './tileData';

import image1 from './1.jpg';
import image2 from './2.jpg';
import image3 from './3.jpg';
import image4 from './4.jpeg';
import image5 from './5.jpg';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  subheader: {
    width: '100%',
  },
});

const tileData = [
  {
    img: image1,
    title: 'Image',
    author: 'author',
    cols: 1,
  },
  {
    img: image2,
    title: 'Image',
    author: 'author',
    cols: 2,
  },
  {
    img: image3,
    title: 'Image',
    author: 'author',
    cols: 2,
  },
  {
    img: image4,
    title: 'Image',
    author: 'author',
    cols: 2,
  },
  {
    img: image5,
    title: 'Image',
    author: 'author',
    cols: 2,
  },
];

function ImageGridList(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={3}>
        {tileData.map(tile => (
          <GridListTile key={tile.img} cols={tile.cols || 1}>
            <img src={tile.img} alt={tile.title} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

ImageGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageGridList);
