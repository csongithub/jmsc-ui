import { api } from "src/boot/axios";

export default {
  getAllFacilities(clientId) {
    return api.get( '/v1/credit_facility/get_all/' + clientId).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },

  getAllFacilitiesByType(clientId, facilityType) {
    const params = new URLSearchParams({
      clientId: clientId,
      facilityType: facilityType
    }).toString();
    return api.get( '/v1/credit_facility/all_by_facility_type?' + params).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  addCreditFacility(cf) {
    return api.post( '/v1/credit_facility/add_facility', cf).then(response => {
        let creditF = response.data;
        return creditF;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  }
};
