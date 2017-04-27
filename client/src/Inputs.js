import React, { Component } from 'react';
import PropTypes from "prop-types";

function FileUpload(props) {
  return (
    <ul className="hlist btn">
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
    </ul>
  )
}

FileUpload.defaultProps = { label: "Choose a file..." };
FileUpload.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  label: PropTypes.string

}

function DbLoad(props) {
  return (
    <ul className="hlist btn">
      <li
        id="db"
        className={props.label && "active"}
        onClick={props.onDbLoad}>
        {props.label || "Load from DB"}
      </li>
    </ul>
  )
}

DbLoad.defaultProps = { label: "Load from DB" };
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
      fileLbl: null,
      dbLbl: null
    }
    this.handleDataLoad = this.handleDataLoad.bind(this);
  }

  handleDataLoad (e) {
    //if database
    if (e.target.id === "db") {
      //exit if db already loaded
      if (this.state.dbLbl) return;
      console.log("Fetching db data.");
      //otherwise load from db
      this.props.onDataLoad("db");
      return this.setState({
        dbLbl: "DB Loaded",
        fileLbl: null
      });
    }
    else {
      //if from file =============================
      //if cancelled
      const filename = e.target.value;
      const label = filename.substr(filename.lastIndexOf("\\")+1);
      console.log("Reading", label);
      if (!e.target.value) return;

      //if file not.json
      if (!filename.endsWith(".json")) {
        this.props.onDataLoad({ msg: "Invalid file format"});
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
          this.props.onDataLoad(result || { msg: "Invalid file contents" });
          this.setState({
            fileLbl: label,
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
        <FileUpload
          label={this.state.fileLbl}
          onFileUpload={this.handleDataLoad} >
        </FileUpload>
        <DbLoad
          label={this.state.dbLbl}
          onDbLoad={this.handleDataLoad}>
        </DbLoad>
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
  onCurrChange: PropTypes.func.isRequired
}

export default Inputs;
