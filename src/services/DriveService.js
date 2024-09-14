import { api } from "src/boot/axios";

export default {
  create(directory) {
    return api
      .post("/v1/drive/create_directory/", directory)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  all(client_id) {
    return api
      .get("/v1/drive/all/" + client_id)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  getDirectory(client_id, directory_id) {
    return api
      .get("/v1/drive/directory/" + client_id + "/" + directory_id)
      .then((response) => {
        let directory = response.data;
        return directory;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  deleteDirectory(client_id, directory_id) {
    return api
      .delete("/v1/drive/delete/" + client_id + "/" + directory_id)
      .then((response) => {
        let responseCode = response.data;
        return responseCode;
      })
      .catch((err) => {
        console.log(
          "Error while deleting the directory: " + JSON.stringify(err)
        );
        return Promise.reject(err);
      });
  },
  createFolder(meta) {
    return api
      .post("/v1/drive/create_folder/", meta)
      .then((response) => {
        let records = response.data;
        return records;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  getAllFiles(getFilesRequest) {
    return api
      .post("/v1/drive/list_files", getFilesRequest)
      .then((response) => {
        let files = response.data;
        return files;
      })
      .catch((err) => {
        console.log(
          "Error in getting files: " + JSON.stringify(err.response.data)
        );
        return Promise.reject(err);
      });
  },
  uploadFile(file, fileMetaData) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(fileMetaData));
    return api
      .post("/v1/drive/upload_file", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  deleteFile(client_id, directory_id, file_id) {
    return api
      .delete(
        "/v1/drive/delete_file/" +
          client_id +
          "/" +
          directory_id +
          "/" +
          file_id
      )
      .then((response) => {
        let responseCode = response.data;
        return responseCode;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  renameFile(request) {
    return api
      .post("/v1/drive/rename_file/", request)
      .then((response) => {
        let outcome = response.data;
        return outcome;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  moveFiles(request) {
    return api
      .post("/v1/drive/move_files/", request)
      .then((response) => {
        let outcome = response.data;
        return outcome;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
};
