import PartyService from "src/services/main/PartyService";
import { commonMixin } from "src/mixin/common";

//This is where all data will go.
//We will be adding our party to this later on
const state = {
  parties: [],
};

//This contains the methods which manipulates the state
//These methods can not be asynchronous
//We cant create a method which reach out to a server aand waits for some data and then manipulate the state
//We can only creates the method which manipulates the state directly
const mutations = {
  // setParties(state, value) {
  //     Vue.set(state, "parties", value);
  // }
};

//This contains methods
//These methods can be asynchronous which reach out to a server and grab some data and then commits a mutation
//
const actions = {
  // getAllParties: (state) => {
  //     PartyService.all(commonMixin.methods.getClientId())
  //     .then((response) => {
  //         state.parties.splice(0, state.parties.length);
  //         state.parties = response;
  //         state.loading = false;
  //     })
  //     .catch((err) => {
  //       this.fail(this.getErrorMessage(err));
  //     });
  // }
  getAllParties: (commit) => {
    console.log("Getting parties");
    window.alert("getting parties");
  },
};

//In here we creates methods which actually gets the data from state.
//Which can not be used by components within app
//We can also manipulate a data within the getters before we send it out to components
const getters = {
  parties: (state) => {
    return state.parties;
  },
};

export default {
  namespaced: true, // this allow multiple store modules in our app
  state,
  mutations,
  actions,
  getters,
};
