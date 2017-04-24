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

    //get formatted api urls
    dates.map(date => {
      let url = apiUrl + date + "?base=" + base + "&symbols=" + symbols;
      return promises.push(axios.get(url));
    })
    //fetch exchange data
    return axios.all(promises)
      .then(res => { return res })
      .catch(handleError);
  }
}
