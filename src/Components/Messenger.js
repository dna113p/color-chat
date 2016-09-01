import React, { Component } from 'react';
import io from 'socket.io-client';

import Message from './Message';
import Composer from './Composer';
import './Messenger.css';

class Messenger extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };

  }

  componentWillMount() {
    this.socket = io();

    this.socket.on('connect', () => {
      this.socket.emit('request color', this.props.myColor);
    });

    this.socket.on('new message', (data) => {
      let newMessages = this.state.messages.slice();
      newMessages.push(data);
      this.setState( {messages: newMessages });
    });

    this.socket.on('socket in use', () => {
      this.props.setColor(null);
    });

  }

  componentWillUnmount() {
  }


  render() {

    let data = this.state.messages.map((msg, i) => {
      return (
        <Message myColor={msg.color === this.props.myColor} text={msg.text} color={msg.color} timestamp={msg.timestamp} key={i}/>
      )
    }).reverse();

    return (
      <div>
        <div className="container">
          <div className="messages">
            {data}
          </div>
        </div>
        <div className="text-area">
          <Composer socket={this.socket} color={this.props.myColor}/>
        </div>
      </div>
    );
  }
}

export default Messenger;
