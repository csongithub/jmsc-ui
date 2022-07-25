import { api } from "src/boot/axios";

export default {
    create(site) {
    return api.post( '/v1/site/create/', site).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error site creation: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  all(client_id) {
      return api.get( '/v1/site/all/'+ client_id).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  }
};
