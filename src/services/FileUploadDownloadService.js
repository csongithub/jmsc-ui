import { api } from "src/boot/axios";
import { downloadAPI } from "src/boot/axios";

export default {
  uploadFile(file, client_id, file_type, file_id) {
    let formData = new FormData();
    formData.append("file", file);

    return api
      .post(
        "/v1/file_upload_download/upload/" +
          client_id +
          "/" +
          file_type +
          "/" +
          file_id,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  downloadFile(client_id, file_type, file_id, file_name, mode) {
    var image = false;
    if (!file_name.endsWith(".pdf")) {
      image = true;
    }
    return downloadAPI
      .get("/v1/download/" + client_id + "/" + file_type + "/" + file_id, {
        headers: {},
        responseType: "arraybuffer",
      })
      .then((response) => {
        let fileUrl = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        if (mode === "view") {
          if (image) {
            return fileUrl;
          } else {
            window.open(fileUrl);
          }
          return null;
        }
        let fileLink = document.createElement("a");
        fileLink.href = fileUrl;
        fileLink.setAttribute("download", file_name);
        document.body.appendChild(fileLink);
        fileLink.click();
        return null;
      })
      .catch((err) => {
        console.log("Error in downloading file: " + JSON.stringify(err));
        return Promise.reject(err);
      });
  },
};
