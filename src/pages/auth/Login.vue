<template>
  <div class="row">
    <div class="col">
      <q-card square bordered class="q-pa-lg shadow-1">
        <q-card-section>
          <span class="absolute-center text-primary text-h5"><b>Login</b></span>
        </q-card-section>
        <q-card-section>
          <q-form @submit="login" @reset="onReset" class="q-gutter-md">
            <q-input
              dense
              filled
              v-model="loginRequest.logonId"
              label="Client ID"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Enter Client ID']"
            />

            <q-input
              dense
              filled
              type="password"
              v-model="loginRequest.password"
              label="Password"
              lazy-rules
              :rules="[val => (val && val.length > 0) || 'Enter password']"
            />

            <div>
              <q-btn
                dense
                label="Login"
                type="submit"
                color="primary"
                class="full-width"
              />
              <q-btn
                dense
                label="Reset"
                type="reset"
                color="primary"
                outline
                class="q-mt-sm full-width"
              />
            </div>
            <br>
            <span class="text-red">{{loginResponse.loginSuccess ? '' : loginResponse.message}}</span>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { LocalStorage } from "quasar";
import LoginServcie from "../../services/auth/LoginService";
export default {
  props: {},
  name: "Login",
  data() {
    return {
      loginRequest: {
        logonId: "",
        password: ""
      },
      loginResponse: {
        loginSuccess: false,
        clientDTO: null,
        message: '',
        token: ''
      },
    };
  },

  methods: {
    login() {
      //console.log(JSON.stringify(this.loginRequest));
      LoginServcie.login(this.loginRequest)
        .then(response => {
          this.loginResponse = response;
          //window.prompt(JSON.stringify(this.loginResponse));
          if (this.loginResponse.loginSuccess ) {
            this.openMainLayout();
          }
        })
        .catch(err => {});
    },

    onReset() {
      (this.loginRequest.logonId = ""), (this.loginRequest.password = "");
    },
    updateLater() {
      this.openMainLayout();
    },
    openMainLayout() {
      let auth = {
        client: this.loginResponse.clientDTO,
        token: this.loginResponse.token,
        newlogin: true
      }
      LocalStorage.set('auth', auth);
      //LocalStorage.set('client', this.loginResponse.clientDTO);
      //LocalStorage.set('token', this.loginResponse.token);
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
