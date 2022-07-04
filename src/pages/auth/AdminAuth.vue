<template>
  <div>
    <div v-if="embedded">
      <q-card flat bordered style="width: 400px; max-width: 80vw;">
          <q-bar class="bg-primary glossy text-white text-caption">
            {{ 'Admin Approval Required' }}
          </q-bar>
          <q-form @submit="authorize" >
            <q-card-section>
                <div class="text-weight-medium q-mb-sm text-subtitle2">{{title}}</div>
                <div class="text-italic">{{message}}</div>
            </q-card-section>
            <q-card-section>
                <q-input class="my-input" v-model="adminPassword" dense outlined :type="isPwd ? 'password' : 'text'" 
                    label="Enter Admin Password"
                >
                    <template v-slot:append>
                        <q-icon size="xs"
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                    </template>
                </q-input>
            </q-card-section>

            <q-separator />
            <q-card-actions>
                <q-space/>
                <q-btn type="submit" dense label="Authorise" color="primary" class="text-capitalize text-weight-light"/>
                <!-- <q-btn dense label="Cancel"  color="primary" @click="cancel" outline class="text-capitalize text-weight-light"/> -->
            </q-card-actions>
           </q-form>
        </q-card>
    </div>
    <div>
    <q-dialog
        v-model="open"
        persistent
        ref="paymentView">
        
        <q-card flat bordered style="width: 400px; max-width: 80vw;">
          <q-bar class="bg-primary glossy text-white text-caption">
            {{ 'Admin Approval Required' }}
          </q-bar>
          <q-form @submit="authorize" >
            <q-card-section>
                <div class="text-weight-medium q-mb-sm text-subtitle2">{{title}}</div>
                <div class="text-italic">{{message}}</div>
            </q-card-section>
            <q-card-section>
                <q-input class="my-input" v-model="adminPassword" dense outlined :type="isPwd ? 'password' : 'text'" 
                    label="Enter Admin Password"
                >
                    <template v-slot:append>
                        <q-icon size="xs"
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                    </template>
                </q-input>
            </q-card-section>

            <q-separator />
            <q-card-actions>
                <q-space/>
                <q-btn type="submit" dense label="Approve" color="primary" class="text-capitalize text-weight-light"/>
                <q-btn dense label="Cancel"  color="primary" @click="cancel" outline class="text-capitalize text-weight-light"/>
            </q-card-actions>
           </q-form>
        </q-card>
       
    </q-dialog>
    </div>
  </div>
</template>

<script>
import AdminAuthService from "../../services/auth/AdminAuthService";
import { commonMixin } from "../../mixin/common"
import { ref } from 'vue'
export default {
  props: {
        options: { type: Boolean, default: false },
        embedded:{type: Boolean, dafault: false},
        title: {type: Text, default: 'Are you sure?'},
        message: {type: Text, default: 'Please Authorise Yourself.'},
        data: {type: Object, default: null}
  },
  computed: {
        open: {
            get: function () {
                return this.options;
            },
            set: function (val) {
                this.$emit('cancel', val);
            }
        }
    },
  name: "AdmninAuth",
  mixins: [commonMixin],
  setup () {
    return {
    }
  },
  data() {
    return {
      client: this.getClient(),
      clientId: this.getClientId(),
      isPwd: true,
      adminPassword:''
    };
  },
  methods: {
    cancel () {
      this.adminPassword = ''
      this.open = false
    },
    authorize() {
      if(this.adminPassword === '' || this.adminPassword === null) {
        this.fail('Password not correct, try again')
        return
      }

      let request= {
        'clientId': this.clientId,
        'adminPassword': this.adminPassword
      }
      AdminAuthService.authorize(request).then(response => {
        let authorization = response;
        if (authorization.authorized ) {
          // window.alert(JSON.stringify(this.data))
          this.$emit('success', this.data)
          this.close()
        } else{
          this.$emit('fail')
          this.fail('Approval failed, please try again')
        }
        // window.alert(authorization.message)
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    },
    close() {
      this.adminPassword = ''
      this.open = false
    }
  }
};
</script>

<style scoped>
.my-input {
}
</style>