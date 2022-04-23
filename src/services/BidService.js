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
    discardBid(clientId, bidId) {
        return api.delete( '/v1/bid/discard_bid/' + clientId + '/' + bidId).then(response => {
            let records = response.data;
            return records;
        })
        .catch(err => {
            console.log("Error in deleting records: " + JSON.stringify(err.response.data));
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
    getAllAcceptedBids(clientId) {
        return api.get( '/v1/bid/all_accepted_bids/' + clientId).then(response => {
            let records = response.data;
            return records;
        }).catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    getAllRejectedBids(clientId) {
        return api.get( '/v1/bid/all_rejected_bids/' + clientId).then(response => {
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
        return api.post( '/v1/bid/clear_emd/' + bidId).then(response => {
            let records = response.data;
            return records;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    saveBidFee(feeDetails, clientId, bidId) {
        return api.post( '/v1/bid/save_bid_fee/' + clientId + '/' + bidId, feeDetails).then(response => {
            let feeDetails = response.data;
            return feeDetails;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    clearFee(bidId) {
        return api.post( '/v1/bid/clear_fee/' + bidId).then(response => {
            let records = response.data;
            return records;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    saveOtherCost(otherCost) {
        return api.post('/v1/bid/save_other_cost', otherCost).then(response => {
            let status = response.data;
            return status;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    markEMDReturn(bidId) {
        return api.post( '/v1/bid/mark_emd_returned/' + bidId).then(response => {
            let records = response.data;
            return records;
        })
        .catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    },
    getBidDetails(clientId, bidId) {
        return api.get( '/v1/bid/bid_details/' + clientId + '/' + bidId).then(response => {
            let records = response.data;
            return records;
        }).catch(err => {
            console.log("Error in getting records: " + JSON.stringify(err.response.data));
            return Promise.reject(err);
        });
    }
};
