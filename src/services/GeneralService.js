import { api } from "src/boot/axios";

export default {
  entry(name) {
    return api
      .get("/v1/general/entry/" + name)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting entry: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
};
