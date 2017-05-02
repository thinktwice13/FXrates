import React, { Component } from 'react';
import axios from "axios";
import PropTypes from "prop-types";

function FileUpload(props) {
  return (
    <div className="btn">
      <input
        id="fileinput"
        type="file"
        accept=".json"
        onChange={props.onFileUpload} />
      <li
        className={props.label && "active"} >
        <label
          htmlFor="fileinput">
          <p>{props.label || "Choose a file..."}</p>
        </label>
      </li>
    </div>
  )
}

FileUpload.defaultProps = { label: "Choose a file..." };
FileUpload.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  label: PropTypes.string

}

function DbSave(props) {
  return (
      <li
        className={props.disabled ? "disabled" : (props.label && "active")}
        id="save"
        onClick={props.label && props.onDbSave} >
        {props.label || "Save to DB"}
      </li>
  )
}

// DbSave.defaultProps = { label: "Save to DB" };
DbSave.propTypes =  {
  onDbSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  label: PropTypes.string
}

function DbLoad(props) {
  return (
      <li
        id="db"
        className={props.label && "active"}
        onClick={!props.label && props.onDbLoad}>
        {props.label || "Load from DB"}
      </li>
  )
}

// DbLoad.defaultProps = { label: "Load from DB" };
DbLoad.propTypes =  {
  onDbLoad: PropTypes.func.isRequired,
  label: PropTypes.string
}

function Switcher(props) {
  return (
    <ul className="hlist">
      {props.currencies.map(curr => {
        return (
          <li
            className={curr === props.selectedCurr ? "active" : null}
            key={curr}
            onClick={props.onCurrChange.bind(null, curr)} >
            {curr}
          </li>
        )
      })}
    </ul>
  )
}

Switcher.propTypes = {
  selectedCurr: PropTypes.string.isRequired,
  currencies: PropTypes.array.isRequired,
  onCurrChange: PropTypes.func.isRequired
}


class Inputs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileData: null,
      fileLbl: null,
      saveLbl: null,
      dbLbl: null
    }
    this.handleDataLoad = this.handleDataLoad.bind(this);
    this.handleDataSave = this.handleDataSave.bind(this);
  }

  handleDataSave() {
    //posts transactions to /uploads and saves to DB
    axios.post(this.props.url + "/uploads", this.state.fileData)
    .then(res => {
      console.log(res.data)
      this.setState({ saveLbl: "Saved to DB" })
    })
    .catch(err => console.log(err));
  }

  handleDataLoad (e) {
    //if save button clicked
    if (e.target.id === "db") {

      //otherwise load from db
      console.log("Fetching db data.");
      this.props.onDataLoad("db");
      return this.setState({
        dbLbl: "DB Loaded",
        fileLbl: null,
        saveLbl: null,
        fileData: null
      });
    }
    //else get data from uploaded file
    else {
      //exit if upload cancelled
      if (!e.target.value) return;

      const path = e.target.value;
      const filename = path.substr(path.lastIndexOf("\\")+1);
      console.log("Reading", filename);

      //if file format invalid (expect .json)
      if (!filename.endsWith(".json")) {
        this.props.onDataLoad({ msg: "Invalid file format"});
        this.setState({ fileLbl: filename, fileData: null });
      }
      else {
        const reader = new FileReader();
        const file = e.target.files[0];
        //read file
        reader.onload = upload =>  {
          let result = JSON.parse(upload.target.result);

          //detect bad content format and filter bad entries
          result = Array.isArray(result) && result.filter(el => {
            return typeof el.currency === "string" && typeof el.amount === "number";
          });
          //send err msg if filter fails
          this.props.onDataLoad(result || { msg: "Invalid file contents" });
          this.setState({
            fileData: result,
            fileLbl: filename,
            saveLbl: null,
            dbLbl: null
          });
        }
        reader.readAsText(file);
      }
    }
  }

  render() {
    return (
      <div className="inputs">
        <ul className="hlist btn">
          <FileUpload
            label={this.state.fileLbl}
            onFileUpload={this.handleDataLoad} >
          </FileUpload>
          <DbSave
            label={this.state.saveLbl}
            disabled={!this.state.fileData ? true : false}
            onDbSave={this.handleDataSave}>
          </DbSave>
          <DbLoad
            label={this.state.dbLbl}
            onDbLoad={this.handleDataLoad}>
          </DbLoad>
        </ul>
        <Switcher
          currencies={this.props.currencies}
          selectedCurr={this.props.selectedCurr}
          onCurrChange={this.props.onCurrChange}>
        </Switcher>
      </div>
    )
  }
}

Inputs.propTypes = {
  selectedCurr: PropTypes.string.isRequired,
  currencies: PropTypes.array.isRequired,
  onDataLoad: PropTypes.func.isRequired,
  onCurrChange: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
}

export default Inputs;
