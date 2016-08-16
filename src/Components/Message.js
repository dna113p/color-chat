import React, { Component } from 'react';
import './Message.css';

class Message extends Component {

  render() {
    let border = '5px solid' + this.props.color;

    //Style messages based on whether or not they belong to us
    let style = {
      alignSelf: this.props.myColor ? 'flex-end' : 'flex-start',
      flexDirection: this.props.myColor ? 'row-reverse' : 'row',
      borderLeft: this.props.myColor ? 'none' :  border,
      borderRight: this.props.myColor ? border : 'none'
    }

    let time = new Date(this.props.timestamp);
    return (
      <div className="Message" style={style}>
        <p>
          {this.props.text}
        </p>
        <span className="timestamp">
          {time.getHours() + ':' + time.getMinutes() + ":" + time.getSeconds() }
        </span>
      </div>
    );
  }
}

export default Message;
