import axios from "axios";
import moment from "moment";

export default {
  getExchangeRates(base, symbols) {
    //get requirements
    let dates = [],
        // promises = [],
        apiUrl = "https://api.fixer.io/";

    //get date range
    for (let i = 1; i <= 30; i++) {
      dates.push(moment().subtract(i,"d").format("YYYY-MM-DD"));
    }

    //get formatted api urls
    let promises = dates.map(date => {
      return axios.get(apiUrl + date + "?base=" + base + "&symbols=" + symbols);
    })

    //fetch exchange data
    return axios.all(promises)
      .then(res => { return res })
      .catch(err => console.log(err));
  }
}
