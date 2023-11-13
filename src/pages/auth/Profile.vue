<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section v-if="admin">
        <div class="text-primary text-h5 q-mb-lg">Basic Info</div>
        <div class="row q-mb-sm">
            <div class="col-2">Login ID</div>
            <div class="col"><b>{{client.logonId}}</b></div><div class="col"></div><div class="col"></div>
        </div>
        <div class="row" style="width: 100%">
            <div class="col-2">Client Name</div>
            <div v-if="!update" class="col" >{{updateBasicReq.name}}</div>
            <div class="col"><q-input v-if="update" dense size="bg" v-model="updateBasicReq.name"/></div>
        </div>
        <div class="row">
            <div class="col-2">Display Name</div>
            <div  v-if="!update" class="col">{{updateBasicReq.displayName}}</div>
            <div class="col"><q-input v-if="update" dense v-model="updateBasicReq.displayName"/></div>
        </div>
         <div class="row">
            <div class="col-2">Emails</div>
            <div  v-if="!update" class="col">{{updateBasicReq.recipients}}</div>
            <div class="col"><q-input v-if="update" dense v-model="updateBasicReq.recipients"/></div>
        </div>
        <br>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-primary text-h5 q-mb-lg">Basic Info</div>
        <div class="row q-mb-sm">
            <div class="col-2">Login ID</div>
            <div class="col"><b>{{user.logonId}}</b></div><div class="col"></div><div class="col"></div>
        </div>
        <div class="row" style="width: 100%">
            <div class="col-2">User Name</div>
            <div v-if="!update" class="col" >{{user.name}}</div>
        </div>
        <div class="row">
            <div class="col-2">Display Name</div>
            <div  v-if="!update" class="col">{{user.displayName}}</div>
        </div>
        <br>
      </q-card-section>
      <q-separator/>
      <q-card-actions v-if="admin">
        <q-btn class="text-capitalize text-weight-light" dense color="primary" v-if="!update" @click="update=!update">update</q-btn>
        <q-btn class="text-capitalize text-weight-light" dense color="primary" v-if="update" @click="updateBasicInfo">save</q-btn>
      </q-card-actions>
    </q-card>
    <br>
    <q-separator/>
    <br>
    <div class="row">
      <div class="col-4 password">
        <q-card class="my-card">
          <q-form @submit="updatePassword" @reset="reset" class="">
            <q-card-section>
              <div class="text-primary text-center text-subtitle1 q-mb-lg">Update Password</div>
                
                <q-input
                    dense
                    
                    type="password"
                    v-model="updatePasswordRequest.currentPassword"
                    label="Curent Password"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Enter Current password']"/>
                <q-input
                    dense
                    
                    type="password"
                    v-model="updatePasswordRequest.newPassword"
                    label="New Password"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Enter New password']"/>
                <q-input
                    dense
                    
                    type="password"
                    v-model="updatePasswordRequest.reNewPassword"
                    label="Re-enter New Password"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Re-enter New password']"/>
              </q-card-section>
              <q-card-actions>
                  <span class="text-red">{{message}}</span>
                  <q-space/>
                  <q-btn  dense label="Update" type="submit" color="primary" class="text-capitalize text-weight-light"/>
                  <q-btn dense label="Reset" type="reset" color="primary" outline class="text-capitalize text-weight-light"/>
                  
            </q-card-actions>
            </q-form>
          </q-card>
      </div>
      <div v-if="admin" class="col-4 q-ml-md admin-password">
        <q-card class="my-card">
          <q-form @submit="updateAdminPassword" @reset="resetAdminPassword" class="">
            <q-card-section>
              <div class="text-primary text-center text-subtitle1 q-mb-lg">Update Admin Password</div>
                
                <q-input
                    dense
                    
                    type="password"
                    v-model="adminPwd.currentAdminPassword"
                    label="Curent Password"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Enter Current Password']"/>
                <q-input
                    dense
                    
                    type="password"
                    v-model="adminPwd.newAdminPassword"
                    label="New Password"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Enter New Password']"/>
                <q-input
                    dense
                    
                    type="password"
                    v-model="adminPwd.reNewAdminPassword"
                    label="Re-enter New Password"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Re-enter New Password']"/>
                <span class="text-red">{{adminMessage}}</span>
              </q-card-section>
              <q-card-actions>
                  <q-space/>
                  <q-btn  dense label="Update" type="submit" color="primary" class="text-capitalize text-weight-light"/>
                  <q-btn dense label="Reset" type="reset" color="primary" outline class="text-capitalize text-weight-light"/>
            </q-card-actions>
            </q-form>
          </q-card>
      </div>
    </div>

    
  </div>
