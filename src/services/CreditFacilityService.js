import { api } from "src/boot/axios";

export default {
  getBanks() {
    return api.get( '/v1/jmsc_properties/banks').then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getBranches() {
    return api.get( '/v1/jmsc_properties/branches').then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getPostOffice() {
    return api.get( '/v1/jmsc_properties/post_office').then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
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
  },
  getAvailableFacilities(clientId) {
    return api.get( '/v1/credit_facility/free_facilities/' + clientId).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getFreeCollateral(clientId) {
    return api.get( '/v1/credit_facility/free_collateral/' + clientId).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  guaranteesForBgGroup(clientId) {
    return api.get( '/v1/credit_facility/guarantees_for_bg_group/' + clientId).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
};
