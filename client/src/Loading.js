import React, { Component } from "react";
import PropTypes from "prop-types";

class Loading extends Component {
  constructor(props) {
    super(props);

    this.state = { text: props.text }
  }

  componentDidMount() {

    //loading dots animation
    let stopper = this.props.text + "...";
    this.interval = window.setInterval(() => {
      if (this.state.text === stopper) {
        this.setState({ text: this.props.text });
      } else {
        this.setState(prevState =>  {
          return { text: prevState.text + "."}
        })
      }
    }, this.props.speed);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <p className="loader">
        {this.state.text}
      </p>
    )
  }
}

Loading.defaultProps = {
  text: "",
  speed: 200
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired
}

export default Loading;
