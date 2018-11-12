import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { getUsers } from './../../api/usersRequests.js';
import UserDetails from './../UserDetails/UserDetails.js';
import SortingPanel from './../SortingPanel/SortingPanel.js';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: '50%'
  },
  gridListTile: {
    width: '100% !important',
    height: 'initial !important'
  }
});

class TitlebarGridList extends React.Component {
  async componentDidMount() {
    const data = await getUsers();

    this.setState({
      users: data
    });
  }

  render = () => {
    if (!this.state) {
      return <span>Loader is here</span>;
    }
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <SortingPanel interests={this.props.interests} />
        <GridList cellHeight={180} className={classes.gridList}>
          {this.state.users.map(user => (
            <GridListTile
              key={user.gallery[user.avatarid]}
              className={classes.gridListTile}
            >
              <img
                src={user.gallery[user.avatarid]}
                alt={`${user.firstname} ${user.lastname}`}
              />
              <UserDetails details={user} />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  };
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TitlebarGridList);
