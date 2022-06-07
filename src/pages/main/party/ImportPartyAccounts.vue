<template>
   <div>
    <PartyAccount/>
   <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Select file to upload"
        icon="settings"
        :done="step > 1"
      >
        <q-uploader
        :factory="uploadFile"
        style="max-width: 300px"
        label="Upload files"
        square
        flat
        bordered
      />
      </q-step>

      <q-step
        :name="2"
        title="Review"
        icon="create_new_folder"
        :done="step > 2"
      >
      <q-table
        class="my-sticky-header-table"
        title="Review Accounts"
        dense
        bordered
        flat
        :rows="records"
        :columns="columns"
        row-key="accountNumber"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        v-model:selected="selected"
        selection="multiple"
      >
        <template v-slot:top-right>
        <q-btn v-if="selected.length > 0" class="q-mt-sm q-mr-sm text-capitalize"
               color="primary"
               label="Delete" 
               size="sm"
               glossy
               @click="deleteSelected"
              />
          <q-input
            borderless
            dense
            outlined
            size="sm"
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" size="sm"/>
            </template>
          </q-input>
        </template>
      </q-table>
      </q-step>

      <q-step
        :name="3"
        title="Submit"
        icon="add_comment"
      >
        <q-list>
          <q-item v-for="(acc, index) of accounts" v-bind:key="index" clickable v-ripple>
            <q-item-section>{{index}}</q-item-section>
            <q-item-section>{{acc.partyName}}</q-item-section>
            <q-item-section>{{acc.accountHolder}}</q-item-section>
            <q-item-section>{{acc.accountNumber}}</q-item-section>
            <q-item-section>{{acc.ifscCode}}</q-item-section>
            <q-item-section>{{acc.bankName}}</q-item-section>
            <q-item-section>{{acc.branchName}}</q-item-section>
            <q-item-section>{{acc.branchCode}}</q-item-section>
            <q-item-section>{{acc.address}}</q-item-section>
          </q-item>
        </q-list>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn class="text-capitalize" v-if="uploaded && step !== 3" @click="$refs.stepper.next()" color="primary" :label="step === 3 ? 'Finish' : 'Continue'" />
          <q-btn class="text-capitalize" v-if="step === 3 && !importDone" @click="importAccounts" color="primary" :label="step === 3 ? 'Submit' : 'Continue'" />
          <q-btn class="q-ml-sm text-capitalize" v-if="step > 1 && !importDone" flat color="primary" @click="$refs.stepper.previous()" label="Back"/>
          <q-btn class="q-ml-sm text-capitalize" v-if="importDone" flat color="primary" @click="init" label="Done"/>
        </q-stepper-navigation>
      </template>
    </q-stepper>


    <div class="q-gutter-sm" position="absolute">
      
    </div>
  </div>
</template>

<script>
import { commonMixin } from "../../../mixin/common"
import PartyAccountService from "../../../services/PartyAccountService"
import PartyAccount from "../party/PartyAccounts.vue"
import { ref } from 'vue'
export default {
  name: 'PartyAccounts',
  components: {
    PartyAccount
  },
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      step: ref(1)
    }
  },
  created() {},
  mounted() {
   this.init()
  },
  data() {
    return {
      clientId: this.getClientId(),
      uploaded: false,
      filePath: '',
      records:[
            {
              "id": null,
              "partyName": "Particulars",
              "accountHolder": "A/c Holder Name",
              "bankName": "Bank Name",
              "branchName": "BRANCH",
              "branchCode": null,
              "accountNumber": "Account No.",
              "ifscCode": "IFSC Code",
              "address": null
            }],
      columns: [
        {name: "partyName",  align: "left", label: "Account Holder", field: "partyName", sortable: true},
        {name: "accountHolder",  align: "left", label: "Account Holder", field: "accountHolder", sortable: true},
        {name: "accountNumber",  align: "left", label: "Account Number", field: "accountNumber", sortable: true},
        {name: "ifscCode",  align: "left", label: "IFSC Code", field: "ifscCode", sortable: true},
        {name: "bankName",  align: "left", label: "Bank", field: "bankName", sortable: true},
        {name: "branchName",  align: "left", label: "Branch", field: "branchName", sortable: true},
      ],
      myPagination: { rowsPerPage: 20 },
      filter: "",
      loading: true,
      accounts: [],
      importDone: false
    };
  },
  methods: {
    uploadFile(files) {
      PartyAccountService.uploadAccoutns(files)
        .then(response => {
           this.success(response)
           this.filePath = response;
           this.getFileRecords(this.filePath)
           this.uploaded = true
        }).catch(err => {
          files = []
          this.fail(err.message)
        });
    },
    getFileRecords() {
      this.loading = true;
      PartyAccountService.getFileRecords(this.filePath)
        .then(response => {
          this.records.splice(0, this.records.length)
          this.records = response;
          console.log(JSON.stringify(this.records))
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
    },
    importAccounts() {
       this.accounts.splice(0, this.accounts.length)
      for(let account of this.records) {
        account.clientId = this.clientId
        PartyAccountService.addAccount(account)
        .then(response => {
          this.accounts.unshift(response)
        }).catch(err => {
        });
      }
      this.importDone = true
    },
    init() {
      this.loading = true
      this.importDone = false
      this.accounts.splice(0, this.accounts.length)
      this.records.splice(0, this.records.length)
    },
    deleteSelected() {
      window.alert(JSON.stringify(this.selected[0]))
      for(let acc of this.selected) {
         this.removeByAttr(this.records, 'accountNumber', acc.accountNumber);
      }
    },
    removeByAttr(arr, attr, value) {
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 
           arr.splice(i,1);
       }
    }
    return arr;
    }
  }
};
</script>
