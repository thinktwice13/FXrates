import React, { Component } from 'react';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: null
    }
  }

  handleFile (e) {
    console.log("Reading file.");
    //if cancelled
    if (!e.target.value) return;

    const filename = e.target.value;
    const label = filename.substr(filename.lastIndexOf("\\")+1);

    //if file not.json
    if (!filename.endsWith(".json")) {
      this.props.onFileUpload({ msg: "Invalid file format"});
      this.setState({ label });
    }
    //if .json
    else {
      const reader = new FileReader();
      const file = e.target.files[0];
      reader.onload = upload =>  {
        let result = JSON.parse(upload.target.result);
        //detect bad format and filter bad entries
        result = Array.isArray(result) && result.filter(el => {
          return typeof el.currency === "string" && typeof el.amount === "number";
        });
        //send err msg if filter fails
        this.props.onFileUpload(result || { msg: "Invalid file contents" });
        this.setState({ label });
      }
      reader.readAsText(file);
    }
  }

  //FIXME: upload btn click area
  render() {
    return (
      <ul className="hlist">
        <input
            id="fileinput"
            type="file"
            accept=".json"
            className="fileinput"
            onChange={this.handleFile.bind(this)} />
        <li
          className={this.state.label && " selected"}>
          <label
            htmlFor="fileinput">
            <p>{this.state.label || "Choose a file..."}</p>
          </label>
        </li>
      </ul>
    )
  }
}

export default FileUpload;
