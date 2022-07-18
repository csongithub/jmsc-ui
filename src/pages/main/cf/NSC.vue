<template>
    <div>
    <CreditFacility/>
        <q-table
        class="my-sticky-header-table"
        title="NSC"
        dense
        bordered
        flat
        :rows="accounts"
        :columns="columns"
        row-key="accountNumber"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        selection="multiple"
        v-model:selected="selected"
      >
        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <div>
              <q-icon :name="icons.rupee"/>
              {{props.row.amount.toLocaleString('en-IN') + '0.00'}}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div v-if="props.row.status === 'ALIVE'" class="text-green text-overline">
              {{props.row.status}}
            </div>
            <div v-else-if="props.row.status === 'EXPIRED'" class="text-warning text-overline">
              {{props.row.status}}
            </div>
            <div v-else-if="props.row.status === 'CLOSED'" class="text-red text-overline">
              {{props.row.status}}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" v-if="props.row.status !== 'CLOSED'">
            <q-btn v-if="props.row.isLien" class="text-capitalize" outline color="primary" label="View" size="xs" @click="openLinkageDetail(props.row)">
              <q-tooltip>View linkage or hold details </q-tooltip>
            </q-btn>
            <q-btn v-else class="text-capitalize" color="red" outline  size="xs" :icon="icons.close" @click="confirmClose(props.row)">
              <q-tooltip>Close this facility</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:top-left>
         <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
                outline
                color="primary" 
                icon="refresh" 
                label="Refresh"
                size="sm"
                glossy
                @click="!showClosed ? getAllActiveNSCs() : getAllClosedNSCs()"/>
          <q-checkbox class="q-mr-sm" v-model="showClosed" label="Show Closed" color="primary" @click="toggelShowAll()">
            <q-tooltip>Show all closed/terminated NSC</q-tooltip>
          </q-checkbox>
        </template>
        <template v-slot:top-right>
          <q-bar v-if="selectedSum > 0"  class="bg-primary text-white q-mr-md text-weight-light shadow-4">
            <div >
              <q-icon :name="icons.rupee"/>
                {{selectedSum.toLocaleString('en-IN') + '.00'}}
            </div>
             <q-tooltip 
                  transition-show="scale"  
                  transition-hide="scale" 
                  class="bg-primary text-white shadow-4">
                  {{inWords()}}
              </q-tooltip>
          </q-bar>
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
    </div>
    <AdminAuth :options="openAuthorization" 
               :title="authTitle"
               :message="authMessage"
               :data="authData"
               @cancel="cancelAuth"
               @success="closeFacility"></AdminAuth>
</template>

<script>

import AdminAuth from "../../auth/AdminAuth.vue"
import PaymentService from "../../../services/PaymentService"
import CreditFacilityService from "../../../services/CreditFacilityService"
import CreditFacility from "../cf/CreditFacility.vue"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import {matClose, matCurrencyRupee} from "@quasar/extras/material-icons";
import { ref } from 'vue'
import { date } from 'quasar'
export default {
  name: 'NSC',
  mixins: [commonMixin],
  watch: {
    selected(selected) {
      this.selectedSum = 0
      if(selected.length > 0) {
        for(let cf of selected) {
          this.selectedSum = this.selectedSum + cf.amount
        }
        this.inWords()
      }
    }
  },
  setup () {
    return {
      selected: ref([]),
      showClosed: ref(false),
      columns: [
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
        {
          name: "openDate",
          align: "left",
          label: "Open Date",
          field: "openDate",
          sortable: true
        },
        {
          name: "maturityDate",
          align: "left", label:
          "Maturity Date",
          field: "maturityDate",
          sortable: true
        },
        {name: "issuerType",  align: "left", label: "Issuer", field: "issuerType", sortable: true},
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true},
        {name: "status",  align: "left", label: "Status", field: "status", sortable: true},
        {name: "actions",  align: "left", label: "Actions", field: "actions", sortable: true}
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        close: matClose,
        rupee: matCurrencyRupee
      }
    }
  },
  components: {
    CreditFacility,
    AdminAuth
  },
  created() {},
  mounted() {
    this.getAllActiveNSCs()
  },
  data() {
    return {
      clientId: this.getClientId(),
      openAuthorization: false,
      authTitle: '',
      authMessage: '',
      authData: null,
      myPagination: { rowsPerPage: 15 },
      filter: "",
      loading: true,
      accounts: [],
      account: [],
      open: false,
      mode: "add",
      dialogLabel: "New Facility",
      selectedSum: 0
    };
  },
  methods: {
    inWords() {
      let words = ''
        if(this.selectedSum > 0)
            words =  'Rupees ' + PaymentService.convertNumberToWords(this.selectedSum) + 'Only'
        else
            words = 'Sum of all selected facilities'
      // window.prompt(JSON.stringify(words))
      return words;
    },
    toggelShowAll(){
      if(!this.showClosed){
         this.getAllActiveNSCs()
      } else{
        this.getAllClosedNSCs()
      }
    },
    getAllActiveNSCs() {
      this.loading = true;
      CreditFacilityService.getAllActiveFacilitiesByType(this.clientId, 'NSC')
        .then(response => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    getAllClosedNSCs() {
      this.loading = true;
      CreditFacilityService.getAllClosedFacilitiesByType(this.clientId, 'NSC')
        .then(response => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    openLinkageDetail(row) {
      console.log(JSON.stringify(row.id))
      this.$router.push({ name: "cfLinkageDetails", params: { facilityId: row.id, parent: 'NSC'}});
    },
    confirmClose(cf) {
      this.openAuth('Are you sure?', 
                    'This facility will be closed permanently & you will not be able to open it again.',
                    true,
                    cf)
    },
    openAuth(title, message, options, cf){
      this.authTitle = title,
      this.authMessage = message
      this.openAuthorization = options
      this.authData = cf
    },
    cancelAuth(val) {
      this.openAuthorization = val
    },
    closeFacility(cf) {
      CreditFacilityService.closeFacility(this.clientId, cf.id)
        .then(response => {
        if(response) {
          this.success('The credit facility has been closed')
        }
        this.getAllActiveNSCs()
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    }
  }
};
</script>