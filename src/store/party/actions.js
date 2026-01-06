import PartyService from "src/services/main/PartyService";

export function getAllParty({ commit, state }, payload) {
  if (!!state.parties[payload.party_id]) {
    return state.parties[payload.party_id];
  }

  PartyService.all(payload.client_id)
    .then((response) => {
      commit("LOAD_PARTIES", response);
      return state.parties[payload.party_id];
    })
    .catch((err) => console.log("get party returns: " + err));
}

export function loadAllParties({ commit, state }, payload) {
  // window.alert("loading parties: " + payload.client_id);
  PartyService.all(payload.client_id)
    .then((response) => {
      commit("LOAD_PARTIES", response);
    })
    .catch((err) => console.log("get party returns: " + err));
}

export function updateParty({ commit }, payload) {
  commit("UPDATE_PARTY", payload.party);
}
