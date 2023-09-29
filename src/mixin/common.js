import { date } from "quasar";
import { LocalStorage } from "quasar";

export const commonMixin = {
  data() {
    return {
      cacheChanged: false
    };
  },
  methods: {
    updatePartyCache(party){
      return this.$store.dispatch('party/updateParty', {party: party})
    },
    getPartyNames(party_id, name_type){
      let party = this.$store.getters['party/getParty'](party_id)
      if(!party) {
        party = this.$store.dispatch('party/getAllParty', {client_id: this.getClientId(), party_id: party_id})
      }
      if(name_type === 'name')
        return party.name
      else if(name_type === 'nick_name')
        return party.nick_name
    },
    updateNotificationCache(client_id){
      this.$store.dispatch('notification/all', {client_id: client_id})
    },
    openLoginLayout() {
      this.$router.push({ name: "login" });
    },
    openMainLayout() {
      this.$router.push({ name: "home" });
    },
    getClient() {
      let auth = LocalStorage.getItem("auth");
      if(auth && auth.client) {
        return auth.client
      } else {
        return null
      }
    },
    getUser() {
      let auth = LocalStorage.getItem("auth");
      if(auth && auth.user) {
        return auth.user
      } else {
        return null
      }
    },
    isAdmin(){
      let auth = LocalStorage.getItem("auth");
      if(auth && auth.admin)
        return true
      else
        return false
    },
    getClientId(){
      let client = this.getClient()
      if(client !== null){
        return client.id
      } 
    },
    getLogonId(){
      let client = this.getClient()
      if(client !== null){
        return client.logonId
      } 
    },
    getTodaysDate() {
      var today = new Date()
      let year = today.getFullYear()
      let date = today.getDate()
      let month = today.getMonth() + 1

      if(date/10 < 1) {
        date = '0'+ date
      }

      if(month/10 < 1) {
        month = '0' + month
      }
      return (date + '-' + month + '-' + year)
    },
    isNullOrUndefined(obj){
      if(obj === null || obj === undefined)
        return true
      else
        return false
    },
    isNotNullOrUndefined(obj){
      return !this.isNullOrUndefined(obj)
    },
    getErrorMessage(err){
      return err.response.data.message
    },
    notify(message) {
      this.$q.notify({
        message: message,
        multiLine: true,
        color: "primary"
      });
    },
    info(message) {
      this.$q.notify({
        message: message,
        multiLine: true,
        color: "info"
      });
    },
    warn(message) {
      this.$q.notify({
        message: message,
        multiLine: true,
        color: "warning"
      });
    },
    success(message) {
      this.$q.notify({
        message: message,
        caption: "",
        color: "primary"
      });
    },
    fail(message) {
      this.$q.notify({
        message: message,
        caption: "",
        type: "negative"
      });
    },
    warning(message) {
      this.$q.notify({
        message: message,
        caption: "",
        type: "warning"
      });
    },
    info(message) {
      this.$q.notify({
        message: message,
        caption: "",
        type: "info"
        //position: "top-right"
      });
    },
    sortby(list, col) {
      console.log("sortby: " + col);
      this.sortparam = col;
      if (this.order === 1) {
        list.sort(function(a, b) {
          return a[col] > b[col];
        });
        this.order = 0;
      } else {
        list.sort(function(a, b) {
          return a[col] < b[col];
        });
        this.order = 1;
      }
    },
    sortbyOrder(list, col, order) {
      console.log("sortby: " + col);
      this.sortparam = col;
      if (order === "asc") {
        list.sort(function(a, b) {
          return a[col] > b[col];
        });
      } else if (order === "desc") {
        list.sort(function(a, b) {
          return a[col] < b[col];
        });
      }
    },
    formateDateInResponse(response) {
      for (var i = 0; i < response.length; i++) {
        response[i].created_dt = date.formatDate(
          response[i].created_dt,
          "YYYY-MM-DD HH:mm:ss Z"
        );
        response[i].updated_dt = date.formatDate(
          response[i].updated_dt,
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    },
    formateDate(input_date, format) {
      var output_date = date.formatDate(input_date, format);
      return output_date;
    }
  },
  computed: {},
  watch: {}
};
