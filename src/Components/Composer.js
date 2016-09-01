import React, { Component } from 'react';
import './Composer.css';

class Composer extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit (e) {
    //When entering a message. Send it to the server and clear value the input
    e.preventDefault();
    this.props.socket.emit('new message', e.target.text.value);
    e.target.text.value = "";
  }

  render() {
    return (
      <form onSubmit={this.submit} className="composer-container">
        <input autoComplete="off" name="text" className="composer" autoFocus="true"></input>
      </form>
    );
  }
}

export default Composer;
