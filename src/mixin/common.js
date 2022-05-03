import { date } from "quasar";
import { LocalStorage } from "quasar";
export const commonMixin = {
  data() {
    return {};
  },
  methods: {
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
      return (year + '-' + month + '-' + date)
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
        type: "positive"
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
