import { api } from "src/boot/axios";

export default {
  createOrUpdate(account) {
      return api.post( '/v1/web_account/create_or_update/', account).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in saving records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getAllAccounts(client_id) {
    return api.get( '/v1/web_account/all/'+  client_id).then(response => {
      let records = response.data;
      return records;
    })
    .catch(err => {
      console.log("Error in gettin records: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
  getAccount(client_id, account_id) {
    return api.get( '/v1/web_account/get_account_attributes/'+  client_id + '/' + account_id).then(response => {
      let records = response.data;
      return records;
    })
    .catch(err => {
      console.log("Error in getting account: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
  removeAccount(client_id, account_id) {
    return api.delete( '/v1/web_account/delete_account/'+  client_id + '/' + account_id).then(response => {
      let records = response.data;
      return records;
    })
    .catch(err => {
      console.log("Error in getting account: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  }
};
