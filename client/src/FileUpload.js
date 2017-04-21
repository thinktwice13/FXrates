import React, { Component } from 'react';

class FileUpload extends Component {
  handleChange(event) {
    //TODO: handle file upload
  }

  render() {
    return (
      <form>
        <input
          type="file"
          id="fileupload"
          onChange={this.handleChange.bind(this)} />
        <button
          type="submit">
          Submit
        </button>
      </form>
    )
  }
}

export default FileUpload;
