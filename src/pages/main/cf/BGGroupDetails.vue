<template>
<div>
  <div class="row bg-primary text-white text-bold">
    <span class="text-subtitle2 q-ml-md">BG Group Details</span> <q-space/>
    <q-btn flat size="sm" class="text-capitalize" :icon="icons.leftArrow" label="Back" @click="openBGGroup()">
      <q-tooltip>Go Back to the BG Groups</q-tooltip>
    </q-btn>
  </div>
  <div  class="row pointer q-mt-sm q-ml-md">
    
  </div>
  <div class="q-ma-md">
    <div class="q-pa-md text-center">
      <div class="row">
        <div class="col text-bold">Group Name</div>
        <div class="col text-bold">Group Info</div>
        <div class="col text-bold">Limit</div>
      </div>
      <div class="row">
        <div class="col">{{groupDetails.bgGroup.groupName}}</div>
        <div class="col">{{groupDetails.bgGroup.groupInfo}}</div>
        <div class="col"><q-icon  :name="icons.rupee" />{{groupDetails.bgGroup.groupLimit !== undefined ? groupDetails.bgGroup.groupLimit.toLocaleString('en-IN') : 0.00}}</div>
      </div>
    </div>
    <q-expansion-item
        group="facility"
        :icon="icons.deposit"
        label="Manage Collaterals (Fix Deposits & NSC)"
        header-class="bg-primary text-white text-bold"
        expand-icon-class="text-white"
        class="q-mb-md"
        caption="Fix Deposits & NSCs that are hold in this group"
      >
        <q-table class="my-sticky-header-table" dense bordered  flat
                    :rows="linkedDeposits"
                    :columns="facilityColumns"
                    :pagination="facilityPagination"
                    :filter="depositFilter">
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <div class="pointer">
                          <q-icon color="red" :name="icons.trash" @click="confirmRemoveDeposit(props.row)"/>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:top-right>
                        <q-btn class="q-mr-md pointer text-capitalize" color="primary" flat round :icon="icons.add" @click="openDepositWindow()">
                          <q-tooltip>Link otrher deposit(s)</q-tooltip>
                        </q-btn> 
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="depositFilter"
                        placeholder="Search Deposit">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                        <q-tooltip>Search Deposits</q-tooltip>
                      </q-input>
                    </template>
            </q-table>
    </q-expansion-item>

    <q-expansion-item
        group="facility"
        :icon="icons.guarantee"
        label="Manage Bank Guarantees"
        header-class="bg-primary text-white text-bold"
        expand-icon-class="text-white"
         caption="Guarantees that are issued from this group"
      >
      <q-table class="my-sticky-header-table" dense bordered  flat
                    :rows="linkedGuarantees"
                    :columns="facilityColumns"
                    :pagination="facilityPagination"
                    :filter="guaranteeFilter">
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <div class="pointer">
                          <q-icon color="red" :name="icons.trash" @click="confirmRemoveGuarantee(props.row)"/>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:top-right>
                      <q-icon class="q-mr-md pointer" color="primary" size="sm" :name="icons.add" @click="openGuaranteeWindow()"/>
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="guaranteeFilter"
                        placeholder="Search Guarantee">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                        <q-tooltip>Search Guarantee(s)</q-tooltip>
                      </q-input>
                    </template>
      </q-table>
    </q-expansion-item>
    
    <q-dialog v-model="openDeposit" persistent  @hide="onHideDeposit" ref="depositsRef">
      <q-card style="width: 1000px; max-width: 80vw;">
        <q-bar class="bg-primary glossy">
            {{ dialogLabel }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-table class="my-sticky-header-table" title="Select Deposit(s)" dense bordered  flat
                    :rows="deposits"
                    :columns="selectFacilityColumns"
                    row-key="accountNumber"
                    :loading="depositLoading"
                    :pagination="facilityPagination"
                    :filter="linkedDepositFilter"
                    selection="multiple"
                    v-model:selected="depositSelected">
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="linkedDepositFilter"
                        placeholder="Search Fix Deposit">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                        <q-tooltip>Search fix deposit(s) to link to this group</q-tooltip>
                      </q-input>
                    </template>
          </q-table>
          <div class="row q-mt-sm">
            <q-btn class="text-capitalize q-mr-sm" glossy color="primary" label="Submit" size="sm"  @click="linkDeposits()"/>
            <q-btn class="text-capitalize" outline glossy color="primary" label="Close" size="sm"  @click="cancelDepositLink()"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="openGuarantee" persistent  @hide="onHideGuarantee" ref="guaranteesRef">
      <q-card style="width: 1000px; max-width: 80vw;">
        <q-bar class="bg-primary glossy">
            {{ dialogLabel }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-table class="my-sticky-header-table" title="Select Guarantee(s)" dense bordered  flat
                    :rows="guarantees"
                    :columns="selectFacilityColumns"
                    row-key="accountNumber"
                    :loading="guaranteeLoading"
                    :pagination="facilityPagination"
                    :filter="linkedGuaranteeFilter"
                    selection="multiple"
                    v-model:selected="guaranteeSelected">
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="linkedGuaranteeFilter"
                        placeholder="Search Bank Guarntee">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                        <q-tooltip>Search bank guarantee(s) to link to this group</q-tooltip>
                      </q-input>
                    </template>
          </q-table>
          <div class="row q-mt-sm">
            <q-btn class="text-capitalize q-mr-sm" glossy color="primary" label="Submit" size="sm"  @click="linkGuarantee()"/>
            <q-btn class="text-capitalize" outline glossy color="primary" label="Close" size="sm"  @click="cancelGuaranteeLink()"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</div>
</template>

<script>
// import {fasArrowLeft} from "@quasar/extras/fontawesome-v5";
import {matAdd, matDelete, matBook, matCreditCard, matArrowBackIosNew, matCurrencyRupee} from "@quasar/extras/material-icons";
import BgGroupService from "../../../services/BgGroupService"
import CreditFacilityService from "../../../services/CreditFacilityService"
import { commonMixin } from "../../../mixin/common"
import { ref } from 'vue'
import { date } from 'quasar'
export default {
  name: 'BG Group Details',
  mixins: [commonMixin],
  props: {
  },
  setup () {
    return {
     depositSelected: ref([]),
     guaranteeSelected: ref([]),
     icons: {
        leftArrow: matArrowBackIosNew,
        trash: matDelete,
        add: matAdd,
        deposit: matCreditCard,
        guarantee: matBook,
        rupee: matCurrencyRupee
      },
      facilityColumns: [
        {
          name: "accountNumber", required: true, label: "Account No", align: "left",  sortable: true,
          field: row => row.accountNumber, format: val => `${val}`
        },
        {name: "amount",  align: "left", label: "Amount", field: "amount", sortable: true},
        {
          name: "openDate", align: "left", label: "Open Date", field: "openDate", sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {
          name: "maturityDate", align: "left", label: "Maturity Date", field: "maturityDate", sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true},
        {name: "actions", required: false, label: "Actions", field: "actions"}
      ],
      selectFacilityColumns: [
        {name: "facilityType",  align: "left", label: "Category", field: "facilityType", sortable: true},
        {
          name: "accountNumber", required: true, label: "Account No", align: "left",  sortable: true,
          field: row => row.accountNumber, format: val => `${val}`
        },
        {name: "amount",  align: "left", label: "Amount", field: "amount", sortable: true},
        {
          name: "openDate", align: "left", label: "Open Date", field: "openDate", sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {
          name: "maturityDate", align: "left", label: "Maturity Date", field: "maturityDate", sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true}
      ]

    }
  },
  watch: {
  },
  created() {},
  mounted() {
    this.groupId = this.$route.params.groupId
    this.getGroupDetails()
  },
  data() {
    return {
      clientId: this.getClientId(),
      groupId: this.$route.params.groupId,
      groupDetails: {
        "bgGroup": {},
        "facilityWrapper": {
          "depositList": [],
          "guaranteeList": []
        }
      },
      facilityPagination:  { rowsPerPage: 10 },
      depositFilter: "",
      guaranteeFilter: "",
      linkedDeposits: [],
      linkedGuarantees: [],
      deposits: [],
      depositLoading: false,
      linkedDepositFilter: "",
      openDeposit: false,
      guarantees: [],
      guaranteeLoading: false,
      linkedGuaranteeFilter: "",
      openGuarantee:false
    };
  },
  methods: {
    openGuaranteeWindow() {
      this.guarantees.splice(0, this.guarantees.length)
      this.guaranteeList()
      this.openGuarantee = true
    },
    onHideGuarantee () {
      this.guarantees.splice(0, this.guarantees.length)
      this.openGuarantee = false
    },
    cancelGuaranteeLink(){
      this.onHideGuarantee()
    },
    openDepositWindow() {
      this.deposits.splice(0, this.deposits.length)
      this.depositList()
      this.openDeposit = true
    },
    onHideDeposit () {
      this.deposits.splice(0, this.deposits.length)
      this.openDeposit = false
    },
    cancelDepositLink(){
      this.onHideDeposit()
    },
    openBGGroup() {
       this.$router.push({ name: "bgGroup"});
    },
    getGroupDetails() {
      let self = this
      BgGroupService.groupDetails(this.clientId, this.groupId)
        .then(response => {
        console.log('GROUP DETAILS: ' + JSON.stringify(response))
        self.groupDetails = response
        self.linkedDeposits = self.groupDetails.facilityWrapper.depositList
        self.linkedGuarantees = self.groupDetails.facilityWrapper.guaranteeList
      }).catch(err => {
        this.loading = false;
      });
    },
    guaranteeList(){
      let self = this
      this.guaranteeLoading = true
      self.guarantees.splice(0, this.guarantees.length)
      CreditFacilityService.guaranteesForBgGroup(this.clientId)
        .then(response => {
        self.guarantees = response
        this.guaranteeLoading = false;
      }).catch(err => {
        this.guaranteeLoading = false;
      });
    },
    depositList() {
      let self = this
      this.depositLoading = true
      self.deposits.splice(0, this.deposits.length)
      CreditFacilityService.getFreeCollateral(this.clientId)
        .then(response => {
        self.deposits = response
        this.depositLoading = false;
      }).catch(err => {
        this.depositLoading = false;
      });
    },
    linkGuarantee (){
      // console.log(JSON.stringify(this.guaranteeSelected))
      let manageGuaranteeRequest = {
        "bgGroupDTO": this.groupDetails.bgGroup,
        "bankGuarantees": this.guaranteeSelected,
        "link": true
      }
      // console.log('LINK DEPOSIT REQUEST: ' + JSON.stringify(manageDepositRequest))
      BgGroupService.manageGuarantee(manageGuaranteeRequest)
        .then(response => {
        console.log('Guarantee(s) Linked to BG Group: ' + JSON.stringify(response))
        this.success('Guarantee(s) Linked Successfully')
        this.getGroupDetails()
        this.guaranteeList()
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    },
    linkDeposits(){
      // console.log(JSON.stringify(this.depositSelected))
      let manageDepositRequest = {
        "bgGroupDTO": this.groupDetails.bgGroup,
        "fixDeposits": this.depositSelected,
        "link": true
      }
      // console.log('LINK DEPOSIT REQUEST: ' + JSON.stringify(manageDepositRequest))
      BgGroupService.manageDeposit(manageDepositRequest)
        .then(response => {
        console.log('Deposit(s) Linked to BG Group: ' + JSON.stringify(response))
        this.success('Collateral(s) Linked Successfully')
        this.getGroupDetails()
        this.depositList()
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    },
    confirmRemoveGuarantee(guarantee) {
      this.$q.dialog({
        title: 'Are you sure?',
        message: 'This will make this Gank Guarantee free from selected BG Group',
        ok: {
          size: 'sm',
          color: 'primary',
          push: true
        },
        cancel: {
          capitalize: true,
          size: 'sm',
          outline: true,
          push: true
        },
        persistent: true
      }).onOk(() => {
        this.removeGuarantee(guarantee)
      }).onOk(() => {
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    confirmRemoveDeposit(deposit) {
      this.$q.dialog({
        title: 'Are you sure?',
        message: 'This will make this collateral free from selected BG Group',
        ok: {
          size: 'sm',
          color: 'primary',
          push: true
        },
        cancel: {
          capitalize: true,
          size: 'sm',
          outline: true,
          push: true
        },
        persistent: true
      }).onOk(() => {
        this.removeDeposit(deposit)
      }).onOk(() => {
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    removeGuarantee(guarantee) {
      // window.alert(JSON.stringify(guarantee))
      let guarantees = [guarantee]
      let manageGuaranteeRequest = {
        "bgGroupDTO": this.groupDetails.bgGroup,
        "bankGuarantees": guarantees,
        "link": false
      }
      // console.log('LINK DEPOSIT REQUEST: ' + JSON.stringify(manageDepositRequest))
      BgGroupService.manageGuarantee(manageGuaranteeRequest)
        .then(response => {
        console.log('Guarantee Removed from BG Group: ' + JSON.stringify(response))
        this.success('Guarantee Removed Successfully')
        this.getGroupDetails()
        this.guaranteeList()
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    },
    removeDeposit(deposit) {
      // window.alert(JSON.stringify(deposit))
      let deposits = [deposit]
      let manageDepositRequest = {
        "bgGroupDTO": this.groupDetails.bgGroup,
        "fixDeposits": deposits,
        "link": false
      }
      // console.log('LINK DEPOSIT REQUEST: ' + JSON.stringify(manageDepositRequest))
      BgGroupService.manageDeposit(manageDepositRequest)
        .then(response => {
        console.log('Deposit Removed from BG Group: ' + JSON.stringify(response))
        this.success('Deposit Removed Successfully')
        this.getGroupDetails()
        this.depositList()
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    }
  }
};
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
</style>