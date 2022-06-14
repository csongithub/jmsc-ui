import { api } from "src/boot/axios";

export default {
  getAllGroups(clientId) {
      return api.get( '/v1/bg_group/all/' + clientId).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
  createGroup(bgGroupDTO) {
      return api.post( '/v1/bg_group/create',bgGroupDTO).then(response => {
      let group = response.data;
      return group;
    }).catch(err => {
      console.log("Error in creating group: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
  groupDetails(clientId, groupId) {
     return api.get( '/v1/bg_group/group_details/' + clientId + '/' +groupId ).then(response => {
      let groupDetails = response.data;
      return groupDetails;
    }).catch(err => {
      console.log("Error in getting records: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
  manageDeposit(linkDepositRequest) {
      return api.post( '/v1/bg_group/manage_fix_deposits_in_bg',linkDepositRequest).then(response => {
      let group = response.data;
      return group;
    }).catch(err => {
      console.log("Error in creating group: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  },
  manageGuarantee(linkGuaranteeRequest) {
    return api.post( '/v1/bg_group/manage_bank_guarantees_in_bg',linkGuaranteeRequest).then(response => {
    let group = response.data;
    return group;
  }).catch(err => {
    console.log("Error in creating group: " + JSON.stringify(err.response.data));
    return Promise.reject(err);
  });
},
};
