import React, { Component } from 'react';
import EntryForm from './Components/EntryForm';
import Messenger from './Components/Messenger';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: null
    };

    this.setColor = this.setColor.bind(this);
  }

  setColor(color) {
    this.setState({color:color});
  }

  //Render the Messnger or a Form to sign in.
  render() {
    return (
      <div className="App">
      { this.state.color ? <Messenger setColor={this.setColor} myColor={this.state.color}/> :
                            <EntryForm setColor={this.setColor}/>}
      </div>
    );
  }
}

export default App;
