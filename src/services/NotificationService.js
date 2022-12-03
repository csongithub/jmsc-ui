import { api } from "src/boot/axios";

export default {
  count(client_id) {
    return api.get("/v1/notification/count/" + client_id)
        .then(response => {
        return response.data;
      })
      .catch(err => {
        console.log("Error in getting notifications" + JSON.stringify(err));
        return Promise.reject(err);
      });
  },

  all(client_id) {
    return api.get("/v1/notification/all/" + client_id)
        .then(response => {
        return response.data;
      })
      .catch(err => {
        console.log("Error in getting notifications" + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  reload(client_id) {
    return api.get("/v1/notification/refresh_and_get/" + client_id)
        .then(response => {
        return response.data;
      })
      .catch(err => {
        console.log("Error in getting notifications" + JSON.stringify(err));
        return Promise.reject(err);
      });
  }
};
