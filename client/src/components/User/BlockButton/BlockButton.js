import React from 'react';
import { withContext } from '../../../utils/utils';

class BlockButton extends React.Component {
  api = this.props.context.api;

  componentDidMount = () =>
    this.api
      .getBlockStatus(this.props.login)
      .then(canBlock => this.setState({ canBlock }));

  changeBlockStatus = () =>
    this.api.changeBlockStatus(this.props.login, this.state.canBlock).then(() =>
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

export default withContext(BlockButton);
