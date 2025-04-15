import { api } from "src/boot/axios";

export default {
  create(supplier) {
    return api
      .post("/v1/supplier/create_or_update/", supplier)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in site creation: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  all(client_id) {
    return api
      .get("/v1/supplier/" + client_id)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting suppliers: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  deleteSupplier(client_id, id) {
    return api
      .delete("/v1/supplier/delete/" + client_id + "/" + id)
      .then((response) => {
        let responseCode = response.data;
        return responseCode;
      })
      .catch((err) => {
        console.log(
          "Error while deleting the supplier: " + JSON.stringify(err)
        );
        return Promise.reject(err);
      });
  },
  entryExistInLedger(client_id, supplier_id) {
    return api
      .get("/v1/supplier/isledgerexist/" + client_id + "/" + supplier_id)
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
  createLedger(entry) {
    return api
      .post("/v1/supplier/createledger/", entry)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in creating ledger: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
};
