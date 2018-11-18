import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  gridListTileBarExpanded: {
		height: '100%',
		alignItems: 'baseline'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
});

class UserDetails extends React.Component {
  componentDidMount() {
    this.setState(this.props.details);
    this.setState({
      gridListTileBarClass: ''
		});
  }

  showDetails = () => {
    this.state.gridListTileBarClass === ''
      ? this.setState({
          gridListTileBarClass: this.props.classes.gridListTileBarExpanded
        })
      : this.setState({
          gridListTileBarClass: ''
        });
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
		}	
    return (
      <GridListTileBar
        className={this.state.gridListTileBarClass}
        title={`${this.state.firstname} ${this.state.lastname}`}
        subtitle={<span>{this.state.bio}</span>}
        actionIcon={
          <IconButton
            onClick={this.showDetails}
            className={this.props.classes.icon}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    );
  };
}

UserDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserDetails);
