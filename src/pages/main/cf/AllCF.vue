<template>
    <div>
    <CreditFacility/>
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
                 @click="getAllFacilities()"/>
        <q-table
        class="my-sticky-header-table"
        title="All CF"
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
        @hide="closeDialog"
        ref="nefCfRef"
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
            <q-form @submit="addNewFacility" @reset="reset" class="q-gutter-md">
              <q-select
                dense
                outlined
                v-model="creditFacility.facilityType"
                :options="facilityList"
                label="Facility Type"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Facility Type i.e BG/FD or NSC'
                ]"
              />
              <q-select v-if="creditFacility.facilityType === 'BG' || creditFacility.facilityType === 'FD'"
                dense
                outlined
                v-model="creditFacility.issuerName"
                :options="banks"
                label="Issuer Name"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Enter Issuer Name'
                ]"
              />

              <q-select v-if="creditFacility.facilityType === 'BG' || creditFacility.facilityType === 'FD'"
                dense
                outlined
                v-model="creditFacility.issuerBranch"
                :options="branches"
                label="Branch Name"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Enter Branch Name'
                ]"
              />

              <q-input v-if="creditFacility.facilityType === 'NSC'"
                dense
                outlined
                disable
                 v-model="postOfficeLabel"
                label="Issuer Name"
                full-width
              />

              <q-select v-if="creditFacility.facilityType === 'NSC'"
                dense
                outlined
                v-model="creditFacility.issuerBranch"
                :options="postOffice"
                label="Branch Name"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Enter Branch Name'
                ]"
              />
              
              <q-input
                dense
                outlined
                v-model="creditFacility.accountNumber"
                label="Account Number"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Account number']"
              />
              <q-input
                dense
                outlined
                v-model="creditFacility.amount"
                label="Amount"
                type="number"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Amount']"
              />

              <div class="row">
                <div class="col q-mr-md">
                  <q-input filled v-model="creditFacility.openDate" :rules="['YYYY-MM-DD']"  label="Open Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="creditFacility.openDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>

                <div class="col">
                  <q-input filled v-model="creditFacility.maturityDate" :rules="['YYYY-MM-DD']" label="Maturity Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="creditFacility.maturityDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
              </div>

        
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

import CreditFacilityService from "../../../services/CreditFacilityService"
import CreditFacility from "../cf/CreditFacility.vue"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { ref } from 'vue'
export default {
  name: 'AllCF',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      columns: [
        {name: "facilityType",  align: "left", label: "Type", field: "facilityType", sortable: true},
        {
          name: "accountNumber",
          required: true,
          label: "Account No",
          align: "left",
          field: row => row.accountNumber,
          format: val => `${val}`,
          sortable: true
        },
        {name: "amount",  align: "left", label: "Amount", field: "amount", sortable: true},
        {name: "openDate",  align: "left", label: "Open Date", field: "openDate", sortable: true},
        {name: "maturityDate",  align: "left", label: "Maturity Date", field: "maturityDate", sortable: true},
        {name: "issuerType",  align: "left", label: "Issuer", field: "issuerType", sortable: true},
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true},
        {name: "isPledged",  align: "left", label: "Pledged", field: "isPledged", sortable: true},
        {name: "pledgedType",  align: "left", label: "Pledged As", field: "pledgedType", sortable: true},
        
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit
      }
    }
  },
  components: {
    CreditFacility,
  },
  created() {},
  mounted() {
    this.init()
    this.getAllFacilities()
  },
  data() {
    return {
      clientId: this.getClientId(),
      myPagination: { rowsPerPage: 15 },
      filter: '',
      loading: true,
      accounts: [],
      open: false,
      mode: 'add',
      dialogLabel: 'New Facility',
      creditFacility: this.newFacility(),
      facilityList: ['BG', 'FD', 'NSC'],
      banks: [],
      branches: [],
      postOfficeLabel: 'Post Office',
      postOffice: []
    };
  },
  methods: {
    init() {
      this.getBanks()
      this.getBranches()
      this.getPostOffice()
    },
    getBanks() {
      CreditFacilityService.getBanks()
        .then(response => {
        this.banks.splice(0, this.banks.length)
        this.banks = response;
      }).catch(err => {
        this.loading = false;
      });
    },
    getBranches() {
      CreditFacilityService.getBranches()
        .then(response => {
        this.branches.splice(0, this.branches.length)
        this.branches = response;
      }).catch(err => {
        this.loading = false;
      });
    },
    getPostOffice() {
      CreditFacilityService.getPostOffice()
        .then(response => {
        this.postOffice.splice(0, this.postOffice.length)
        this.postOffice = response;
      }).catch(err => {
        this.loading = false;
      });
    },
    newFacility(){
      return {
        accountNumber: null,
        amount: null,
        openDate: ref(this.getTodaysDate()),
        maturityDate: ref(this.getTodaysDate()),
        issuerType: null,
        issuerName: null,
        issuerBranch: null,
        facilityType: null,
        isPledged: null,
        pledgedId: null,
        pledgedType: null
      }
    },

    getAllFacilities() {
      this.loading = true;
      CreditFacilityService.getAllFacilities(this.clientId)
        .then(response => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === 'add') {
        this.dialogLabel = 'New Facility'
      } else if (this.mode === 'edit') {
        this.creditFacility = this.selected[0]
        // window.prompt(JSON.stringify(this.creditFacility))
        this.creditFacility.amount = parseInt(this.creditFacility.amount)
        this.dialogLabel = 'Update Facility'
      }
      this.open = true
    },
    closeDialog() {
      this.open = false
      this.reset()
    },
    reset() {
     this.creditFacility = this.newFacility()
    },
    addNewFacility() {
      // window.prompt(JSON.stringify(this.creditFacility))
      this.creditFacility.clientId = this.clientId
      this.creditFacility.isPledged = false
      if(this.creditFacility.facilityType === 'NSC') {
        this.creditFacility.issuerType = 'PO'
        this.creditFacility.issuerName = 'Post Office'
      } else {
         this.creditFacility.issuerType = 'BANK'
      }
      CreditFacilityService.addCreditFacility(this.creditFacility)
        .then(response => {
        if(this.mode === 'add') {
            this.accounts.unshift(response)
            this.success('CF Added Successfully')
          } else if(this.mode === 'edit'){
             this.success('CF Updated Successfully')
          }
          this.closeDialog()
          this.reset()
      }).catch(err => {
       this.fail(this.getErrorMessage(err))
      });
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
    }
  }
};
</script>