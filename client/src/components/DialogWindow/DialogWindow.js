import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withContext } from '../../utils/utils';

class DialogWindow extends React.Component {
  api = this.props.context.api;

  handleClose = () => this.props.context.set(this.props.open, false);

  handleConfirm = () => {
    this.props.confirmCallback();
    this.handleClose();
  };

  render = () => (
    <Dialog
      open={this.props.context[this.props.open]}
      onClose={this.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {this.props.subtitle}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={this.handleConfirm} color="primary" autoFocus>
          {this.props.confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withContext(DialogWindow);
