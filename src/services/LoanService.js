import { api } from "src/boot/axios";

export default {
    create(loan) {
      return api.post( '/v1/loan/create',loan).then(response => {
      let loan = response.data;
      return loan;
    }).catch(err => {
      console.log("Error in creating loan: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
    all(clientId) {
      return api.get( '/v1/loan/all/' + clientId).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
  loanCollateral(clientId, loanId) {
    return api.get( '/v1/loan/collateral/' + clientId + '/' + loanId).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
};
