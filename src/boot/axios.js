import { boot } from "quasar/wrappers";
import axios from "axios";
import { LocalStorage } from "quasar";
// import routes from "../router/routes";
import { Router } from "src/router";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: "http://localhost:8001/jmsc/api/" });
const downloadAPI = axios.create({
  baseURL: "http://localhost:9003/jmscfiledownload/api/",
});
//axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqbXNjMDAxIiwiZXhwIjoxNjQ1NDUxMDQyLCJpYXQiOjE2NDUwMTkwNDJ9.kcGoCUjY8J1CndDILwxQA2XxzOfTpjq-E8Q30NBKKtawAATAqJ1u6mOlSOblBW7CxO1B791CK74H8DW9TQfkBA'

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$downloadAPI = downloadAPI;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  //
  // create a request interceptor so that for every call going out
  // we will potentially start a progress bar to show network communication
  // We are using vuex "loading" store to track how many outgoing and how many
  // incoming request are being done
  //
  api.interceptors.request.use(function (config) {
    const auth = LocalStorage.getItem("auth");
    //console.log(JSON.stringify(token))
    if (auth && auth.token) {
      config.headers.Authorization = "Bearer " + auth.token;
      // console.log(JSON.stringify(config));
    }
    // console.log(
    //   "axios.interceptors.request common header " + JSON.stringify(config)
    // );
    return config;
  });

  downloadAPI.interceptors.request.use(function (config) {
    const auth = LocalStorage.getItem("auth");
    //console.log(JSON.stringify(token))
    config.headers.Authorization = "Bearer " + auth.token;
    // console.log(JSON.stringify(config));
    // console.log(
    //   "axios.interceptors.request common header " + JSON.stringify(config)
    // );
    return config;
  });

  //
  // create a response interceptor so that for every call coming back
  // we will potentially stop a progress bar to show network communication is done
  // We are using vuex "loading" store to track how many outgoing and how many
  // incoming request are being done.   When the request hit 0 the progress
  // should disappear.
  //
  api.interceptors.response.use(
    function (response) {
      // console.log("==============================" + JSON.stringify(response));
      return response;
    },
    function (error) {
      if (401 === error.response.status) {
        Router.push("/login");
        LocalStorage.clear();
      } else {
        return Promise.reject(error);
      }
    }
  );
  downloadAPI.interceptors.response.use(function (config) {
    //console.log("axios.interceptors.response common header " + JSON.stringify(config))
    return config;
  });
});

export { api };
export { downloadAPI };
