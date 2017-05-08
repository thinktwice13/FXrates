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
    this.sortTbl = this.sortTbl.bind(this);
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

  sortTbl(e) {
    //FIXME: review!
    //determine sorting column and direction
    let sortBy = (e && e.target.id) || this.state.sortBy;
    let sortDir = (e && e.deltaY) || this.state.sortDir;

    if (e) {
      e.preventDefault();
      sortDir = (() => {
        if (e.deltaY) return e.deltaY > 0 ? "desc" : "asc";
        if (sortBy === this.state.sortBy) {
          return this.state.sortDir === "desc" ? "asc" : "desc";
        } else return "desc";
      })();
    }
    //exit if sorting triggered by an event but is unnecessary
    if (e && sortBy === this.state.sortBy && sortDir === this.state.sortDir) return;

    //sort rows
    console.log("Sorting table by",sortBy, sortDir);
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
    //sets sorting arrow
    const sortDirArrow = this.state.sortDir === "desc" ? " ▼" : " ▲";

    return (
      <div>
        <div>
          <table>
            <tbody>
              <tr>
                <th id="conv">Converted</th>
              </tr>
              <tr>
                <td>{this.state.converted}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th
                  id="date"
                  onWheel={this.sortTbl}
                  onClick={this.sortTbl}
                  className={this.state.sortBy === "date" ? "active" : null}>
                  {"Date"+ (this.state.sortBy === "date" ? sortDirArrow : "")}
                </th>
                <th
                  id="sum"
                  onWheel={this.sortTbl}
                  onClick={this.sortTbl}
                  className={this.state.sortBy === "sum" ? "active" : null}>
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
