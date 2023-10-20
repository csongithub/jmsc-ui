<template>
<div>
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
                    <q-btn class="q-pa-xs" size="xs" color="primary" flat :icon="icons.link" @click="showFreeColateral(props.row)">
                        <q-tooltip>Link collaterals</q-tooltip>
                    </q-btn>
                    <q-btn class="q-pa-xs" size="xs" color="primary" flat :icon="icons.edit" @click="openDialog('edit',props.row)">
                        <q-tooltip>Update Loan</q-tooltip>
                    </q-btn>
                    <!-- <q-btn class="q-pa-xs" size="xs" color="red" flat :icon="icons.delete">
                        <q-tooltip>Delete Loan</q-tooltip>
                    </q-btn>  -->
                </div>
              
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <q-table class="my-sticky-header-table q-ma-lg" table-header-class="text-primary" dense bordered  flat  title="Collateral"
                    :rows="props.row.collateralLinkage"
                    :columns="seeCollateralColumns"
                    :pagination="facilityPagination"
                    :filter="linkedColateralFilder">
                    <template v-slot:body-cell-actions="payload">
                      <q-td :payload="payload">
                        <div class="pointer">
                          <q-btn flat color="red" size="xs" :icon="icons.trash" @click="confirmRemoveCollateral(props.row, payload.row)">
                              <q-tooltip>Remove Collateral</q-tooltip>
                          </q-btn>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:top-right>
                      <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
                            outline
                            color="primary" 
                            icon="refresh" 
                            label="Refresh"
                            size="xs"
                            glossy @click="getLoanCollateral(props)"
                      />
        </template>
              </q-table>
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
    <q-card style="width: 500px; max-width: 80vw;">
      <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
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
                <q-input dense outlined placeholder="dd-mm-yyyy" v-model="loan.openingDate" :rules="['DD-MM-YYYY']"  label="Open Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="loan.openingDate" mask="DD-MM-YYYY">
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

  <q-dialog v-model="openCollateral" persistent  @hide="onHideCollateral" ref="collateralRef">
      <q-card v-if="approvalRequired">
        <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ 'Link Collateral' }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <AdminAuth :embedded="'true'"
               :options="openAuthorization" 
               @success="approvalRequired = !approvalRequired"></AdminAuth>
        </q-card-section>
      </q-card>
      <q-card v-else style="width: 1000px; max-width: 80vw;">
        <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ 'Link Collateral' }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        
        <q-card-section>
          <q-table class="my-sticky-header-table" title="Select Collateral" dense bordered  flat
                    :rows="collateral"
                    :columns="facilityColumns"
                    row-key="accountNumber"
                    :loading="collateralLoading"
                    :pagination="facilityPagination"
                    :filter="collateralFilter"
                    selection="multiple"
                    v-model:selected="collateralSelected">
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="collateralFilter"
                        placeholder="Search Collateral">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                        <q-tooltip>Search collateral to link to this loan</q-tooltip>
                      </q-input>
                    </template>
          </q-table>
          <div class="row q-mt-sm">
            <q-btn class="text-capitalize q-mr-sm" glossy color="primary" label="Link Selectd Collateral" size="sm"  @click="linkCollateral()"/>
            <q-btn class="text-capitalize" outline glossy color="primary" label="Cancel" size="sm"  @click="cancelLinkCollateral()"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

</div>

<AdminAuth :options="openAuthorization" 
               :title="authTitle"
               :message="authMessage"
               :data="authData"
               @cancel="cancelAuth"
               @success="removeCollateral"></AdminAuth>
</template>

<script>

