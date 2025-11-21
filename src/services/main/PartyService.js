import { api } from "src/boot/axios";

export default {
  create(site) {
    return api
      .post("/v1/party/create/", site)
      .then((response) => {
        let party = response.data;
        // this.$store.commit('UPDATE_PARTY', party)
        // this.$store.getters['party/getParty'](party_id)
        return party;
      })
      .catch((err) => {
        console.log(
          "Error site creation: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getParty(client_id, party_id) {
    return api
      .get("/v1/party/" + client_id + "/" + party_id)
      .then((response) => {
        let record = response.data;
        return record;
      })
      .catch((err) => {
        console.log(
          "Error in getting party: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  all(client_id) {
    return api
      .get("/v1/party/all/" + client_id)
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
  allByStatus(client_id, status) {
    return api
      .get("/v1/party/all/" + client_id + "/" + status)
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
  getPartyLinkedAccounts(client_id, party_id) {
    return api
      .get("/v1/party/bank_accounts/" + client_id + "/" + party_id)
      .then((response) => {
        let responseCode = response.data;
        return responseCode;
      })
      .catch((err) => {
        console.log(
          "Error while getting party linked accounts: " + JSON.stringify(err)
        );
        return Promise.reject(err);
      });
  },
  deleteParty(client_id, party_id) {
    return api
      .delete("/v1/party/delete/" + client_id + "/" + party_id)
      .then((response) => {
        let responseCode = response.data;
        return responseCode;
      })
      .catch((err) => {
        console.log("Error while deleting party: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
  list(client_id) {
    return api
      .get("/v1/party/list/" + client_id)
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
