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
  getMaterials(clientId, creditorId) {
    return api
      .get("/v1/accounting/creditor/materials/" + clientId + "/" + creditorId)
      .then((response) => {
        let materials = response.data;
        return materials;
      })
      .catch((err) => {
        console.log("Error in getting materials: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  createLedger(ledger) {
    return api
      .post("/v1/accounting/ledger/create_or_update", ledger)
      .then((response) => {
        let ledger = response.data;
        return ledger;
      })
      .catch((err) => {
        console.log(
          "Error in creating ledger: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getLedgers(clientId, creditorId) {
    return api
      .get("/v1/accounting/ledger/" + clientId + "/" + creditorId)
      .then((response) => {
        let ledgers = response.data;
        return ledgers;
      })
      .catch((err) => {
        console.log(
          "Error while getting ledgers: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getLedger(clientId, creditorId, ledgerId) {
    return api
      .get(
        "/v1/accounting/ledger/" + clientId + "/" + creditorId + "/" + ledgerId
      )
      .then((response) => {
        let ledger = response.data;
        return ledger;
      })
      .catch((err) => {
        console.log(
          "Error while getting ledger: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  postEntries(entries) {
    return api
      .post("/v1/accounting/ledger/entries/post", entries)
      .then((response) => {
        let status = response.data;
        return status;
      })
      .catch((err) => {
        console.log(
          "Error in getting records: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  findEntryByDateAndChallan(req) {
    return api
      .post("/v1/accounting/ledger/entries/validate_by_date_and_challan", req)
      .then((response) => {
        let entry = response.data;
        return entry;
      })
      .catch((err) => {
        console.log(
          "Error in getting entry: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getEntries(req) {
    return api
      .post("/v1/accounting/ledger/entries", req)
      .then((response) => {
        let entries = response.data;
        return entries;
      })
      .catch((err) => {
        console.log(
          "Error in getting entries: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
};
