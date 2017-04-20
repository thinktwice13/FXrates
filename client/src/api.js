import axios from "axios";
import moment from "moment";

function getDateRange() {
  let dates = [];
  for (let i = 1; i <= 30; i++) {
    dates.push(moment().subtract(i,"d").format("YYYY-MM-DD"));
  }
  return dates;
}

function handleError(err) {
  console.log(err);
  return null;
}



export default {
  getExchangeRates(base, symbols) {
    //get requirements
    let dates = getDateRange();
    let rates = [];
    let promises = [];
    let apiUrl = "http://api.fixer.io/";

    //get formated api call strings
    dates.map(date => {
      let url = apiUrl + date + "?base=" + base + "&symbols=" + symbols;
      return promises.push(axios.get(url));
    })

    //fetch exchange data
    axios.all(promises)
      .then(res => {
        res.map(item => {
          item.data.timestamp = +item.data.date.split("-").join("");
          item.data.rates[item.data.base] = 1.0;
          return rates.push(item.data)
        })
      })
      .catch(handleError)
      return Promise.resolve(rates);
  },
  recalculateRates(base, fxdata) {
    //recalculate exchange rates for new base currency
    return fxdata.map(item => {
      item.base = base;
      let saved = item.rates[base];
      Object.keys(item.rates).map(rate => {
        item.rates[rate] = Math.round((item.rates[rate]*10000) / saved) / 10000;
      })
    })
  }
}
