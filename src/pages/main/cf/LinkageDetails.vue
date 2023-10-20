<template>
<div>
  <q-btn outline size="xs" class="text-capitalize" :icon="icons.back" label="Back" @click="goBack()">
      <q-tooltip>Go Back to Facility</q-tooltip>
  </q-btn>
  <div  class="q-ma-md">
      <div class="q-pa-md text-center">
        <div class="row">
          <div class="col text-bold">Linkage Type</div>
          <div class="col text-bold">Facility Type</div>
          <div class="col text-bold">Account Number</div>
          <div class="col text-bold">Amount</div>
          <div class="col text-bold">Issuer</div>
        </div>
        <div class="row">
          <div class="col">{{linkage.linkageType}}</div>
          <div class="col">{{linkage.facilityType}}</div>
          <div class="col">{{linkage.facilityAccountNo}}</div>
          <div class="col"><q-icon  :name="icons.rupee" />
            {{linkage.facilityAmount !== undefined ? linkage.facilityAmount.toLocaleString('en-IN') : 0.00}}
          </div>
          <div class="col">{{linkage.issuer}}</div>
        </div>
      </div>
  </div>
  <div v-if="linkage.linkageType === 'LOAN'" class="q-ml-sm q-mr-sm">
    <q-table
      color="primary"
      card-class=""
      table-header-class="text-primary text-bold"
      table-class="text-black"
      bordered
      title="Loan Details"
      :rows="loans"
      :columns="loansColumn"
      row-key="accountNo"
    />
  </div>
  <div v-if="linkage.linkageType === 'BID'" class="q-ml-sm q-mr-sm">
    <q-table
      color="primary"
      card-class=""
      table-header-class="text-primary text-bold"
      table-class="text-black"
      bordered
      title="Bid Details"
      :rows="bids"
      :columns="bidsColumn"
      row-key="tenderId"
    />
  </div>
  <div v-if="linkage.linkageType === 'BG_GROUP'" class="q-ml-sm q-mr-sm">
    <q-table
      color="primary"
      card-class=""
      table-header-class="text-primary text-bold"
      table-class="text-black"
      bordered
      title="BG Group"
      :rows="groups"
      :columns="groupsColumn"
      row-key="tenderId"
    />
  </div>
  <div v-if="linkage.linkageType === 'BID_AND_BG_GROUP'" class="q-ml-sm q-mr-sm">
     <q-table class="q-mb-md"
      color="primary"
      card-class=""
      table-header-class="text-primary text-bold"
      table-class="text-black"
      bordered
      title="BG Group"
      :rows="groups"
      :columns="groupsColumn"
      row-key="tenderId"
    />
    <q-table
      color="primary"
      card-class=""
      table-header-class="text-primary text-bold"
      table-class="text-black"
      bordered
      title="Bid Details"
      :rows="bids"
      :columns="bidsColumn"
      row-key="tenderId"
    />
  </div>
</div>
</template>

<script>
import {matArrowBackIosNew, matCurrencyRupee} from "@quasar/extras/material-icons";
import CreditFacilityService from "../../../services/CreditFacilityService"
import { commonMixin } from "../../../mixin/common"
import { date } from 'quasar'
import { ref } from 'vue'
export default {
  name: 'LinkageDetails',
  mixins: [commonMixin],
  setup () {
    return {
        icons: {
        back: matArrowBackIosNew,
        rupee: matCurrencyRupee,
      },
      loansColumn: [
        { name: "displayName", required: true, label: "Name", align: "left", 
          field: "displayName", format: val => `${val}`, sortable: true,
        },
        { name: "accountNo", required: true, label: "A/C No", align: "left", 
          field: row => row.accountNo, format: val => `${val}`, sortable: true,
        },
        { name: "borrower", required: true, label: "Borrower", align: "left", sortable: true,
          field: "borrower",  format: val => `${val}`
        },
        { name: "disbursedAmount", label: "Disbursed Value", align: "left", sortable: true,
          field: "disbursedAmount",  format: val => val ? val.toLocaleString('en-IN') : 0, currency: true
        },
        { name: "openingDate", required: true, label: "Open Date", align: "left", sortable: true,
          field: "openingDate",  format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        { name: "bankName", label: "Bank", align: "left", sortable: true,
          field: "bankName",  format: val => `${val}`
        },
        { name: "branch", label: "Branch", align: "left", sortable: true,
          field: "branch",  format: val => `${val}`
        }
      ],
      bidsColumn: [
        { name: "displayName", required: true, label: "Display Name", align: "left", 
          field: "displayName", format: val => `${val}`
        },
        { name: "tenderId", required: true, label: "Tender ID", align: "left", 
          field: row => row.tenderId, format: val => `${val}`
        },
        { name: "tenderRefNumber", required: true, label: "Ref/Package", align: "left",
          field: "tenderRefNumber",  format: val => `${val}`
        },
        { name: "nit", label: "NIT", align: "left",
          field: "nit",  format: val => val ? val.toLocaleString('en-IN') : 0, currency: true
        },
        { name: "bidAuthority", required: true, label: "Authority", align: "left",
          field: "bidAuthority", format: val => `${val}`
        },
        { name: "title", label: "Work Name", align: "left",
          field: "title",  format: val => `${val}`
        }
      ],
      groupsColumn: [
        { name: "groupName", required: true, label: "Group Name", align: "left", 
          field: row => row.groupName, format: val => `${val}`
        },
        { name: "groupInfo", required: true, label: "Group Info", align: "left", 
          field:"groupInfo", format: val => `${val}`
        },
        { name: "groupLimit", label: "Limit", align: "left",
          field: "groupLimit",  format: val => val ? val.toLocaleString('en-IN') : 0
        }
      ]
    }
  },
  components: {
  },
  created() {},
  mounted() {
    this.facilityId = this.$route.params.facilityId
    this.getFacilityLinakgeDetails()
  },
  data() {
    return {
      clientId: this.getClientId(),
      facilityId: this.$route.params.facilityId,
      parent: this.$route.params.parent,
      linkage: {},
      loans:[],
      bids: [],
      groups:[]

    };
  },
  methods: {
      goBack(){
          if(this.parent === 'ALL') {
               this.$router.push({ name: "allCF"});
          } else if(this.parent === 'BG') {
               this.$router.push({ name: "bankGuarantee"});
          } else if(this.parent === 'FD') {
               this.$router.push({ name: "fixedDeposit"});
          } else if(this.parent === 'NSC') {
               this.$router.push({ name: "nsc"});
          }
      },
      getFacilityLinakgeDetails(){
          let self = this
          this.loans.splice(0, this.loans.length)
          this.bids.splice(0, this.bids.length)
          this.groups.splice(0, this.groups.length)
          CreditFacilityService.linkageDetails(this.clientId, this.facilityId)
          .then(response => {
          self.linkage = response
          if(self.linkage.linkageType === 'LOAN'){
            self.loans.push(self.linkage.loan)
          }
          if(self.linkage.linkageType === 'BID'){
            self.bids.push(self.linkage.bid)
          }
          if(self.linkage.linkageType === 'BG_GROUP'){
            self.groups.push(self.linkage.bgGroup)
          }
          if(self.linkage.linkageType === 'BID_AND_BG_GROUP'){
            self.bids.push(self.linkage.bid)
            self.groups.push(self.linkage.bgGroup)
          }
          console.log(JSON.stringify(this.linkage))
        }).catch(err => {
          this.fail(this.getErrorMessage(err))
        });
      }
  }
};
</script>