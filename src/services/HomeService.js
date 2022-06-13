import { api } from "src/boot/axios";

export default {
    accessCards() {
        return api.get( '/v1/home/access_cards').then(response => {
            let data = response.data;
            return data;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    }
};
