import React, { Component } from 'react';

class FileUpload extends Component {
  handleFile (e) {
    console.log("Reading file.");
    //if cancelled
    if (!e.target.value) return;

    //if file not.json
    else if (!e.target.value.endsWith(".json")) {
      return this.props.onFileUpload({ msg: "Invalid file format"});
    }
    //if .json
    else {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onload = upload =>  {
        let result = JSON.parse(upload.target.result);
        //detect bad format and filter bad entries
        let filtered = Array.isArray(result) && result.filter(el => {
          return typeof el.currency === "string" && typeof el.amount === "number";
        });
        //send err msg if filter fails
        return this.props.onFileUpload(filtered || { msg: "Invalid file contents" });
      }
      reader.readAsText(file);
    }
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
