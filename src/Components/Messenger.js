import React, { Component } from 'react';
import Message from './Message';
import Composer from './Composer';
import HttpHelper from '../HttpHelper';
import './Messenger.css';

class Messenger extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: []
    };
    this.updateMessages = this.updateMessages.bind(this);
  }

  updateMessages (data) {
    this.setState({messages: data});
  }

  componentWillUnmount() {
    this.evtSource.close();
  }

  componentDidMount() {
    //When component mounts, register an server sent event listener with the server.
    this.evtSource = new EventSource('/api/stream');
    let updateMessages = this.updateMessages;
    this.evtSource.onmessage = function(event) {
      updateMessages(JSON.parse(event.data));
    }

    //Attempt to register selected color with the server
    let myColor = this.props.myColor;
    let request = HttpHelper.post('/api/registerColor/');
    request.send(JSON.stringify({color: myColor}));
    let setColor = this.props.setColor;
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 400){
        alert('Color already taken');
        setColor(null);
      }
    };
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
          <Composer color={this.props.myColor}/>
        </div>
      </div>
    );
  }
}

export default Messenger;
