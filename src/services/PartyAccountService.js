import { api } from "src/boot/axios";

export default {
  uploadAccoutns(files) {
    let formData = new FormData();
    formData.append('file', files[0]);
    return api.post( '/v1/party/bankaccount/uploadFile',formData, {
      headers: {'Content-Type': 'multipart/form-data'}
      }).then(response => {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch(err => {
        console.log("Error in getting offers: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  getFileRecords(filePath) {
    return api.get( '/v1/party/bankaccount/getFileRecords/' + filePath).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  addAccount(account) {
    return api.post( '/v1/party/bankaccount/addAccount/', account).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  getPartyAccounts(clientId) {
    const params = new URLSearchParams({
      clientId: clientId
    }).toString();
      return api.get( '/v1/party/bankaccount/allAccounts?' + params).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err));
      return Promise.reject(err);
    });
  },
  addPartyAccount(account) {
      return api.post( '/v1/party/bankaccount/addAccount/', account).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in adding account: " + JSON.stringify(err));
      return Promise.reject(err);
    });
  },
  accountById(clientId, accountId) {
    return api.get( '/v1/party/bankaccount/account_by_id/' + clientId + '/' + accountId).then(response => {
        let account = response.data;
        return account;
    }).catch(err => {
        console.log("Error in getting account: " + JSON.stringify(err));
        return Promise.reject(err);
    });
  },
};
