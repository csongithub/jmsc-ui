import { api } from "src/boot/axios";

export default {
  createOrUpdate(invoice) {
    return api
      .post("/v1/einvoice/create_or_update/", invoice)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in creating e-Invoice: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getAllForMonths(clientId, state, fy, month) {
    return api
      .get("/v1/einvoice/" + clientId + "/" + state + "/" + fy + "/" + month)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting eInvocies: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getAllForFy(clientId, fy) {
    return api
      .get("/v1/einvoice/" + clientId + "/" + fy)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting eInvocies: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getAllForGstAndFy(clientId, gst, fy) {
    return api
      .get("/v1/einvoice/" + clientId + "/" + gst + "/" + fy)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting eInvocies: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  getAllForFyAndMonth(clientId, fy, month) {
    return api
      .get("/v1/einvoice/by_fy_month/" + clientId + "/" + fy + "/" + month)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in getting eInvocies: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  deleteEInvoice(client_id, invoice_id) {
    return api
      .delete("/v1/einvoice/delete/" + client_id + "/" + invoice_id)
      .then((response) => {
        let responseCode = response.data;
        return responseCode;
      })
      .catch((err) => {
        console.log(
          "Error while deleting the e-Invoice: " + JSON.stringify(err)
        );
        return Promise.reject(err);
      });
  },
  deleteFile(client_id, invoice_id, which_file) {
    return api
      .delete(
        "/v1/einvoice/delete_file/" +
          client_id +
          "/" +
          invoice_id +
          "/" +
          which_file
      )
      .then((response) => {
        let responseCode = response.data;
        return responseCode;
      })
      .catch((err) => {
        console.log(
          "Error while deleting the attachement: " + JSON.stringify(err)
        );
        return Promise.reject(err);
      });
  },
  fetchCurrentTurnover(clientId) {
    return api
      .get("/v1/einvoice/" + clientId + "/current/turnover")
      .then((response) => {
        window.dispatchEvent(
          new CustomEvent("turnover-changed", {
            detail: {
              turnover: response.data,
            },
          })
        );
      })
      .catch((err) => {
        console.log(
          "Error in getting turnover: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
};
