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
  },
  getActiveAccounts(clientId) {
    const params = new URLSearchParams({
        clientId: clientId
      }).toString();
    return api.get( '/v1/bankaccount/getActiveAccounts?' + params).then(response => {
        let records = response.data;
        return records;
    }).catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err));
        return Promise.reject(err);
    });
  },
  accountById(clientId, accountId) {
    return api.get( '/v1/bankaccount/account_by_id/' + clientId + '/' + accountId).then(response => {
        let account = response.data;
        return account;
    }).catch(err => {
        console.log("Error in getting account: " + JSON.stringify(err));
        return Promise.reject(err);
    });
  },
};
