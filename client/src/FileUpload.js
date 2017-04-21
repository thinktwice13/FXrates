import React, { Component } from 'react';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { file: null }

    this.handleFile = this.handleFile.bind(this);
  }
  //   //TODO: handle file upload

  handleFile (e) {
    let self = this;
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onload = (upload) =>  {
      let result = JSON.parse(upload.target.result);
      self.setState({ file: JSON.parse(upload.target.result) });
      this.props.onFileSubmit(this.state.file);
    }
    reader.readAsText(file);
  }

  render() {
    return (
      <form
        encType="multipart/form-data">
        <input
          type="file"
          accept=".json"
          id="fileinput"
          onChange={this.handleFile} />
      </form>
    )
  }
}

export default FileUpload;
