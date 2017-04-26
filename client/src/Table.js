import React, { Component } from 'react';
import PropTypes from "prop-types";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.tableData.rows,
      converted: props.tableData.converted,
      sortBy: "date",
      sortDir: "desc"
    }
  }

  componentWillMount() {
    //initial sort
    this.sortTbl();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.tableData.rows,
      converted: nextProps.tableData.converted
    }, this.sortTbl);
  }

  sortTbl(col) {
    console.log("Sorting table");

    const sortBy = col || this.state.sortBy;
    let sortDir = this.state.sortDir;

    //determine sort direction on click
    if (col) {
      if (sortBy === this.state.sortBy) {
        sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
      } else sortDir = "desc";
    }

    //sort rows
    const data = this.state.data.sort((a,b) => {
      let sortVal = 0;
      if (a[sortBy] > b[sortBy]) sortVal = 1;
      if (a[sortBy] < b[sortBy]) sortVal = -1;
      if (sortDir === "desc") sortVal *= -1;
      return sortVal;
    })

    this.setState({
      sortBy,
      sortDir,
      data
    })
  }

  render() {
    console.log("Rendering Table.");
    //setup sorting arrow
    const sortDirArrow = this.state.sortDir === "desc" ? " ▼" : " ▲";

    return (
      <div>
        <div>
          <table className="convTbl">
            <tbody>
              <tr>
                <th>Converted</th>
              </tr>
              <tr>
                <td>{this.state.converted}</td>
              </tr>
            </tbody>
          </table>

          <table className="mainTbl">
            <tbody>
              <tr>
                <th
                  id="date"
                  onClick={this.sortTbl.bind(this, "date")}
                  className={this.state.sortBy === "date" ? "selected" : null}>
                  {"Date"+ (this.state.sortBy === "date" ? sortDirArrow : "")}
                </th>
                <th
                  id="sum"
                  onClick={this.sortTbl.bind(this, "sum")}
                  className={this.state.sortBy === "sum" ? "selected" : null}>
                  {"Sum"+ (this.state.sortBy === "sum" ? sortDirArrow : "")}
                </th>
              </tr>
              {this.state.data.map((entry,i)  => {
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

Table.propTypes = {
  tableData: PropTypes.object.isRequired
}

export default Table;
