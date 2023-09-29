<template>
<q-layout>
  <q-header>
    <q-toolbar>
      <div class="text-weight-bolder text-white text-h6 text-uppercase">
        {{'constructo'}}
      </div>
    </q-toolbar>
  </q-header>
  
  <q-page-container>
    
    <q-page class="flex flex-center">
      <q-card 
        
        class="row my-card items-center q-pa-none q-ma-none shadow-24">
      
        <q-card-section
            v-if="$q.platform.is.desktop"
            class="col-md-4 items-center float-left bg-primary"
            :style="{height : $q.screen.height - 200 + 'px', width : ''}"
            horizontal
        >
          <div class="text-center full-width">
            <div class="text-weight-bolder text-white text-h6 text-uppercase">constructo</div>
            <div class="text-caption text-black">A complete data solution platform</div>
          </div>
        </q-card-section>
        <q-card-actions class="col-md-8 col-lg-8 col-sm-12 sol-xs-12 float-left">
          <q-card-section class="item-center">
            <div>
              <q-form 
                @submit="login"
                @reset="onReset" 
                class="q-gutter-md"
                :style="'min-width: 300px; margin: auto;'"
                :greedy="true"
                :autofocus="true" 
              >
                <span class="text-subtitle1 text-weight-bold text-grey nowrap"
                >Welcome Back, Please Sign in</span>
                
                <q-input
                  dense outlined
                  v-model="loginRequest.logonId"
                  label="Login ID"
                  lazy-rules
                  autofocus
                  no-error-icon
                  :rules="[val => (val && val.length > 0) || 'Enter client login id']"
                />

                <q-input
                  dense outlined
                 :type="isPwd ? 'password' : 'text'"
                  v-model="loginRequest.password"
                  label="Password"
                  lazy-rules
                  :rules="[val => (val && val.length > 0) || 'Enter password']"
                >
                  <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                    </template>
                </q-input>
                 <q-checkbox class="q-mr-sm" dense v-model="loginRequest.admin" label="Admin" color="primary"/>
                <div>
                  <q-btn
                    dense
                    label="Login"
                    type="submit"
                    color="primary"
                    class="full-width text-caitalize" 
                  />
                  <q-btn
                    dense
                    label="Reset"
                    type="reset"
                    color="primary"
                    outline
                    class="q-mt-sm full-width text-caitalize"
                  />
                </div>
              <br>
              <span class="text-red">{{loginResponse.loginSuccess ? '' : loginResponse.message}}</span>
              </q-form>
            </div>
          </q-card-section>
        </q-card-actions>
      </q-card>
      <!-- </q-parallax> -->
    </q-page>
    
  </q-page-container>
   
</q-layout>
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
        password: "",
        admin: false,
      },
      loginResponse: {
        loginSuccess: false,
        clientDTO: null,
        message: '',
        token: ''
      },
      isPwd: true
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
        user: this.loginResponse.userDTO !== null ? this.loginResponse.userDTO : null,
        token: this.loginResponse.token,
        admin: this.loginResponse.admin,
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
.my-card {
  height: 30%px;
}

.login-form {
  position: absolute;
}
</style>
