<template>
    <div>
        <PartyAccount/>
        <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="Add" 
               size="sm"
               glossy  
               @click="openDialog('add')"
               :icon="icons.plus"/>
        <!-- <q-btn v-if="selected.length > 0" 
               class="q-mt-sm q-mr-sm "
               color="primary"
               label="Edit"
               size="sm"
               glossy
               @click="openDialog('edit')"
               :icon="icons.edit"/> -->
         <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
                outline
                color="primary" 
                size="sm"
                label="Refresh"
                icon="refresh" 
                @click="getPartyAccounts()"/>
        <q-table
        class="my-sticky-header-table q-mt-sm"
        title="Party Accounts"
        dense
        bordered
        flat
        :rows="accounts"
        :columns="columns"
        row-key="partyName"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        v-model:selected="selected"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="pointer">
               <q-icon color="primary" :name="icons.edit" @click="editAccount(props.row)"/>
               <!-- <q-icon class="q-ml-sm" :name="icons.delete" color="red"/> -->
            </div>
          </q-td>
        </template>
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
            <q-form @submit="addPartyAccount" @reset="reset" class="q-gutter-md">
              <q-input
                dense
                outlined
                v-model="account.partyName"
                label="Party Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Party name']"
              />
              <q-input
                dense
                outlined
                v-model="account.accountHolder"
                label="Account Holder"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Account holder name']"
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
import PartyAccountService from "../../../services/PartyAccountService"
import PartyAccount from "../party/PartyAccounts.vue"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit, fasTrash } from "@quasar/extras/fontawesome-v5";
import { ref } from 'vue'
export default {
  name: 'PartyAccounts',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      columns: [
        {
          name: "partyName",
          required: true,
          label: "Party Name",
          align: "left",
          field: row => row.partyName,
          format: val => `${val}`,
          sortable: true
        },
        {name: "accountHolder",  align: "left", label: "Account Holder", field: "accountHolder", sortable: true},
        {name: "accountNumber",  align: "left", label: "Account Number", field: "accountNumber", sortable: true},
        {name: "ifscCode",  align: "left", label: "IFSC Code", field: "ifscCode", sortable: true},
        {name: "bankName",  align: "left", label: "Bank", field: "bankName", sortable: true},
        {name: "branchName",  align: "left", label: "Branch", field: "branchName", sortable: true},
        {
          name: "actions",
          required: false,
          label: "Actions",
          align: "left",
          field: "actions",
          format: val => `${val}`,
        }
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        delete: fasTrash
      }
    }
  },
  components: {
    PartyAccount
  },
  created() {},
  mounted() {
   this.getPartyAccounts()
  },
  data() {
    return {
      clientId: this.getClientId(),
      myPagination: { rowsPerPage: 15 },
      filter: "",
      loading: true,
      accounts: [],
      account: this.newAccount(),
      open: false,
      mode: "add",
      dialogLabel: "New Account"
    };
  },
  methods: {
    newAccount() {
      return {
        clientId: this.clientId,
        partyName: '',
        accountHolder:'',
        bankName: '',
        branchName: '',
        branchCode:'',
        accountNumber:'',
        ifscCode:'',
        address:'',
        update: false
      }
    },
    getPartyAccounts() {
      this.loading = true;
      PartyAccountService.getPartyAccounts(this.clientId)
        .then(response => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    addPartyAccount() {
      this.account.clientId = this.clientId
      PartyAccountService.addPartyAccount(this.account)
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
        this.fail(this.getErrorMessage(err))
      });
    },
    beforeShow() {},
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialogLabel = "New Account";
        console.log(JSON.stringify(this.account))
      } else if (this.mode === "edit") {
        this.account = this.selected[0];
        console.log(JSON.stringify(this.account))
        this.dialogLabel = "Update Account";
      }
      this.open = true;
    },
    editAccount(row){
      console.log(JSON.stringify(row))
      this.account = row
      console.log(JSON.stringify(this.account))
      this.dialogLabel = "Update Account";
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

<style>
.pointer {
  cursor: pointer;
}
</style>
