<template>
<div>
  <div  class="row pointer q-mt-sm q-ml-md">
    <q-btn size="sm" class="text-capitalize" color="primary" :icon="icons.leftArrow" label="Back" @click="openBGGroup()"/>
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
         <div class="col">{{groupDetails.bgGroup.groupLimit}}</div>
      </div>
    </div>
    <q-expansion-item class="q-ma-md" color="text-primary" dense dense-toggle expand-separator label="Deposits Details">
        <q-table class="my-sticky-header-table" title="Deposits" dense bordered  flat
                    :rows="linkedDeposits"
                    :columns="facilityColumns"
                    :pagination="facilityPagination"
                    :filter="depositFilter"
                    @selection="printDetails">
                    <template v-slot:top-right>
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
                      </q-input>
                    </template>
            </q-table>
    </q-expansion-item>

    <q-expansion-item class="q-ma-md" color="text-primary" dense dense-toggle expand-separator label="Guarantees Details">
        
    </q-expansion-item>
  </div>
</div>
</template>

<script>
import {fasArrowCircleLeft} from "@quasar/extras/fontawesome-v5";
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
     icons: {
        leftArrow: fasArrowCircleLeft
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
      linkedDeposits: [],
      linkedGuarantees: []

    };
  },
  methods: {
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
        // window.alert(JSON.stringify(self.linkedDeposits))
      }).catch(err => {
        this.loading = false;
      });
    },
  }
};
</script>
<style lang="sass" scoped>
.row > div
  padding: 10px 15px
  background: rgba(86,61,124,.15)
  border: 1px solid rgba(86,61,124,.2)
.row + .row
</style>