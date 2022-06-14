<template>
    <div>
    <CreditFacility/>
        <q-table
        class="my-sticky-header-table"
        title="Fixed Deposit"
        dense
        bordered
        flat
        :rows="accounts"
        :columns="columns"
        row-key="accountNumber"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        v-model:selected="selected"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
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
                @click="!showClosed ? getAllActiveFixDeposits() : getAllClosedFixDeposits()"/>
        </template>
        <template v-slot:top-right>
          <q-checkbox class="q-mr-sm" v-model="showClosed" label="Show Closed" color="primary" @click="toggelShowAll()">
            <q-tooltip>Show all facility including closed</q-tooltip>
          </q-checkbox>
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
</template>

<script>

import CreditFacilityService from "../../../services/CreditFacilityService"
import CreditFacility from "../cf/CreditFacility.vue"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import {matClose} from "@quasar/extras/material-icons";
import { ref } from 'vue'
export default {
  name: 'FixedDeposit',
  mixins: [commonMixin],
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
        {name: "openDate",  align: "left", label: "Open Date", field: "openDate", sortable: true},
        {name: "maturityDate",  align: "left", label: "Maturity Date", field: "maturityDate", sortable: true},
        {name: "issuerType",  align: "left", label: "Issuer", field: "issuerType", sortable: true},
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true},
        {name: "actions",  align: "left", label: "Actions", field: "actions"}
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        close: matClose
      }
    }
  },
  components: {
    CreditFacility
  },
  created() {},
  mounted() {
    this.getAllActiveFixDeposits()
  },
  data() {
    return {
      clientId: this.getClientId(),
      myPagination: { rowsPerPage: 15 },
      filter: "",
      loading: true,
      accounts: [],
      account: [],
      open: false,
      mode: "add",
      dialogLabel: "New Facility"
    };
  },
  methods: {
    toggelShowAll(){
      if(!this.showClosed){
         this.getAllActiveFixDeposits()
      } else{
        this.getAllClosedFixDeposits()
      }
    },
    getAllActiveFixDeposits() {
      this.loading = true;
      CreditFacilityService.getAllActiveFacilitiesByType(this.clientId, 'FD')
        .then(response => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    getAllClosedFixDeposits() {
      this.loading = true;
      CreditFacilityService.getAllClosedFacilitiesByType(this.clientId, 'FD')
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
      this.$router.push({ name: "cfLinkageDetails", params: { facilityId: row.id, parent: 'FD'}});
    },
    confirmClose(cf) {
      this.$q.dialog({
        title: 'Are you sure?',
        message: 'You wont be able to use this facility anymore.',
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
        this.closeFacility(cf)
      }).onOk(() => {
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
     closeFacility(cf) {
      CreditFacilityService.closeFacility(this.clientId, cf.id)
        .then(response => {
        if(response) {
          this.success('The credit facility has been closed')
        }
        this.getAllActiveFixDeposits()
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    }
  }
};
</script>