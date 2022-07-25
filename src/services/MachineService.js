import { api } from "src/boot/axios";

export default {
    create(machine) {
        return api.post( '/v1/machine/add/', machine).then(response => {
            let machine = response.data;
            return machine;
        })
        .catch(err => {
            console.log("Error machine creation: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    all(client_id) {
        return api.get( '/v1/machine/all/'+ client_id).then(response => {
            let machines = response.data;
            return machines;
        }).catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    }
};
