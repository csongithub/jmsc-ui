import { api } from "src/boot/axios";

export default {
    all(clientId) {
      return api.get( '/v1/loan/all/' + clientId).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  }
};
