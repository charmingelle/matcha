import React from 'react';
import { getChatLogins } from './../../api/api.js';

export default class Chat extends React.Component {
  componentDidMount = () => {
    console.log('componentDidMount is called');
    getChatLogins()
      .then(response => response.json())
      .then(data => console.log(data));
  };

  render = () => {
    return <div>Chat</div>;
  };
}
