import React, { Component } from "react";


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

export default Switcher;
