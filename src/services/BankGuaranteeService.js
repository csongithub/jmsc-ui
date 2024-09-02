import { api } from "src/boot/axios";

export default {
  creatGuarantee(bg) {
    return api
      .post("/v1/bank_guarantee/create_or_update/", bg)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in creating bank guarantee: " +
            JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getAll(clientId) {
    return api
      .get("/v1/bank_guarantee/" + clientId)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting bank guarantees: " +
            JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
};
