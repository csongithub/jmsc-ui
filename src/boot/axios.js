import { boot } from "quasar/wrappers";
import axios from "axios";
import { LocalStorage } from "quasar";

import { Router } from "src/router";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

    if (auth && auth.token) {
      config.headers.Authorization =
        "Bearer " + (isRefreshing ? auth.refreshToken : auth.token);
    }
    return config;
  });

  function redirectToLogin() {
    Router.push("/login");
    LocalStorage.clear();
  }

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          //Check if current refresh token is also expired
          //if yes redirect to the login page
          const currentRefreshToken = LocalStorage.getItem("auth")
            ? "Bearer " + LocalStorage.getItem("auth").refreshToken
            : null;
          if (currentRefreshToken === originalRequest.headers.Authorization) {
            window.alert("Your current session has expired, please re-login");
            redirectToLogin();
            return;
          }

          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        const clientId = LocalStorage.getItem("auth").client.id;
        const refreshToken = LocalStorage.getItem("auth").refreshToken;
        const user = LocalStorage.getItem("auth").client.logonId;
        const isAdmin = LocalStorage.getItem("auth").admin;
        let request = {
          clientId: clientId,
          refreshToken: refreshToken,
          user: isAdmin ? user : LocalStorage.getItem("auth").user.logonId,
        };

        try {
          window.alert("Refreshing Token...");
          const refreshResponse = await api.post("/v1/auth/refresh", request);

          const newAccessToken = refreshResponse.data.token;
          const newRefreshToken = refreshResponse.data.refreshToken;

          let auth = LocalStorage.getItem("auth");
          auth.token = newAccessToken;
          auth.refreshToken = newRefreshToken;
          LocalStorage.set("auth", auth);
          isRefreshing = false;

          processQueue(null, newAccessToken);

          return api(originalRequest); // 🔁 retry original API
        } catch (err) {
          processQueue(err, null);
          // optional: logout user
          redirectToLogin();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  downloadAPI.interceptors.request.use(function (config) {
    const auth = LocalStorage.getItem("auth");
    config.headers.Authorization = "Bearer " + auth.token;
    return config;
  });

  downloadAPI.interceptors.response.use(function (config) {
    return config;
  });
});

export { api };
export { downloadAPI };
