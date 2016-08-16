import React, { Component } from 'react';
import HttpHelper from '../HttpHelper';
import './EntryForm.css'
import colors from '../colors';

class EntryForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
      colors: colors
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
  }

  handleSelect(i) {
    return () => {
      this.setState({ selected: i });
    }
  }

  handleSubmit(event) {
    this.props.setColor(this.state.colors[this.state.selected]);
  }

  handleOnline(msg) {
    let data = JSON.parse(msg).data;
    let arr = JSON.parse(data);
    let newColors = this.state.colors.filter((val) => {
      for (var i=0; i < arr.length; i++){
        if(arr[i] === val)
          return false;
      }
      return true;
    });

    this.setState({
      colors: newColors,
      selected: 0
    });

  }

  componentDidMount() {
    HttpHelper.get('/api/getColors', this.handleOnline);
  }

  render() {

    return (

      <div className="entry-form">
        <div className="colors">
          {this.state.colors.map((color, i) => {
            let style = {
              border: '5px solid' + color,
              backgroundColor: this.state.selected === i ? color : 'rgba(0,0,0,0)'
            }
            return (
              <div onClick={this.handleSelect(i)} className="color" style={style} key={i}>
              </div>
            )
          })
          }
        </div>
        <button onClick={this.handleSubmit} className="button"
                style={{backgroundColor: this.state.colors[this.state.selected]}} >Enter Chat!</button>
      </div>

    );
  }
}

export default EntryForm;
