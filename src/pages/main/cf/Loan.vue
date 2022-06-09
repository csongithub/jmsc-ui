<template>
<div>
  <div class="row bg-primary text-white">
    <span class="text-subtitle2 q-ml-md">Loans</span>
  </div>
  <q-table class="my-sticky-header-table"
          :grid="grid"
          :hide-header="grid"
          dense
          bordered
          flat
          :rows="loans"
          :columns="columns"
          :visible-columns="visibleColumns"
          row-key="accountNo"
          :loading="loading"
          :pagination="pagination"
          :filter="filter"
      >
        <template v-slot:top-left>
          <q-btn class="q-mt-sm q-mr-sm text-capitalize" color="primary" label="New Loan" 
               size="sm" glossy @click="openDialog('add')" :icon="icons.plus"/>
          
          <q-btn class="q-mt-sm q-mr-sm text-capitalize" outline color="primary" size="sm"
                glossy label="Refresh" icon="refresh" @click="allLoans()"/>
        </template>
        <template v-slot:top-right>
          <q-btn class="q-mr-sm" flat round color="primary"
            :icon="grid ? icons.list : icons.grid" @click="grid = !grid">
            <q-tooltip>Change View</q-tooltip>
          </q-btn>
          <q-input class="q-mr-sm" borderless dense outlined debounce="300" v-model="filter" placeholder="Search Loan">
            <template v-slot:append><q-icon name="search" /></template>
            <q-tooltip>Serch Loan</q-tooltip>
          </q-input>
          <q-space />
          <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            options-cover
            style="min-width: 150px"
          >
          <q-tooltip>Select/Remove Columns</q-tooltip>
          </q-select>
        </template>
        <template v-slot:body-cell-collaterals="props">
            <q-td :props="props">
                <div class="pointer">
                    <q-btn class="" size="sm" color="primary" flat :icon="icons.link">
                        <q-tooltip>Link collaterals</q-tooltip>
                    </q-btn>
                    <q-btn class="" size="sm" color="primary" flat :icon="icons.eye">
                        <q-tooltip>Open Collaterals Details</q-tooltip>
                    </q-btn> 
                </div>
            </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <div class="pointer">
                    <q-btn class="" size="sm" color="primary" flat :icon="icons.edit">
                        <q-tooltip>Update Loan</q-tooltip>
                    </q-btn>
                </div>
            </q-td>
        </template>
  </q-table>
</div>
</template>

<script>
import { fasTh, fasList, fasEye} from "@quasar/extras/fontawesome-v5";
import {matAdd, matRefresh, matCurrencyRupee, matLink, matOpenInBrowser, matEdit} from "@quasar/extras/material-icons";
import LoanService from "../../../services/LoanService"
import { commonMixin } from "../../../mixin/common"
import { date } from 'quasar'
import { ref } from 'vue'
export default {
  name: 'Loans',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      icons: {
        plus: matAdd,
        reload: matRefresh,
        grid: fasTh,
        list: fasList,
        rupee: matCurrencyRupee,
        link:matLink,
        eye: matOpenInBrowser,
        edit:matEdit
      },
      visibleColumns: ref(['displayName', 'accountNo', 'borrower', 'sanctionedAmount', 'emiAmount', 'openingDate', 'collaterals']),
      columns: [
        { name: "displayName", required: true, label: "Name", align: "left", 
          field: "displayName", format: val => `${val}`, sortable: true,
        },
        { name: "accountNo", required: true, label: "A/C No", align: "left", 
          field: row => row.accountNo, format: val => `${val}`, sortable: true,
        },
        { name: "borrower", required: true, label: "Borrower", align: "left", sortable: true,
          field: "borrower",  format: val => `${val}`
        },
        { name: "sanctionedAmount", required: true, label: "Sanctioned Value", align: "left", sortable: true,
          field: "sanctionedAmount",  format: val => val ? val.toLocaleString('en-IN') : 0
        },
        { name: "disbursedAmount", label: "Disbursed Value", align: "left", sortable: true,
          field: "disbursedAmount",  format: val => val ? val.toLocaleString('en-IN') : 0
        },
        { name: "emiAmount", required: true, label: "EMI", align: "left", sortable: true,
          field: "emiAmount",  format: val => val ? val.toLocaleString('en-IN') : 0
        },
        { name: "interestRate", label: "Rate(% Yearly)", align: "left", sortable: true,
          field: "interestRate",  format: val => `${val}`
        },
        { name: "openingDate", required: true, label: "Open Date", align: "left", sortable: true,
          field: "openingDate",  format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        { name: "bankName", label: "Bank", align: "left", sortable: true,
          field: "bankName",  format: val => `${val}`
        },
        { name: "branch", label: "Branch", align: "left", sortable: true,
          field: "branch",  format: val => `${val}`
        },
        { name: "status", label: "Status", align: "left", sortable: true,
          field: "status",  format: val => `${val}`
        },
        { name: "collaterals", label: "Collateral", required: true, align: "center",
          field: "collaterals",  format: val => `${val}`
        },
        { name: "actions", label: "", required: true, align: "center",
          field: "actions",  format: val => `${val}`
        }
      ]
    }
  },
  watch: {
  },
  created() {},
  mounted() {
    this.allLoans()
  },
  data() {
    return {
      clientId: this.getClientId(),
      pagination:  { rowsPerPage: 10 },
      filter: "",
      grid: false,
      loans: [],
      loading: false,
      mode: "add",
      dialogLabel: "Create New Loan",
      loan: this.newLoan()
    };
  },
  methods: {
    newLoan () {
      return {
        groupName: '',
        groupInfo: '',
        groupLimit: 0
      }
    },
    allLoans() {
      this.loading = true;
      LoanService.all(this.clientId)
        .then(response => {
        this.loans.splice(0, this.loans.length)
        this.loans = response
        console.log(JSON.stringify(this.loans))
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        this.fail(this.getErrorMessage(err))
      });
    },
    openDialog(mode) {
      
    },
    closeDialog() {
      this.open = false
    },
    onHide() {
      this.reset();
      this.mode='add'
    },
    reset() {
      this.loan = this.newLoan();
    },
    getLinkedCollaterals() {

    }
  }
};
</script>
<style>
.pointer {
  cursor: pointer;
}
</style>