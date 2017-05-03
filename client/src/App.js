import React, { Component } from 'react';
import Inputs from "./Inputs";
import Table from "./Table";
import Loading from "./Loading" ;
import utils from "./utils";

//err messages
function Msg(props) {
  return ( <p className="msg">{props.text}</p> )
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
    this.handlaDataLoad = this.handlaDataLoad.bind(this);
    this.getTblData = this.getTblData.bind(this);
  }

  handleCurrChange(base) {
    //stop if no change in chosen currency
    if (base === this.state.base) return;

    console.log("Switching currency.");
    //recalculate rates with the new base currency
    let fxData = this.state.fxData;
    fxData && fxData.forEach(item => {
      item.base = base;
      const saved = item.rates[base];
      Object.keys(item.rates).forEach(curr => {
        item.rates[curr] /= saved;
      })
    })
    this.setState({ base, fxData });
  }

  handlaDataLoad(txData) {
    console.log("Loading transactions");

    //sets display message if error reading file
    if (txData.msg) return this.setState({ msg: txData.msg, transactions: null});

    //if loading transactions from DB
    if (txData === "db") {
      this.setState({ msg: "..." });
      //get transactions from db
      utils.getTxData(this.props.url + "/transactions")
      //get ecxhange rates
      .then(txData => {
        return utils.getFxData(this.state.base, this.props.currencies, txData)
      })
      .then(data => {
        this.setState({
          msg: null,
          transactions: data.txSum,
          fxData: data.rates
        });
      }).catch(err => console.log(err));
    }
    //if loading transactions data from file
    else {
      //get exchange rates
      utils.getFxData(this.state.base, this.props.currencies, txData)
      .then(data => {
        this.setState({
          msg: null,
          transactions: data.txSum,
          fxData: data.rates
        });
      }).catch(err => console.log(err));
    }
  }

  getTblData() {
    console.log("Calculating table data.");
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

    //remove duplicates from table rows
    rows = rows.filter((el,i) => {
      return rows[i].date !== (rows[i-1] && rows[i-1].date);
    });

    //sort by sum amount
    rows.sort((a, b) => { return b.sum -  a.sum }).length = 5;

    //round and stringify
    rows.forEach(item => { item.sum = (Math.round(100*item.sum)/100).toFixed(2) + " " + base;  });

    return {
      rows,       //array [{date:xxx, sum:000}, ...]
      converted   //string "123 EUR, 456 USD, ..."
    }
  }

  render() {
    const msg = this.state.msg;
    return (
      <div className="app">
        <Inputs
          selectedCurr={this.state.base}
          currencies={this.props.currencies}
          url={this.props.url}
          onCurrChange={this.handleCurrChange}
          onDataLoad={this.handlaDataLoad} >
        </Inputs>
        { msg ?
          msg === "..." ?
          <Loading /> :
            <Msg text={this.state.msg} /> :
              this.state.transactions ?
              !this.state.fxData ?
              <Loading className="msg"/> :
                <Table tableData={this.getTblData()} /> :
                  null
        }
        <p className="desc">
          Accepts JSON file upload in <code>{"[{ currency: 'EUR', amount: 192.23 }, ... { currency: 'CHF', amount: 1234.79 }]"}</code> format.
          Outputs 5 days from the previous 30 day period that would yield the highest transaction summary of chosen currency.
        </p>
      </div>
    )
  }
}

export default App;
