/* eslint-disable vue/no-deprecated-slot-scope-attribute */
<template>
    <div>
      <q-table
        class="my-sticky-header-table"
        dense
        bordered
        flat
        :rows="accounts"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :filter="filter"
        selection="single"
        v-model:selected="selected">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:top-left>
          <q-btn  
            class="q-mt-sm q-mr-sm text-capitalize" 
            color="primary"
            label="Add" 
            size="sm"
            glossy
            @click="openDialog('add')"
            :icon="icons.plus"/>
          <q-btn
            class="q-mt-sm q-mr-sm text-capitalize"
            outline
            color="primary"
            icon="refresh"
            label="Refresh"
            size="sm"
            glossy
            @click="getAllAccounts()"
        />
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            outlined
            debounce="300"
            v-model="filter"
            placeholder="Search Accounts"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="primary"
                round
                dense
                flat
                @click="expandAccount(props)"
                :icon="props.expand ? icons.expendLess : icons.expendMore"
              >
                <q-tooltip v-if="!props.expand" :delay="1000">Open details</q-tooltip>
                <q-tooltip v-if="props.expand" :delay="1000">Hide details</q-tooltip>
              </q-btn>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <span v-if="col.value !== 'undefined'">
                <span>{{ col.value }}</span>
                <q-icon @click="copyURL(col.value)" style="cursor: pointer" class="q-ml-sm" v-if="col.name === 'url'" :name="icons.copy">
                  <q-tooltip>Copy to clipboard</q-tooltip>
                </q-icon>
              </span>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <q-card>
                <q-card-section v-if="isNotNullOrUndefined(props.row)">
                  <div class="row row_attr" v-for="(attr,index) in props.row.attributes" :key="index">
                    <div class="col-3">{{attr.name}}</div>
                    <div class="col-3 q-pa-xs">{{attr.value}}</div>
                  </div>
                  <q-btn @click="adminApproval(props.row, 'view')" class="text-capitalize q-mt-lg q-mr-sm" size="sm" color="primary" label="View As Admin" dense outline/>
                  <q-btn @click="adminApproval(props.row, 'update')" class="text-capitalize q-mt-lg q-mr-sm" size="sm" color="primary" label="Update" dense outline/>
                  <q-btn @click="adminApproval(props.row, 'remove')" class="text-capitalize q-mt-lg" size="sm" color="primary" label="Delete" dense outline/>
                </q-card-section>
              </q-card>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      
      <q-dialog
            v-model="open"
            persistent
            @hide="onHide"
            ref="newAccountRef">
            <q-card style="width: 900px; max-width: 80vw;">
                <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
                    {{ dialogLabel }}
                    <q-space />
                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>

          <q-card-section>
            <q-form @submit="addAccount" @reset="reset" class="q-gutter-md">
              <div class="row">
                <div class="col-4 q-mr-sm">
                    <q-input
                        dense
                        outlined
                        v-model="account.name"
                        label="Account Name"
                        full-width
                        lazy-rules
                        :rules="[val => (val && val.length > 0) || 'Enter Account name']"
                    />
                </div>
                <div class="col-7">
                    <q-input
                        dense
                        outlined
                        v-model="account.url"
                        label="URL"
                        full-width
                        lazy-rules
                        :rules="[val => (val && val.length > 0) || 'Enter Web URL']"
                    />
                </div>
              </div>
              <q-separator/>
              <div class="row text-bold text-u">
                Account Attributes
              </div>
              <div>
                    <div class="row" v-for="(attr,index) in attributes" :key="index">
                        <div class="col-3 q-mr-md">
                              <q-input dense v-model="attr.name" label="Name" />
                        </div>
                        <div class="col-3 q-mr-md">
                              <q-input dense v-model="attr.value" label="Value" />
                        </div>
                        <div class="col-3 q-mr-md">
                            <q-select dense v-model="attr.type" :options="attrTypes" label="Type"/>
                        </div>
                        <div class="col-1">
                            <q-btn  label="Remove" class="text-red text-capitalize" size="sm" @click="removeAttr(index)"/>
                        </div>
                    </div>
              </div> 
              <div class="row">
                <q-btn :icon="icons.plus" outline label="Add Attribute" class="text-capitalize" size="sm" @click="addAttr"/>
              </div>

              
              
              <div>
                <q-btn
                  dense
                  glossy
                  size="sm"
                  :label="mode === 'add' ? 'Add' : 'Update'"
                  type="submit"
                  color="primary"
                  class="text-capitalize q-px-md"
                />

                <q-btn
                  v-if="mode === 'add'"
                  dense
                  glossy
                  size="sm"
                  label="Reset"
                  type="reset"
                  class="text-capitalize q-px-md q-mx-sm"
                  @click="saveAccount"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog
        v-model="view_all_attr"
        persistent
        @hide="onHideView"
        ref="viewAllRef">
          <q-card style="width: 900px; max-width: 80vw;">
            <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
              {{ 'Account Admin View' }}
              <q-space />
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip>Close</q-tooltip>
              </q-btn>
            </q-bar>
            <q-card-section>
              <!-- {{JSON.stringify(fetched_account)}} -->
              <q-card-section>
                  <div class="row">
                    <div class="col-4 text-url text-black text-bold">
                      {{fetched_account.name}}
                    </div>
                    <div class="col-8">
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-4 text-url text-weight-light">
                      {{fetched_account.url}}
                    </div>
                    <div class="col-8">
                    </div>
                  </div>

                  <q-separator/>                
  
                  <div class="row q-mt-md text-bold">
                     Account Attributes
                  </div>
                  <div class="row row_attr" v-for="(attr,index) in fetched_account.attributes" :key="index">
                    <div class="col-3 q-pa-xs">{{attr.name}}</div>
                    <div class="col q-pa-xs">{{attr.value}}</div>
                  </div>
                </q-card-section>
            </q-card-section>
          </q-card>
        </q-dialog>
    </div>
    <AdminAuth
    :options="openAuthorization"
    :title="authTitle"
    :message="authMessage"
    :data="authData"
    :actionLabel="actionLabel"
    @cancel="cancelAuth"
    @success="postApproval"
  ></AdminAuth>
