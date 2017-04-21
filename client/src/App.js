import React, { Component } from 'react';
import axios from "axios";
import api from "./api";
import Table from "./Table";
import FileUpload from "./FileUpload";
import Switcher from "./Switcher";


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

  render() {
    let {base, exchangeData, transactions} = this.state;
    //manipulate transactions vs api data
    let tblArr = [];
    exchangeData.map(entry => {
      let obj = {
        date: entry.date,
        timestamp: entry.timestamp,
        baseSum: Object.keys(transactions).reduce((a,tx) => {
          return a + transactions[tx] / +entry.rates[tx];
        }, 0),
        //FIXME: remove from loop!
        converted: Object.keys(transactions).reduce((a,key) => {
          return key !== base ? `${a}${transactions[key]} ${key}-` : a +"";
        }, "").split("-").slice(0,-1)
      }
      tblArr.push(obj);
    })
    //remove duplicates
    tblArr = ((arr) => {
      let tmp = [];
      for (let i = 0; i < arr.length-1; i++) {
        (arr[i].timestamp !== arr[i+1].timestamp) ? tmp.push(arr[i]) : null;
      }
      return tmp;
    })(tblArr);

    tblArr.sort((a, b) => { return b.baseSum -  a.baseSum });
    tblArr.length = 5;
    tblArr.map(item => {
      item.baseSum = (Math.round(100 * item.baseSum) / 100).toFixed(2) + " " + base;
    });
    return tblArr;
  }
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
