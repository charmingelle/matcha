import React from 'react';
import { getBlockStatus, changeBlockStatus } from '../../../api/api';

export default class BlockButton extends React.Component {
  componentDidMount = () =>
    getBlockStatus(this.props.login).then(canBlock =>
      this.setState({ canBlock }),
    );

  changeBlockStatus = () =>
    changeBlockStatus(this.props.login, this.state.canBlock).then(() =>
      this.setState({
        canBlock: !this.state.canBlock,
      }),
    );

  render = () =>
    this.state ? (
      <div variant="outlined" onClick={this.changeBlockStatus}>
        {this.state.canBlock ? <span>Block</span> : <span>Unblock</span>}
      </div>
    ) : null;
}
