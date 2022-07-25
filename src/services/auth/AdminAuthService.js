import { api } from "src/boot/axios";

export default {
  authorize(authReq) {
    return api.post("/v1/auth/authorize_admin_access", authReq)
        .then(response => {
        console.log("Authorization Successful " + JSON.stringify(response.data));
        return response.data;
      })
      .catch(err => {
        console.log("Authorization Failed: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  updatePassword(req) {
    return api.post("/v1/auth/update_admin_password", req)
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
