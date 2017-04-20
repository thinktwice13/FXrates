import React, { Component } from 'react';
import axios from "axios";


class Table extends Component {
  render() {
    return (
      <div>Table here</div>
    )
  }
}

class FileUpload extends Component {
  render() {
    return (
      <form>
        <input
          type="file" />
        <button
          type="submit">
          Submit
        </button>
      </form>
    )
  }
}

class Switcher extends Component {
  currChange(e) {
    e.preventDefault();
    this.props.onCurrChange(e.target.value);
  }

  render() {
    return (
      <select
        onChange={this.currChange.bind(this)}>
        {this.props.options.map(curr => {
          return <option key={curr} value={curr}>{curr}</option>
        })}
      </select>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      base: this.props.currencies[0]
    }

    this.handleCurrChange = this.handleCurrChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount() {
    //TODO: get exchange rates data
  }

  handleCurrChange(curr) {
    this.setState({ base: curr });
    //TODO: recalculate exchange rates data
  }

  //TODO: handle file upload
  handleFileUpload() {
    
  }

  render() {
    return (
      <div className="app">
        <div className="selector">
          <FileUpload
            onChange={this.handleFileUpload}>
          </FileUpload>
          <Switcher
            onCurrChange={this.handleCurrChange}
            options={this.props.currencies} >
          </Switcher>
        </div>
        <div>
          <Table
            rates="TODO">

          </Table>
        </div>
      </div>
    );
  }
}

export default App;
