import { api } from "src/boot/axios";

export default {
    addAccount(account) {
    return api.post( '/v1/bankaccount/addBankAccount/', account).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getAccounts(clientId) {
      const params = new URLSearchParams({
        clientId: clientId
      }).toString();

      return api.get( '/v1/bankaccount/getAllAccounts?'+ params).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  }
};
