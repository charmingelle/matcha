import React from 'react';
import { getBlockStatus, changeBlockStatus } from './../../../api/api.js';

export default class BlockButton extends React.Component {
  componentDidMount = () =>
    getBlockStatus(this.props.login)
      .then(response => response.json())
      .then(data =>
        this.setState({
          canBlock: data.canBlock
        })
      );

  changeBlockStatus = () =>
    changeBlockStatus(this.props.login, this.state.canBlock).then(() =>
      this.setState({
        canBlock: !this.state.canBlock
      })
    );

  render = () => {
    if (!this.state) {
      return <div />;
    }
    return (
      <div variant="outlined" onClick={this.changeBlockStatus}>
        {this.state.canBlock ? <span>Block</span> : <span>Unblock</span>}
      </div>
    );
  };
}
