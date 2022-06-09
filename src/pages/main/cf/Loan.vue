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
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn color="primary" flat dense @click="toggleExpand(props)" :icon="props.expand ? icons.expendLess : icons.expendMore">
                <q-tooltip v-if="!props.expand">Expand Collaterals Details</q-tooltip>
                <q-tooltip v-else-if="props.expand">Collaps Collaterals Details</q-tooltip>
              </q-btn>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <span v-if="col.value !== 'undefined'"> <q-icon v-if="col.currency" :name="icons.rupee"/> {{ col.value }}</span>
              <div v-else class="pointer">
                    <q-btn class="q-pa-xs" size="xs" color="primary" flat :icon="icons.link">
                        <q-tooltip>Link collaterals</q-tooltip>
                    </q-btn>
                    <q-btn class="q-pa-xs" size="xs" color="primary" flat :icon="icons.edit" @click="openDialog('edit',props.row)">
                        <q-tooltip>Update Loan</q-tooltip>
                    </q-btn>
                    <q-btn class="q-pa-xs" size="xs" color="red" flat :icon="icons.delete">
                        <q-tooltip>Delete Loan</q-tooltip>
                    </q-btn> 
                </div>
              
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">This is expand slot for row above: {{ props.row.displayName }}.</div>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top-left>
          <q-btn class="q-mt-sm q-mr-sm text-capitalize" color="primary" label="New Loan" 
               size="sm" glossy @click="openDialog('add', null)" :icon="icons.plus"/>
          
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
  </q-table>
  <q-dialog v-model="open"
                    persistent
                    @hide="onHide"
                    ref="newGroupRef">
    <q-card style="width: 1000px; max-width: 80vw;">
      <q-bar class="bg-primary glossy">
            {{ dialogLabel }}
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-form @submit="addLoan" @reset="reset" class="q-gutter-md">
              <q-input
                dense
                outlined
                v-model="loan.accountNo"
                label="Account Number"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Account Number']"
              />
              <q-input
                dense
                outlined
                v-model="loan.displayName"
                label="Loan Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter a Display Name']"
              />
              <q-input
                type="number"
                dense
                outlined
                v-model="loan.sanctionedAmount"
                label="Sanctioned Amount"
                full-width
                lazy-rules
                :rules="[val => (val && val > 0) || 'Enter Sanctioned Amount']"
              />
              <q-input
                type="number"
                dense
                outlined
                v-model="loan.disbursedAmount"
                label="Disbursed Amount"
                full-width
                lazy-rules
                :rules="[val => (val && val > 0) || 'Enter Disbured Amount']"
              />
              <q-input
                type="number"
                dense
                outlined
                v-model="loan.emiAmount"
                label="Monthly EMI"
                full-width
                lazy-rules
                :rules="[val => (val && val > 0) || 'Enter Monthly EMI']"
              />
              <q-input
                type="number"
                dense
                outlined
                v-model="loan.interestRate"
                label="Interest Rate"
                full-width
                lazy-rules
                :rules="[val => (val && val > 0) || 'Enter Interest Rate']"
              />
              <div class="col q-mr-md">
                <q-input filled v-model="loan.openingDate" :rules="['YYYY-MM-DD']"  label="Open Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="loan.openingDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn class="text-capitalize" v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-input
                dense
                outlined
                v-model="loan.bankName"
                label="Bank"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Bank Name']"
              />
              <q-input
                dense
                outlined
                v-model="loan.branch"
                label="Branch"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Branch Name']"
              />
              <q-input
                dense
                outlined
                v-model="loan.borrower"
                label="Borrower"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Borrower Name']"
              />
              <q-select
                dense
                outlined
                v-model="loan.status"
                :options="loanStatusOptions"
                label="Status"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Select Loan Status'
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
import { fasTh, fasList,} from "@quasar/extras/fontawesome-v5";
import {matAdd, matRefresh, matCurrencyRupee, matLink, matEdit, matDelete, matExpandMore, matExpandLess} from "@quasar/extras/material-icons";
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
        edit:matEdit,
        delete: matDelete,
        expendMore:matExpandMore,
        expendLess:matExpandLess
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
          field: "sanctionedAmount",  format: val => val ? val.toLocaleString('en-IN') : 0, currency: true
        },
        { name: "disbursedAmount", label: "Disbursed Value", align: "left", sortable: true,
          field: "disbursedAmount",  format: val => val ? val.toLocaleString('en-IN') : 0, currency: true
        },
        { name: "emiAmount", required: true, label: "EMI", align: "left", sortable: true,
          field: "emiAmount",  format: val => val ? val.toLocaleString('en-IN') : 0,currency: true
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
        { name: "actions", label: "Actions", required: true, align: "center",
          field: "actions",  format: val => `${val}`
        }
      ],
      loanStatusOptions: ['ACTIVE', 'CLOSE']
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
      loan: this.newLoan(),
      open: false
    };
  },
  methods: {
    newLoan () {
      return {
        id: null,
        clientId: this.getClientId(),
        displayName: '',
        sanctionedAmount: 0,
        disbursedAmount: 0,
        emiAmount: 0,
        interestRate: 0.0,
        openingDate: null,
        bankName: '',
        branch: '',
        borrower:'',
        status:''
      }
    },
    toggleExpand(props) {
      props.expand = !props.expand
    },
    addLoan() {
      LoanService.create(this.loan)
        .then(response => {
        console.log(JSON.stringify(response))
        this.allLoans();
        this.open = false
        if(this.mode === "add")
          this.success('Loan Create Successfully')
        else
          this.success('Loan Updated Successfully')
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
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
    openDialog(mode, row) {
      this.reset()
      this.mode = mode;
      if (this.mode === "add") {
        this.dialogLabel = "Create New Loan";
      } else if (this.mode === "edit") {
        this.loan = row;
        this.dialogLabel = "Update Loan";
      }
      this.open = true;
    },
    onHide() {
      this.open = false
      this.reset();
      this.mode='add'
    },
    reset() {
      this.loan = this.newLoan();
    }
  }
};
</script>
<style>
.pointer {
  cursor: pointer;
}
</style>