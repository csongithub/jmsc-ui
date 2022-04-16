import { api } from "src/boot/axios";

export default {
    getEumOptions(enum_name) {
        return api.get( '/v1/enums/get_all_options/' + enum_name).then(response => {
            let options = response.data;
            return options;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    }
};
