import { api } from "src/boot/axios";

export default {
  login(loginRequest) {
    window.alert(JSON.stringify(loginRequest));
    return api.post("/v1/auth/login", loginRequest)
        .then(response => {
        console.log("Login Successful " + JSON.stringify(response.data));
        return response.data;
      })
      .catch(err => {
        console.log("Login Failed: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  }
};
