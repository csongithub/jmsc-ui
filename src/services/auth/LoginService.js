import { api } from "src/boot/axios";

export default {
  login(loginRequest) {
    return api.post("/v1/auth/login", loginRequest)
        .then(response => {
        console.log("Login Successful " + JSON.stringify(response.data));
        return response.data;
      })
      .catch(err => {
        console.log("Login Failed: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  updatePassword(updateRequest) {
    return api.post("/v1/auth/update_password", updateRequest)
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
