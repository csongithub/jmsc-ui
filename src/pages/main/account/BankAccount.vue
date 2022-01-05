/* eslint-disable vue/no-deprecated-slot-scope-attribute */
<template>
    <div>
        <PartyAccount/>
        <q-btn class="q-mt-sm q-mr-sm" 
               color="primary"
               label="Add" 
               size="sm"
               glossy
               @click="openDialog('add')"
               :icon="icons.plus"/>
        <q-btn v-if="selected.length > 0" 
               class="q-mt-sm q-mr-sm "
               color="primary"
               label="Edit"
               size="sm"
               glossy
               @click="openDialog('edit')"
               :icon="icons.edit"/>
         <q-btn round  
                class="q-mt-sm q-mr-sm" 
                color="primary" 
                icon="refresh" 
                size="sm"
                glossy
                 @click="getAccounts()"/>
        <q-table
        class="my-sticky-header-table"
        title="Bank Accounts"
        dense
        bordered
        flat
        :rows="accounts"
        :columns="columns"
        row-key="accountNumber"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        selection="single"
        v-model:selected="selected"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            outlined
            debounce="300"
            v-model="filter"
            placeholder="Search Account"
          >
          <template v-slot:append>
              <q-icon name="search" />
          </template>
          </q-input>
        </template>
      </q-table>

      <q-dialog
        v-model="open"
        persistent
        @before-show="beforeShow"
        @hide="onHide"
        ref="newAccountRef"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar class="bg-primary glossy">
            {{ dialogLabel }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <q-form @submit="addAccount" @reset="reset" class="q-gutter-md">
              <q-input
                dense
                outlined
                v-model="account.accountHolder"
                label="Account Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Account name']"
              />
              <q-input
                dense
                outlined
                v-model="account.accountNumber"
                label="Account Number"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Account number']"
              />
              <q-input
                dense
                outlined
                v-model="account.ifscCode"
                label="IFSC Code"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'IFSC Code']"
              />
              <q-input
                dense
                outlined
                v-model="account.bankName"
                label="Bank"
                full-width
              />
              <q-input
                dense
                outlined
                v-model="account.branchName"
                label="Branch"
                full-width
              />
              <q-input
                dense
                outlined
                v-model="account.branchCode"
                label="Branch Code"
                full-width
              />
              <q-input
                dense
                outlined
                v-model="account.mobileNo"
                label="Mobile"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Registered number']"
              />
              <q-select
                dense
                outlined
                v-model="account.acccountType"
                :options="acccountTypeList"
                label="Account Type"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Account Type i.e saving or current'
                ]"
              />
              <q-select
                dense
                outlined
                v-model="account.status"
                :options="accountStatusList"
                label="Status"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Account status i.e. Active or Inactive'
                ]"
              />
              <div>
                <q-space />
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
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
import BankAccountService from "../../../services/BankAccountService"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { ref } from 'vue'
export default {
  name: 'BankAccounts',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      
      columns: [
        {
          name: "accountHolder",
          required: true,
          label: "Account Name",
          align: "left",
          field: row => row.accountHolder,
          format: val => `${val}`,
          sortable: true
        },
        {name: "accountNumber",  align: "left", label: "Account Number", field: "accountNumber", sortable: true},
        {name: "ifscCode",  align: "left", label: "IFSC Code", field: "ifscCode", sortable: true},
        {name: "bankName",  align: "left", label: "Bank", field: "bankName", sortable: true},
        {name: "branchName",  align: "left", label: "Branch", field: "branchName", sortable: true},
        {name: "mobileNo",  align: "left", label: "Mobile", field: "mobileNo", sortable: true},
        {name: "acccountType",  align: "left", label: "Type", field: "acccountType", sortable: true},
        {name: "status",  align: "left", label: "Status", field: "status", sortable: true},
      ],
      acccountTypeList: ["CURRENT", "SAVING", "Overdraft(OD)"],
      accountStatusList: ["ACTIVE", "INACTIVE"],
      icons: {
        plus: fasPlus,
        edit: fasEdit
      }
    }
  },
  components: {
  },
  created() {},
  mounted() {
   this.getAccounts()
  },
  data() {
    return {
      myPagination: { rowsPerPage: 10 },
      filter: "",
      loading: true,
      accounts: [],
      records:[],
      account: this.newAccount(),
      open: false,
      mode: "add",
      dialogLabel: "New Account"
    };
  },
  methods: {
    newAccount() {
      return {
        accountHolder:'',
        bankName: '',
        branchName: '',
        branchCode:'',
        accountNumber:'',
        ifscCode:'',
        address:'',
        mobileNo:'',
        acccountType:'',
        status:''
      }
    },
    getAccounts() {
      this.loading = true;
      BankAccountService.getAccounts()
        .then(response => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    addAccount() {
      BankAccountService.addAccount(this.account)
        .then(response => {
          if(this.mode === 'add') {
            this.accounts.unshift(response)
            this.success("Account Added Successfully")
          } else if(this.mode === 'edit'){
             this.success("Account Updated Successfully")
          }
          this.$refs.newAccountRef.hide();
      }).catch(err => {
        this.loading = false;
      });
    },
    beforeShow() {},
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialogLabel = "New Account";
      } else if (this.mode === "edit") {
        this.account = this.selected[0];
        this.dialogLabel = "Update Account";
      }
      this.open = true;
    },
    onHide() {
      this.reset();
      this.mode='add'
    },
    reset() {
      this.account = this.newAccount();
    }
  }
};
</script>