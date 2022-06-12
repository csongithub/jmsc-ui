<template>
<div>
    <div class="row bg-primary text-white text-bold">
        <span class="text-subtitle2 q-ml-md">Facility Linkage Details</span> <q-space/>
        <q-btn flat size="sm" class="text-capitalize" :icon="icons.back" label="Back" @click="goBack()">
            <q-tooltip>Go Back to Facility</q-tooltip>
        </q-btn>
    </div>
  <div  class="q-ma-md">
      <div class="q-pa-md text-center">
        <div class="row">
          <div class="col text-bold">Facility Type</div>
          <div class="col text-bold">Account Number</div>
          <div class="col text-bold">Amount</div>
          <div class="col text-bold">Issuer</div>
        </div>
        <div class="row">
          <div class="col">{{linkage.facilityType}}</div>
          <div class="col">{{linkage.facilityAccountNo}}</div>
          <div class="col"><q-icon  :name="icons.rupee" />
            {{linkage.facilityAmount !== undefined ? linkage.facilityAmount.toLocaleString('en-IN') : 0.00}}
          </div>
          <div class="col">{{linkage.issuer}}</div>
        </div>
      </div>
  </div>
</div>
</template>

<script>
import {matArrowBackIosNew, matCurrencyRupee} from "@quasar/extras/material-icons";
import CreditFacilityService from "../../../services/CreditFacilityService"
import { commonMixin } from "../../../mixin/common"
import { ref } from 'vue'
export default {
  name: 'LinkageDetails',
  mixins: [commonMixin],
  setup () {
    return {
        icons: {
        back: matArrowBackIosNew,
        rupee: matCurrencyRupee
      },
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
      linkage: {}
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
        CreditFacilityService.linkageDetails(this.clientId, this.facilityId)
        .then(response => {
        this.linkage = response
        console.log(JSON.stringify(this.linkage))
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
      }
  }
};
</script>