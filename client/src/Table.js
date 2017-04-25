import React, { Component } from 'react';
import PropTypes from "prop-types";

//TODO: add db save/laod btns, loading component, tbl sorting

class Table extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.tableData;
    this.state = {
      sortBy: "date",
      sortDir: "desc"
    }
  }

  sortTbl(col) {
    console.log("sorting by ", col);
    let sortDir = this.state.sortDir;
    let sortBy = col;
    if (sortBy === this.state.sortBy) {
      sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
    } else sortDir = "desc";

    this.data = this.data.sort((a,b) => {
      let sortVal = 0;
      if (a[sortBy] > b[sortBy]) sortVal = 1;
      if (a[sortBy] < b[sortBy]) sortVal = -1;
      if (sortDir === "desc") sortVal *= -1;
      return sortVal;
    })

    this.setState({
      sortBy,
      sortDir
    })
  }

  render() {
    let sortDirArrow = this.state.sortDir === "desc" ? " ↓" : " ↑";
    console.log("Rendering table ", this.state.sortBy);

    return (
      <div>
        <div>
          <table className="convTbl">
            <tbody>
              <tr>
                <th>Comverted</th>
              </tr>
              <tr>
                <td>{this.props.converted}</td>
              </tr>
            </tbody>
          </table>
          <table className="mainTbl">
            <tbody>
              <tr>
                <th
                  id="date"
                  onClick={this.sortTbl.bind(this, "date")}
                  style={this.state.sortBy === "date" ? {color:"#d0021b"} : null}>
                  {"Date"+ (this.state.sortBy === "date" ? sortDirArrow : "")}
                </th>
                <th
                  id="sum"
                  onClick={this.sortTbl.bind(this, "sum")}
                  style={this.state.sortBy === "sum" ? {color:"#d0021b"} : null}>
                  {"Sum"+ (this.state.sortBy === "sum" ? sortDirArrow : "")}
                </th>
              </tr>
              {this.data.map((entry,i)  => {
                return <tr key={i}>
                  <td>{entry.date}</td>
                  <td>{entry.sum}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
        <p className="data-src">Data Source: <a target="_blank" href="http://fixer.io">fixer.io</a></p>
      </div>
    )
  }
}

export default Table;