</template>

<script>
import AdminAuth from "../../auth/AdminAuth"
import AccountService from "../../../services/WebAccountService"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import {
  matExpandMore,
  matExpandLess,
  matFileCopy
} from "@quasar/extras/material-icons";
import { ref } from 'vue'
export default {
  name: 'BankAccounts',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        expendMore: matExpandMore,
        expendLess: matExpandLess,
        copy:matFileCopy
      },
      columns: [
        {
          name: "name",
          align: "left",
          label: "Account Name",
          field: "name",
          sortable: true,
        },
        {
          name: "url",
          align: "left",
          label: "Web Url",
          field: "url",
          sortable: true,
        },
      ],
    }
  },
  components: {
    AdminAuth
  },
  created() {},
  mounted() {
    this.getAllAccounts()
  },
  data() {
    return {
      client_id: this.getClientId(),
      pagination: { rowsPerPage: 15 },
      filter: "",
      loading: false,
      mode: 'add',
      open: false,
      dialogLabel: "New Account",
      accounts: [],
      account: this.newAccount(),
      attributes: [],
      attrTypes: ['Normal', 'Encrypt'],
      view_all_attr: false,
      fetched_account: {},
      openAuthorization: false,
      authTitle:'Approve',
      authMessage: 'Please enter the admin password',
      approval_mode:'view',
      authData: null,
      actionLabel: 'Approve',
    };
  },
  methods: {
    async copyURL(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
         this.$q.notify({
          type: 'info',
          message: 'URL copied to clipboard',
          timeout: 500
        })
      } catch($e) {
        alert('Cannot copy');
      }
    },
    adminApproval(payload, approval_mode) {
      this.approval_mode = approval_mode;
      this.openAuth(
        "Approve",
        "Please enter the admin password",
        true,
        payload,
        "Approve"
      );
    },
    openAuth(title, message, options, data, actionLabel) {
      this.authTitle = title
      this.authMessage = message
      this.openAuthorization = options
      this.authData = data
      this.actionLabel = actionLabel
    },
    cancelAuth(val) {
      this.openAuthorization = val;
    },
    postApproval(payload) {
      if (this.approval_mode === "view") {
        this.getAccount(payload.id);
      } else if (this.approval_mode === "update") {
        this.updateAccount(payload.id);
      } else if (this.approval_mode === "remove") {
        this.removeAccount(payload.id);
      }
    },
    removeAccount(id) {
      AccountService.removeAccount(this.client_id, id)
        .then(response => {
          if(response) {
            this.success('Accunt deleted successfully')
          }
          this.getAllAccounts()
      }).catch(err => {
        this.loading = false;
        this.fail(this.getErrorMessage(err))
      });
    },
    updateAccount(id) {
      AccountService.getAccount(this.client_id, id)
        .then(response => {
          this.account = response
          this.attributes = this.account.attributes
          this.dialogLabel = "Update Account";
          this.mode = 'edit'
          this.open = true;
      }).catch(err => {
        this.loading = false;
        this.fail(this.getErrorMessage(err))
      });
    },
    getAccount(id) {
      AccountService.getAccount(this.client_id, id)
        .then(response => {
          this.fetched_account = response
          this.view_all_attr = true
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    },
    onHideView(){
      this.fetched_account = {}
      this.view_all_attr = false
    },
    expandAccount(props) {
      console.log(JSON.stringify(props.row));
      props.expand = !props.expand;
    },
    getAllAccounts(){
      this.loading = true
      AccountService.getAllAccounts(this.client_id)
        .then(response => {
          this.accounts = response
          this.loading = false
      }).catch(err => {
        this.loading = false;
        this.fail(this.getErrorMessage(err))
      });
    },
    newAccount() {
        return {
            name: null,
            url: null
        }
    },
    openDialog(mode) {
      this.attributes = []
      this.mode = mode;
      if (this.mode === "add") {
        this.dialogLabel = "New Web Account";
      }
      this.open = true;
    },
    onHide() {
      this.open = false;
      this.attributes = []
      this.account = this.newAccount()
    },
    addAttr() {
        let attr = {
            name: '',
            value:'',
            type:'Normal'
        }
        this.attributes.push(attr)
    },
    removeAttr(index){
        this.attributes.splice(index,1)
    },
    addAccount() {
      this.account.client_id = this.client_id
      this.account.attributes = this.attributes
      console.log(JSON.stringify(this.account))
      AccountService.createOrUpdate(this.account)
        .then(response => {
          if(this.mode === 'add') {
            this.accounts.unshift(response)
            this.success("Account Added Successfully")
          } else if(this.mode === 'edit'){
             this.success("Account Updated Successfully")
          }
          this.open = false
          this.getAllAccounts()
      }).catch(err => {
        this.loading = false;
        this.fail(this.getErrorMessage(err))
      });
    },
    reset() {

    }
  }
};
</script>

<style lang="sass" scoped>
.row_attr > div

  border: 1px solid black
</style>