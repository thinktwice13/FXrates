import axios from "axios";
import moment from "moment";

export default {
  getFxData(base, currs, txData) {
    let txSum = {};
    //summarize transactions
    txData.forEach(tx => {
      txSum.hasOwnProperty(tx.currency) ?
      txSum[tx.currency] += +tx.amount :
      txSum[tx.currency] = +tx.amount;
    });

    //get combined unique currencies from transactions and switcher
    let symbols = Object.keys(txSum).concat(currs);
    currs = currs.filter((el,pos) => {
      return currs.indexOf(el) === pos;
    });

    //get API url requirements
    let apiUrl = "https://api.fixer.io/";
    //get date range
    let dates = [];
    for (let i = 1; i <= 30; i++) {
      dates.push(moment().subtract(i,"d").format("YYYY-MM-DD"));
    }
    //format api urls
    let promises = dates.map(date => {
      return axios.get(apiUrl + date + "?base=" + base + "&symbols=" + symbols);
    })
    //fetch exchange data
    return axios.all(promises)
    .then(apiRates => {
      let rates = [];
      apiRates.forEach(item => {
        //add base currency to fxData results for easier recalc
        //FIXME: rates unnecessary??
        item.data.rates[item.data.base] = 1.0;
        rates.push(item.data);
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
        txSum,
        rates
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
