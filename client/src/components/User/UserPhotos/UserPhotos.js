import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: '100%',
    height: '450px',
    transform: 'translateZ(0)',
    flexDirection: 'row',
    flexWrap: 'unset'
  },
  gridListTile: {
    padding: '0 !important',
    width: 'auto !important'
  },
  gridListTileEmpty: {
    width: '450px !important'
  },
  photo: {
    width: 'auto',
    height: '100%'
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
    color: '#00f700'
  },
  hidden: {
    display: 'none'
  }
});

class UserPhotos extends React.Component {
  componentDidMount = () => {
    this.setState({
      gallery: this.props.gallery
    });
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <GridList cellHeight="auto" spacing={1} className={classes.gridList}>
          {this.state.gallery.map((photo, photoid) => (
            <GridListTile
              key={photoid}
              cols={2}
              rows={2}
              className={
                photo === '' ? classes.gridListTileEmpty : classes.gridListTile
              }
            >
              <img className={classes.photo} src={`photos/${photo}`} alt="" />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  };
}

UserPhotos.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserPhotos);
