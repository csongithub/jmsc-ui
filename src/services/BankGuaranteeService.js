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
  deleteBankGuarantee(client_id, bg_id) {
    return api
      .delete("/v1/bank_guarantee/delete/" + client_id + "/" + bg_id)
      .then((response) => {
        let responseCode = response.data;
        return responseCode;
      })
      .catch((err) => {
        console.log("Error while deleting the BG: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
};
