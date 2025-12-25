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
  async getLedger(clientId, creditorId, ledgerId) {
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
  detectPayments(clientId, creditorId) {
    return api
      .get("/v1/accounting/creditor/payments/" + clientId + "/" + creditorId)
      .then((response) => {
        let payments = response.data;
        return payments;
      })
      .catch((err) => {
        console.log("Error in getting payments: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  updateDetectedPayment(entry) {
    return api
      .post("/v1/accounting/creditor/payments/update", entry)
      .then((response) => {
        let status = response.data;
        return status;
      })
      .catch((err) => {
        console.log("Error in getting payments: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  deleteEntry(clientId, creditorId, ledgerId, entryId) {
    return api
      .delete(
        "/v1/accounting/ledger/entries/delete/" +
          clientId +
          "/" +
          creditorId +
          "/" +
          ledgerId +
          "/" +
          entryId
      )
      .then((response) => {
        let status = response.data;
        return status;
      })
      .catch((err) => {
        console.log("Error in getting materials: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  async getAllCapitalAccounts(clientId) {
    return api
      .get("/v1/accounting/capital_account/" + clientId)
      .then((response) => {
        let accounts = response.data;
        return accounts;
      })
      .catch((err) => {
        console.log(
          "Error in getting capital accounts: " + JSON.stringify(err)
        );
        return Promise.reject(err);
      });
  },
  async getAllCapitalAccountList(clientId) {
    return await api
      .get("/v1/accounting/capital_account/list/" + clientId)
      .then((response) => {
        let accounts = response.data;
        return accounts;
      })
      .catch((err) => {
        console.log(
          "Error in getting capital accounts: " + JSON.stringify(err)
        );
        return Promise.reject(err);
      });
  },
  createCapitalAccount(account) {
    return api
      .post("/v1/accounting/capital_account/create", account)
      .then((response) => {
        let account = response.data;
        return account;
      })
      .catch((err) => {
        console.log(
          "Error in creating capital account: " +
            JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  capitalAccountStatement(request) {
    return api
      .post("/v1/accounting/capital_account/statement", request)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting capital account records: " +
            JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  createVoucher(voucher) {
    return api
      .post("/v1/accounting/voucher/create", voucher)
      .then((response) => {
        let voucher = response.data;
        return voucher;
      })
      .catch((err) => {
        console.log(
          "Error in creating voucher: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  async getVoucher(clientId, voucherId, accountId) {
    return api
      .get(
        "/v1/accounting/voucher/get/" +
          clientId +
          "/" +
          voucherId +
          "/" +
          accountId
      )
      .then((response) => {
        let voucher = response.data;
        return voucher;
      })
      .catch((err) => {
        console.log(
          "Error in getting voucher: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
};