</template>

<script>
import ProfileService from "../../services/auth/ProfileService";
import LoginServcie from "../../services/auth/LoginService";
import AdminAuthService from "../../services/auth/AdminAuthService";
import { commonMixin } from "../../mixin/common"
import { LocalStorage } from "quasar";
export default {
  props: {},
  name: "Profile",
  mixins: [commonMixin],
  data() {
    return {
      client: this.getClient(),
      clientId: this.getClientId(),
      user: this.getUser(),
      admin: this.isAdmin(),
      update:false,
      updatePasswordRequest: {
          logonId: null,
          currentPassword: null,
          newPassword: null,
          reNewPassword: null,
          admin: this.admin
      },
      updateBasicReq: {
        logonId: this.getLogonId(),
        name: this.getClient().name,
        displayName: this.getClient().displayName,
        recipients: this.getClient().recipients
      },
      message:'',
      adminMessage: '',
      adminPwd: {
          clientId: null,
          currentAdminPassword: null,
          newAdminPassword: null,
          reNewAdminPassword: null,
      }
    };
  },

  methods: {
    updatePassword() {
        this.updatePasswordRequest.logonId = this.admin ? this.client.logonId : this.user.logonId
        this.updatePasswordRequest.admin = this.admin
        if(this.updatePasswordRequest.newPassword !== this.updatePasswordRequest.reNewPassword) {
            this.message='Password did not match'
            return
        } else {
             this.message=''
        }
        LoginServcie.updatePassword(this.updatePasswordRequest)
        .then(response => {
            if(response.updateSuccess){
                // this.success(response.message)
                this.confirmRelogin('Password Updated Successfully !')
                this.reset()
            } else {
                this.message=response.message
            }
        })
        .catch(err => {
            this.fail(this.getErrorMessage(err))
        });
    },
    reset() {
        this.updatePasswordRequest.logonId = null
        this.updatePasswordRequest.currentPassword = null
        this.updatePasswordRequest.newPassword = null
        this.updatePasswordRequest.reNewPassword = null
        this.message=''
    },
    updateAdminPassword() {
        this.adminPwd.clientId = this.clientId
        if(this.adminPwd.newAdminPassword !== this.adminPwd.reNewAdminPassword) {
            this.adminMessage='Password did not match'
            return
        } else {
             this.adminMessage=''
        }
        // window.alert(JSON.stringify(this.admin))
        AdminAuthService.updatePassword(this.adminPwd)
        .then(response => {
            if(response.updateSuccess){
                // this.success(response.message)
                this.success('Password Updated Successfully !')
                this.resetAdminPassword()
            } else {
                this.adminMessage=response.message
            }
        })
        .catch(err => {
            this.fail(this.getErrorMessage(err))
        });
    },
    resetAdminPassword() {
        this.adminPwd.clientId = null
        this.adminPwd.currentAdminPassword = ''
        this.adminPwd.newAdminPassword = ''
        this.adminPwd.reNewAdminPassword = ''
        this.adminMessage=''
    },
    updateBasicInfo() {
        this.update = !this.update

        ProfileService.updatePassword(this.updateBasicReq)
        .then(response => {
            if(response){
                // this.success('Profile Updated')
                this.reset()
                this.confirmRelogin('Update Successful !')
            }
        })
        .catch(err => {
            this.fail(this.getErrorMessage(err))
        });
    },
    confirmRelogin(alert) {
      console.log('inside relogin')
      this.$q.dialog({
        title: alert,
        message: 'Please re-login for better experience.',
        cancel: true,
        persistent: true
      }).onOk(() => {
        LocalStorage.clear()
        this.openLoginLayout()
      }).onOk(() => {
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    }
    
  }
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>


