import { api } from "src/boot/axios";

export default {
  async create(project) {
    return api
      .post("/v1/projects/create_or_update/", project)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        console.log(
          "Error in project creation: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  all(client_id) {
    return api
      .get("/v1/projects/all/" + client_id)
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
  async getProjectList(client_id) {
    return await api
      .get("/v1/projects/all/list/" + client_id)
      .then((response) => {
        let projects = response.data;
        return projects;
      })
      .catch((err) => {
        console.log(
          "Error in getting projects: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
};
