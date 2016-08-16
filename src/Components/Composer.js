import React, { Component } from 'react';
import HttpHelper from '../HttpHelper';
import './Composer.css';

class Composer extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit (e) {
    //When entering a message. Send it to the server and clear value the input
    e.preventDefault();

    let message = {
      text: e.target.text.value,
      color: this.props.color
    }

    var request = HttpHelper.post('api/message');
    request.send(JSON.stringify({message}));

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
