import { api } from "src/boot/axios";

export default {
    create(user) {
    return api.post( '/v1/user/create/', user).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in user creation: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  all(client_id) {
      return api.get( '/v1/user/all/'+ client_id).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
  deleteUser(client_id, user_id) {
    return api.delete( '/v1/user/delete/' +  client_id + '/' + user_id).then(response => {
        let responseCode = response.data;
        return responseCode;
    }).catch(err => {
        console.log("Error while deleting the user: " + JSON.stringify(err));
        return Promise.reject(err);
    });
},
};
