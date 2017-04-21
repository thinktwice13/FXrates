import React, { Component } from 'react';

class Table extends Component {
  //TODO: table sorting
  render() {
    let data = this.props.tableData;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>Comverted</th>
            </tr>
            <tr>
              <td>{data[0].converted.join(",  ")}</td>
            </tr>
          </tbody>
        </table>

        <table>
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
    )
  }
}

export default Table;
