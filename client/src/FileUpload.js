import React, { Component } from 'react';

class FileUpload extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { file: null }
  //
  //   this.handleFile = this.handleFile.bind(this);
  // }

  handleFile (e) {
  //check if file is .json
  //TODO: validate json data format
  if (e.target.value.endsWith(".json")) {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onload = upload =>  {
      this.props.onFileUpload(JSON.parse(upload.target.result));
    }
    reader.readAsText(file);
  }
  else this.props.onFileUpload(null);
}

  render() {
    return (
      <form
        encType="multipart/form-data">
        <input
          type="file"
          accept=".json"
          id="fileinput"
          onChange={this.handleFile.bind(this)} />
      </form>
    )
  }
}

export default FileUpload;
