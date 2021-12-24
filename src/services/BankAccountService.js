import { api } from "src/boot/axios";

export default {
    addAccount(account) {
    return api.post( '/v1/bankaccount/addBankAccount/', account).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  getAccounts() {
      return api.get( '/v1/bankaccount/getAllAccounts/').then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err));
      return Promise.reject(err);
    });
  }
};
