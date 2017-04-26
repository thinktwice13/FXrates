import React, { Component } from 'react';
import axios from "axios";
import api from "./api";
import FileUpload from "./FileUpload";
import Table from "./Table";
import Loading from "./Loading" ;

//TODO: add db save/laod options

//err messages
function Msg(props) {
  return (
    <p className="loader">{props.text}</p>
  )
}

//currency switcher
function Switcher(props) {
  const currs = props.currencies;
  return (
    <ul className="hlist">
      {currs.map(curr => {
        return (
          <li
            className={curr === props.selectedCurr ? "selected" : null}
            onClick={props.onCurrChange.bind(null, curr)}
            key={curr}>
            {curr}
          </li>
        )
      })}
    </ul>
  )
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      base: this.props.currencies[0],
      transactions: null,
      fxData: null,
      msg: null
    }

    this.handleCurrChange = this.handleCurrChange.bind(this);
    this.handleFileData = this.handleFileData.bind(this);
    this.getTblData = this.getTblData.bind(this);
  }

  handleCurrChange(base) {
    //stop if no change in chosen currency
    if (base === this.state.base) return;

    console.log("Switching currency.");
    //recalculate rates for the new base currency
    let fxData = this.state.fxData;
    fxData && fxData.forEach(item => {
      item.base = base;
      const saved = item.rates[base];
      Object.keys(item.rates).forEach(curr => {
        item.rates[curr] = Math.round((item.rates[curr]*10000) / saved) / 10000;
      })
    })
    this.setState({ base, fxData });
  }

  handleFileData(fileData) {
    //if there is a message instead of a file
    if (fileData.msg) {
      this.setState({
        msg: fileData.msg,
        transactions: null
      });
    }
    //if valid file sent
    else {
      //clear message
      let msg = null;
      let txSummary = {};
      let rates = [];

      //send transactions to server
      axios.post(this.props.url  + "/uploads", fileData)
      //TODO: show success/failure in client
      .then(res => console.log("Transactions saved! ( /transactions )"))
      .catch(err => console.log(err));

      //summarize transactions
      fileData.forEach(tx => {
        txSummary.hasOwnProperty(tx.currency) ?
        txSummary[tx.currency] += +tx.amount :
        txSummary[tx.currency] = +tx.amount;
      });

      //get combined unique currencies from transactions and switcher
      let currencies = Object.keys(txSummary).concat(this.props.currencies);
      currencies = currencies.filter((el,pos) => {
        return currencies.indexOf(el) == pos;
      });

      //get exchange rates
      api.getExchangeRates(this.state.base, currencies)
      .then(res => {
        res.map(item => {
          //add chosen currency rate
          item.data.rates[item.data.base] = 1.0;
          rates.push(item.data);
        })

        //filter transactions (remove currencies without api results or undefined)
        txSummary = Object.keys(txSummary)
          .filter(key => Object.keys(res[0].data.rates).includes(key))
          .reduce((obj, key) => {
            obj[key] = txSummary[key];
            return obj;
          },{});

        this.setState({
          msg,
          transactions: txSummary,
          fxData: rates
        });
      });
    }
  }

  getTblData() {
    console.log("Getting table data.");
    //construct table data
    const { base, transactions, fxData } = this.state;

    //get all currencies (exclude base)
    const converted = Object.keys(transactions).reduce((a,key) => {
      return key !== base ? a+(Math.round(100*transactions[key])/100).toFixed(2) +" "+key+",   " : a +"";
    }, "").slice(0,-4);

    //get table rows
    let rows = fxData.map(entry => {
      return {
        date: entry.date,
        sum: Object.keys(transactions).reduce((a,tx) => {
          return a + transactions[tx] / +entry.rates[tx];
        }, 0)
      };
    });

    //FIXME: reduce???
    //remove duplicates from table rows
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
    rows.forEach(item => { item.sum = (Math.round(100*item.sum)/100).toFixed(2) + " " + base;  });

    return {
      rows,
      converted
    }
  }

  render() {
    console.log("Rendering app.");

    return (
      <div className="app">
        <div className="selector">
          <FileUpload
            onFileUpload={this.handleFileData}>
          </FileUpload>
          <Switcher
            onCurrChange={this.handleCurrChange}
            currencies={this.props.currencies} >
          </Switcher>
        </div>
        { this.state.msg ?
          <Msg text={this.state.msg} /> :
            this.state.transactions ?
            !this.state.fxData ?
            <Loading /> :
              <Table tableData={this.getTblData()} /> :
                null
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
