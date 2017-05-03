import axios from "axios";
import moment from "moment";

export default {
  getFxData(base, symbols, txData) {
    let txSum = {};
    //summarize transactions {"EUR":123, "USD":456, ...}
    txData.forEach(tx => {
      txSum.hasOwnProperty(tx.currency) ?
      txSum[tx.currency] += +tx.amount :
      txSum[tx.currency] = +tx.amount;
    });

    //get unique combined currencies from transactions and switcher options
    symbols = [...symbols, ...Object.keys(txSum)].filter((el,pos,arr) => {
      return arr.indexOf(el) === pos;
    });

    //get API url requirements
    const apiUrl = "https://api.fixer.io/";
    //get date range
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      dates.push(moment().subtract(i,"d").format("YYYY-MM-DD"));
    }
    //get array of api calls
    const promises = dates.map(date => {
      return axios.get(apiUrl + date + "?base=" + base + "&symbols=" + symbols);
    })
    //fetch exchange data and return to app.handleDataLoad
    return axios.all(promises)
    .then(apiRates => {
      let rates = [];
      apiRates.forEach(item => {
        //add base currency to fxData results for easier recalc
        //FIXME: rates unnecessary??
        item.data.rates[item.data.base] = 1.0;
        rates[rates.length] = item.data;
        return rates;
      });

      //filter transactions (remove currencies without api results or undefined)
      txSum = Object.keys(txSum)
      .filter(key => Object.keys(rates[0].rates).includes(key))
      .reduce((obj, key) => {
        obj[key] = txSum[key];
        return obj;
      },{});

      return {
        txSum,      //obj {"EUR":123,"USD":456, ...}
        rates       //api results array [{base,date,rates:{}}, ...]
      }
    })
    .catch(err => console.log(err));
  },
  getTxData(url) {
    return axios.get(url)
    .then(res => {return res.data})
    .catch(err => console.log(err));
  }
}
