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
  getAllActiveFacilities(clientId) {
    return api.get( '/v1/credit_facility/get_all_active/' + clientId).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getAllClosedFacilities(clientId) {
    return api.get( '/v1/credit_facility/get_all_closed/' + clientId).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getAllActiveFacilitiesByType(clientId, facilityType) {
    const params = new URLSearchParams({
      clientId: clientId,
      facilityType: facilityType
    }).toString();
    return api.get( '/v1/credit_facility/all_active_by_facility_type?' + params).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in getting records: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getAllClosedFacilitiesByType(clientId, facilityType) {
    const params = new URLSearchParams({
      clientId: clientId,
      facilityType: facilityType
    }).toString();
    return api.get( '/v1/credit_facility/all_closed_by_facility_type?' + params).then(response => {
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
  linkageDetails(clientId, facilityId) {
    return api.get( '/v1/credit_facility/linkage_details/' + clientId + "/" + facilityId).then(response => {
        let data = response.data;
        return data;
      }).catch(err => {
        console.log("Error in getting data: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  closeFacility(client_id, facility_id) {
    return api.put('/v1/credit_facility/close/' + client_id + '/' + facility_id).then(response => {
        let status = response.data;
        return status;
      })
      .catch(err => {
        console.log("Error in getting data: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
};
