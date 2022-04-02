import { api } from "src/boot/axios";

export default {
    createBid(bid) {
        return api.post( '/v1/bid/create_bid/', bid).then(response => {
            let records = response.data;
            return records;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    getBidsByStatus(clientId, status) {
        return api.get( '/v1/bid/bids_by_status/' + clientId + '/' + status).then(response => {
            let records = response.data;
            return records;
        }).catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    getBidCost(bidId) {
        return api.get( '/v1/bid/bid_cost/' + bidId).then(response => {
            let records = response.data;
            return records;
        }).catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    saveBidCost(bidCost) {
        return api.post( '/v1/bid/save_bid_cost/', bidCost).then(response => {
            let records = response.data;
            return records;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    clearEMD(bidId) {
        return api.post( '/v1/bid/elear_emd/' + bidId).then(response => {
            let records = response.data;
            return records;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
};