import { fasTh, fasList,} from "@quasar/extras/fontawesome-v5";
import {matAdd, matRefresh, matCurrencyRupee, matLink, matEdit, matDelete, matExpandMore, matExpandLess} from "@quasar/extras/material-icons";
import AdminAuth from "../../auth/AdminAuth.vue"
import LoanService from "../../../services/LoanService"
import CreditFacilityService from "../../../services/CreditFacilityService"
import { commonMixin } from "../../../mixin/common"
import { ref } from 'vue'
export default {
  name: 'Loans',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      collateralSelected: ref([]),
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
        expendLess:matExpandLess,
        trash: matDelete
      },
      visibleColumns: ref(['displayName', 'accountNo', 'borrower', 'sanctionedAmount', 'emiAmount', 'openingDate', 'status', 'collaterals',]),
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
          field: "openingDate"
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
      facilityColumns: [
        {name: "facilityType",  align: "left", label: "Category", field: "facilityType", sortable: true},
        {
          name: "accountNumber", required: true, label: "Account No", align: "left",  sortable: true,
          field: row => row.accountNumber, format: val => `${val}`
        },
        {name: "amount",  align: "left", label: "Amount", field: "amount", sortable: true},
        {
          name: "openDate", align: "left", label: "Open Date", field: "openDate", sortable: true,
        },
        {
          name: "maturityDate", align: "left", label: "Maturity Date", field: "maturityDate", sortable: true,
        },
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true}
      ],
      seeCollateralColumns: [
        {name: "facilityType",  align: "left", label: "Category", field: "facilityType", sortable: true},
        {
          name: "accountNumber", required: true, label: "Account No", align: "left",  sortable: true,
          field: row => row.accountNumber, format: val => `${val}`
        },
        {name: "amount",  align: "left", label: "Amount", field: "amount", sortable: true, format: val => val ? val.toLocaleString('en-IN') : 0},
        {
          name: "openDate", align: "left", label: "Open Date", field: "openDate", sortable: true
        },
        {
          name: "maturityDate", align: "left", label: "Maturity Date", field: "maturityDate", sortable: true
        },
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true},
        {name: "actions", required: false, label: "Actions", field: "actions"}
      ],
      loanStatusOptions: ['ACTIVE', 'CLOSE']
    }
  },
  watch: {
  },
  components: {
    AdminAuth
  },
  created() {},
  mounted() {
    this.allLoans()
  },
  data() {
    return {
      clientId: this.getClientId(),
      openAuthorization: false,
      authTitle: '',
      authMessage: '',
      authData: null,
      approvalRequired: true,
      pagination:  { rowsPerPage: 10 },
      filter: "",
      linkedColateralFilder: "",
      grid: false,
      loans: [],
      loading: false,
      mode: "add",
      dialogLabel: "Create New Loan",
      loan: this.newLoan(),
      open: false,
      openCollateral: false,
      collateral: [],
      collateralLoading: false,
      facilityPagination:  { rowsPerPage: 20 },
      collateralFilter: "",
      editLoanRow: null,
      list: []
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
        delete row.collateralLinkage
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
    },
    showFreeColateral(loanRow) {
      this.approvalRequired = true
      this.editLoanRow = loanRow
      this.openCollateral = true;
      let self = this
      this.collateralLoading = true
      self.collateral.splice(0, this.collateral.length)
      CreditFacilityService.getFreeCollateral(this.clientId)
        .then(response => {
        self.collateral = response
        this.collateralLoading = false;
      }).catch(err => {
        this.collateralLoading = false;
      });
    },
    onHideCollateral(){
       this.openCollateral = false;
       this.collateralSelected.splice(0, this.collateralSelected.length)
    },
    cancelLinkCollateral(){
      this.onHideCollateral()
    },
    linkCollateral(){
      if(this.collateralSelected.length === 0) {
        this.fail('Please select facilities')
        return 
      }
      let manageCollateralRequest = {
        "loan": this.editLoanRow,
        "collateral": this.collateralSelected,
        "link": true
      }
      let self = this
      console.log(JSON.stringify('REQUEST: ' + manageCollateralRequest))
      LoanService.manageCollateral(manageCollateralRequest)
        .then(response => {
        console.log(JSON.stringify(response))
        self.cancelLinkCollateral()
        this.success('Operation successful, please refresh')
      }).catch(err => {
        self.fail(self.getErrorMessage(err))
      });
    },
    toggleExpand(props) {
      props.expand = !props.expand
      if(props.expand){
        this.getLoanCollateral(props)
      }
    },
    getLoanCollateral(props){
      LoanService.loanCollateral(this.clientId, props.row.id)
        .then(response => {
        props.row.collateralLinkage = response
        console.log(JSON.stringify(props.collateral))
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    },
    confirmRemoveCollateral(loan, collateral){
      let data= {
        'loan': loan,
        'collateral': collateral
      }
      this.openAuth('Are you sure?', 
                    'This will make this collateral free from this loan.',
                    true,
                    data)
    },
    removeCollateralInternal(loan, collateral){
      let collateralList = [collateral]
      let manageCollateralRequest = {
        "loan": loan,
        "collateral": collateralList,
        "link": false
      }
      let self = this
      LoanService.manageCollateral(manageCollateralRequest)
        .then(response => {
        console.log(JSON.stringify(response))
        self.cancelLinkCollateral()
        this.success('Remove successful, please refresh')
      }).catch(err => {
        self.fail(self.getErrorMessage(err))
      });
    },
    removeCollateral(data) {
      // window.alert('remove_collateral' + JSON.stringify(data))
      this.removeCollateralInternal(data.loan, data.collateral)

    },
    openAuth(title, message, options, data){
      this.authTitle = title,
      this.authMessage = message
      this.openAuthorization = options
      this.authData = data
    },
    cancelAuth(val) {
      this.openAuthorization = val
    },
  }
};
</script>
<style>
.pointer {
  cursor: pointer;
}
</style>