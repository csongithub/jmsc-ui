import { api } from "src/boot/axios";

export default {
  getAllCreditors(clientId) {
    return api
      .get("/v1/accounting/creditors/" + clientId)
      .then((response) => {
        let creditors = response.data;
        return creditors;
      })
      .catch((err) => {
        console.log("Error in getting creditors: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  getCreditor(clientId, id) {
    return api
      .get("/v1/accounting/creditor/" + clientId + "/" + id)
      .then((response) => {
        let creditor = response.data;
        return creditor;
      })
      .catch((err) => {
        console.log("Error in getting creditors: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  saveCreditor(creditor) {
    return api
      .post("/v1/accounting/creditor/create_or_update", creditor)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting records: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
};
