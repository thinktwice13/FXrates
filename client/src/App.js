import React, { Component } from 'react';
import axios from "axios";
import api from "./api";
import Table from "./Table";
import FileUpload from "./FileUpload";
import Switcher from "./Switcher";

<<<<<<< HEAD
//TODO: split into modules

class Table extends Component {
  render() {
    return (
      <div>{JSON.stringify(this.props.tableDatanull, 2)}</div>
    )
  }
}

class FileUpload extends Component {
  handleChange(event) {
    //TODO: handle file upload
  }

  render() {
    return (
      <form>
        <input
          type="file"
          id="fileupload"
          onChange={this.handleChange.bind(this)} />
        <button
          type="submit">
          Submit
        </button>
      </form>
    )
  }
}

class Switcher extends Component {
  currChange(e) {
    e.preventDefault();
    this.props.onCurrChange(e.target.value);
  }

  render() {
    return (
      <select
        onChange={this.currChange.bind(this)}>
        {this.props.options.map(curr => {
          return <option key={curr} value={curr}>{curr}</option>
        })}
      </select>
    )
  }
}
=======
>>>>>>> 4e49ce4... add mongo seed, split to modules, remove duplicate rates

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      base: this.props.currencies[0],
      transactions: null,
      exchangeData: null
    }

    this.handleCurrChange = this.handleCurrChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.loadTransactions = this.loadTransactions.bind(this);
  }

  componentDidMount() {
    //get exchange rates
    api.getExchangeRates(this.state.base, this.props.currencies)
      .then(res => this.setState({exchangeData: res}));

    //FIXME: switch from seed data to uploaded file source
    this.loadTransactions();
  }

  handleCurrChange(curr) {
    this.setState({ base: curr });
    //TODO: recalculate exchange rates data
    api.recalculateRates(curr, this.state.exchangeData)
  }

  handleFileUpload() {
    //TODO: handle file upload
    // const file = files[0];
    // this.props.actions.uploadRequest({
    //    file,
    //    name: 'Awesome Cat Pic'
    // })
  }

  loadTransactions() {
    axios.get(this.props.url + "/transactions")
      .then(res => {
        //summarize transactions by currency
        let summary = {};
<<<<<<< HEAD
        res.data.map(item => summary.hasOwnProperty(item.currency) ? summary[item.currency] += item.amount : summary[item.currency] = item.amount);
        this.setState({ transactions: summary })}
      )
  }


=======
        res.data.map(item => summary.hasOwnProperty(item.currency) ? summary[item.currency] += +item.amount : summary[item.currency] = +item.amount);
        this.setState({ transactions: summary });
      })
  }

  removeDuplicates(arr) {
    let tmp = [];
    for (let i = 0; i < arr.length-1; i++) {
      if (arr[i].timestamp !== arr[i+1].timestamp) {
        tmp.push(arr[i]);
      }
    }
    return tmp;
  }
>>>>>>> 4e49ce4... add mongo seed, split to modules, remove duplicate rates

  render() {
    let {base, exchangeData, transactions} = this.state;
    //manipulate transactions vs api data
    let tblArr = [];
    if (transactions !== null && exchangeData !== null) {
      //loop through exchangge rate data
      exchangeData.map(entry => {
        let obj = {};
        obj.date = entry.date;
        obj.timestamp = entry.timestamp;
        //FIXME:refcator NOT NEEDED
        obj.converted = []; Object.keys(transactions).map(key => {
          if (key !== base) obj.converted.push(transactions[key].toFixed(2) + "  " + key)
        });
        //chosen currency summary calc
        obj.baseSum = 0;
        obj.baseSum += Object.keys(transactions).map(tx => {
          console.log(tx);
        })
        tblArr.push(obj);
      })
      tblArr = this.removeDuplicates(tblArr);
      tblArr.sort((a, b) => {
        return b.baseSum -  a.baseSum;
      });
      tblArr.length = 5;
      tblArr.map(item => {
        item.baseSum = (Math.round(100 * item.baseSum) / 100).toFixed(2) + " " + base;
      })
    }

<<<<<<< HEAD



=======
>>>>>>> 4e49ce4... add mongo seed, split to modules, remove duplicate rates
    return (
      <div className="app">
        <div className="selector">
          <FileUpload>
          </FileUpload>
          <Switcher
            onCurrChange={this.handleCurrChange}
            options={this.props.currencies} >
          </Switcher>
        </div>
        { (transactions !== null && exchangeData !== null) ? <Table tableData={tblArr}></Table> : null
          }
          <p>
            Accepts JSON file upload in <span><code>{"[{ currency: 'EUR', amount: 192.23 }, ... { currency: 'CHF', amount: 1234.79 }]"}</code></span> format.
            Outputs 5 days from the previous 30 day period that would yield the highest transaction summary of chosen currency.
          </p>
      </div>
    );
  }
}

export default App;
