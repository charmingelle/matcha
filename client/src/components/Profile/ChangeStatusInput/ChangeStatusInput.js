import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { styles } from './ChangeStatusInput.styles';

const Inputs = props => {
  const { classes, error } = props;

  return (
    <div className={classes.container}>
      <Input
        className={classes.input}
        error={error}
        inputProps={{ 'aria-label': 'Save changes status' }}
        value={props.value}
      />
    </div>
  );
};

Inputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Inputs);
