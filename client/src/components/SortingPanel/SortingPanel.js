import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 3,
    backgroundColor: '#ffffff',
    transform: 'translate(0px, 0px)',
    transition: 'transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms'
  },
  moved: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 3,
    backgroundColor: '#ffffff',
    transform: 'translate(0, -430px)',
    transition: 'transform 300ms cubic-bezier(0, 0, 0.2, 1) 0ms'
  },
  span: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  selected: {
    color: '#f50057'
  }
});

class SortingPanel extends React.Component {
  componentDidMount = () => {
    this.setState({
      age: false,
      distance: true,
      fame: false,
      amountOfCommonInterests: false,
      selected: 'distance'
    });
  };

  getOrder = orderName => {
    if (this.state[orderName] === false) {
      return -1;
    }
    return 1;
  };

  sortBy = param => {
    this.props.setSortParams(param, this.getOrder(param));
    this.setState({ [param]: !this.state[param], selected: param });
  };

  renderSortButton = param => {
    const { classes } = this.props;
    const { selected } = this.state;

    return (
      <IconButton
        className={classnames(
          classes.expand,
          {
            [classes.expandOpen]: this.state[param]
          },
          {
            [classes.selected]: selected === param
          }
        )}
        onClick={this.sortBy.bind(this, param)}
        aria-expanded={this.state[param]}
        aria-label="Sort"
      >
        <ExpandMoreIcon />
      </IconButton>
    );
  };

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes, moved } = this.props;

    return (
      <div className={moved ? classes.root: classes.moved}>
        <div>
          <span className={classes.span}>Sort by age</span>
          {this.renderSortButton('age')}
        </div>
        <div>
          <span className={classes.span}>distance</span>
          {this.renderSortButton('distance')}
        </div>
        <div>
          <span className={classes.span}>fame</span>
          {this.renderSortButton('fame')}
        </div>
        <div>
          <span className={classes.span}>common interests amount</span>
          {this.renderSortButton('amountOfCommonInterests')}
        </div>
      </div>
    );
  };
}

SortingPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SortingPanel);
