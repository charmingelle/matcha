import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { styles } from './SortingPanel.styles';

class SortingPanel extends React.Component {
  state = {
    age: false,
    distance: true,
    fame: false,
    amountOfCommonInterests: false,
    selected: 'distance',
  };

  getOrder = orderName => (this.state[orderName] ? 1 : -1);

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
          { [classes.expandOpen]: this.state[param] },
          { [classes.selected]: selected === param },
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
    const { classes, moved } = this.props;

    return (
      <div className={moved ? classes.root : classes.moved}>
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SortingPanel);
