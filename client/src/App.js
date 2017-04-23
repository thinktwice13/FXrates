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
    this.handleFileData = this.handleFileData.bind(this);
    this.getTblData = this.getTblData.bind(this);
  }

  handleCurrChange(curr) {
    this.setState({ base: curr });
    //TODO: recalculate exchange rates data
    api.recalculateRates(curr, this.state.exchangeData)
  }

  handleFileData(fileData) {
    //send file contents to server
    axios.post(this.props.url  + "/uploads", fileData)
    .catch(err => console.log(err));

    //summarize transaction data
    let txSummary = {};
    fileData.map(tx => {
      txSummary.hasOwnProperty(tx.currency) ?
        txSummary[tx.currency] += +tx.amount :
        txSummary[tx.currency] = +tx.amount;
    });
    //temp fix
    // delete txSummary.undefined;

    //get exchange rates
    let currencies = Object.keys(txSummary).reduce((a,key) => {
      return a + key + ",";
    },"");
    api.getExchangeRates(this.state.base, currencies)
    .then(res => {
      let rates = [];
      res.map(item => {
        //add chosen currency rate
        item.data.rates[item.data.base] = 1.0;
        rates.push(item.data);
      })

      //filter transactions (remove currencies without rates data or undefined)
      txSummary = Object.keys(txSummary)
        .filter(key => Object.keys(res[0].data.rates).includes(key))
        .reduce((obj, key) => {
          obj[key] = txSummary[key];
          return obj;
        },{});
      this.setState({
        transactions: txSummary,
        exchangeData: rates
       });
    })

  }

  getTblData() {
    //construct table data
    let { base, transactions, exchangeData } = this.state;
    let tblArr = [];
    exchangeData.map(entry => {
      let obj = {
        date: entry.date,
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
        (arr[i].date !== arr[i+1].date) ? tmp.push(arr[i]) : null;
      }
      return tmp;
    })(tblArr);
    //sort by sum amount
    tblArr.sort((a, b) => { return b.baseSum -  a.baseSum }).length = 5;
    //sort by date
    tblArr.sort((a, b) => {
      if (b.date > a.date) return 1
      else if (b.date < a.date) return -1
      else return 0;
    });
    //round and stringify
    tblArr.map(item => { item.baseSum = (Math.round(100 * item.baseSum) / 100).toFixed(2) + " " + base;  });
    return tblArr;
  }

  render() {
    let { base, exchangeData, transactions } = this.state;
    return (
      <div className="app">
        <div className="selector">
          <FileUpload
            onFileUpload={this.handleFileData}>
          </FileUpload>
          <Switcher
            onCurrChange={this.handleCurrChange}
            options={this.props.currencies} >
          </Switcher>
        </div>
        { transactions && exchangeData &&
          <Table
            tableData={this.getTblData}
            converted={Object.keys(transactions).reduce((a,key) => {
              return key !== base ? a+Math.round(100*transactions[key])/100 +" "+key+",   " : a +"";
            }, "").slice(0,-4)} />
          }
          <p className="desc">
            Accepts JSON file upload in <span><code>{"[{ currency: 'EUR', amount: 192.23 }, ... { currency: 'CHF', amount: 1234.79 }]"}</code></span> format.
            Outputs 5 days from the previous 30 day period that would yield the highest transaction summary of chosen currency.
          </p>
        </div>
      );
  }
}

export default App;
