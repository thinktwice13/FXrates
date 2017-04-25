import React, { Component } from 'react';

class FileUpload extends Component {
  handleFile (e) {
  //check if file is .json
  //TODO: validate json data format
  if (e.target.value.endsWith(".json")) {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onload = upload =>  {
      let result = JSON.parse(upload.target.result);
      this.props.onFileUpload(result);
    }
    reader.readAsText(file);
  } else this.props.onFileUpload(null);
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
