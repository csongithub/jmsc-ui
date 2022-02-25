import { api } from "src/boot/axios";

export default {
  updatePassword(updateRequest) {
    return api.post("/v1/client/update_basic_info", updateRequest)
        .then(response => {
        console.log("Update Successful " + JSON.stringify(response.data));
        return response.data;
      })
      .catch(err => {
        console.log("Update Failed: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  }
};
