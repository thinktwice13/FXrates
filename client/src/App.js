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
      fxData: null,
    }

    this.handleCurrChange = this.handleCurrChange.bind(this);
    this.handleFileData = this.handleFileData.bind(this);
    this.getTblData = this.getTblData.bind(this);
  }

  handleCurrChange(base) {
    this.setState({ base: base });

    let fxData = this.state.fxData;
    fxData && fxData.forEach(item => {
      item.base = base;
      let saved = item.rates[base];
      Object.keys(item.rates).forEach(curr => {
        item.rates[curr] = Math.round((item.rates[curr]*10000) / saved) / 10000;
      })
    })
    //QUESTION: not needed? allowed?
    this.setState({ fxData });
  }

  handleFileData(fileData) {
    this.setState({fxData: null})
    let txSummary = {};
    let rates = [];
    console.log(fileData);
    if (fileData) {
      console.log("Setting txs");
      //send file contents to server
      axios.post(this.props.url  + "/uploads", fileData)
      .catch(err => console.log(err));
      //summarize transaction data
      fileData.map(tx => {
        txSummary.hasOwnProperty(tx.currency) ?
        txSummary[tx.currency] += +tx.amount :
        txSummary[tx.currency] = +tx.amount;
      });
      //temp fix
      // delete txSummary.undefined;

      //get exchange rates
      let currencies = Object.keys(txSummary).concat(this.props.currencies);
      currencies = currencies.filter((el,pos) => {
        return currencies.indexOf(el) == pos;
      });
      api.getExchangeRates(this.state.base, currencies)
      .then(res => {
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
          fxData: rates
        });
      });
    } else {
      this.setState({
        transactions: null
      });
    }
  }

  getTblData() {
    //construct table data
    let { base, transactions, fxData } = this.state;

    //get converted curencies
    let converted = Object.keys(transactions).reduce((a,key) => {
      return key !== base ? a+Math.round(100*transactions[key])/100 +" "+key+",   " : a +"";
    }, "").slice(0,-4);

    //get table rows
    let rows = fxData.map(entry => {
      return {
        date: entry.date,
        sum: Object.keys(transactions).reduce((a,tx) => {
          return a + transactions[tx] / +entry.rates[tx];
        }, 0)
      };
    })
    //remove duplicates
    //FIXME: reduce???
    rows = ((arr) => {
      let tmp = [];
      for (let i = 0; i < arr.length-1; i++) {
        (arr[i].date !== arr[i+1].date) ? tmp.push(arr[i]) : null;
      }
      return tmp;
    })(rows);
    //sort by sum amount
    rows.sort((a, b) => { return b.sum -  a.sum }).length = 5;
    //sort by date
    // rows.sort((a, b) => {
    //   if (b.date > a.date) return 1
    //   else if (b.date < a.date) return -1
    //   else return 0;
    // });
    //round and stringify
    rows.forEach(item => { item.sum = (Math.round(100 * item.sum) / 100).toFixed(2) + " " + base;  });
    return {
      rows,
      converted
    }
  }

  render() {
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

        { this.state.transactions ?
          !this.state.fxData ?
            console.log("test loading") :
            <Table tableData={this.getTblData()} /> : null
        }
          <p className="desc">
            Accepts JSON file upload in <code>{"[{ currency: 'EUR', amount: 192.23 }, ... { currency: 'CHF', amount: 1234.79 }]"}</code> format.
            Outputs 5 days from the previous 30 day period that would yield the highest transaction summary of chosen currency.
          </p>
        </div>
      );
  }
}

export default App;
