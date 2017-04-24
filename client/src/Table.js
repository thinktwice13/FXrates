import React, { Component } from 'react';
import PropTypes from "prop-types";

//TODO: add db save/laod btns, loading component, tbl sorting

class Table extends Component {
  //TODO: table sorting
  render() {
    let data = this.props.tableData;
    console.log(data);
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
                <th>Date</th>
                <th>Sum</th>
              </tr>
              {data.map((entry,i)  => {
                return <tr key={i}>
                  <td>{entry.date}</td>
                  <td>{entry.baseSum}</td>
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
