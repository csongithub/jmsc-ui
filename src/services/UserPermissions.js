import { api } from "src/boot/axios";

export default {
    createOrUpdate(userPermissionsDTO) {
    return api.post( '/v1/userpermissions/create_or_update/', userPermissionsDTO).then(response => {
        let records = response.data;
        return records;
      })
      .catch(err => {
        console.log("Error in updating user permissions: " + JSON.stringify(err.response.data));
        return Promise.reject(err);
      });
  },
  getPermissions(client_id, user_id) {
      return api.get( '/v1/userpermissions/get/'+ client_id + '/' + user_id).then(response => {
      let records = response.data;
      return records;
    }).catch(err => {
      console.log("Error in getting user permissions: " + JSON.stringify(err.response.data));
      return Promise.reject(err);
    });
  }
};
