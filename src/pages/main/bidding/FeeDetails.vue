<template>
<div>
     <div class="row q-mb-md">
        <div class="col">{{'Reqiured: INR' + bid.biddingCost.toLocaleString('en-IN')}}</div>
        <div class="col">{{'Selected: INR' + assignBidFee.toLocaleString('en-IN')}}</div>
        <div class="col">{{'Remaning: INR ' + ((bid.biddingCost - assignBidFee) > 0 ? (bid.biddingCost - assignBidFee).toLocaleString('en-IN') : 0.00)}}</div>
        <div class="col">{{'Extra: INR ' + ((assignBidFee - bid.biddingCost) > 0 ? (assignBidFee - bid.biddingCost).toLocaleString('en-IN') : 0.00)}}</div>
    </div>
     <q-separator/>
    <div v-if="!feeExist">
    <div class="row">
        <div class="col">
            <span>Select Mode</span>
        </div>
    </div>
    <div class="row q-mt-sm">
        <div class="col">
            <q-radio class="q-mr-md" dense v-model="feeMode" val="offline" label="Offline"/>
            <q-radio dense v-model="feeMode" val="online" label="Online"/>
        </div>
    </div>

    
    <div class="offline_emd q-mt-md" v-if="feeMode == 'offline'">
        <q-form @submit="addToListFee" @reset="resetOfflineFee">
            <div class="row">
                <div class="col q-mr-md">
                     <q-select dense filled
                        v-model="offlineFeeDetails.mode" 
					              :options="offlinePaymentOptions" 
					              label="Select Mode"
					              lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Select Mode']"/>
                </div>
                <div class="col">
                    <q-input
                      dense
                      filled
                      v-model="offlineFeeDetails.issuer"
                      label="Issuer Details"
                      lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Enter Issuer Details']"/>
                </div>
            </div>
            <div class="row">
                <div class="col q-mr-md">
                    <q-input
                      dense
                      filled
                      v-model="offlineFeeDetails.instrumentNo"
                      label="Instrument Number"
                      lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Enter Instrument Number']"/>
                </div>
                <div class="col">
                    <q-input type="number"
                      dense
                      filled
                      v-model="offlineFeeDetails.amount"
                      label="Amount"
                      lazy-rules
                      :rules="[val => (val && val > 0) || 'Please Enter Amount']"/>
                </div>
            </div>
            <div class="row">
                <div class="col q-mr-md">
                <q-input dense outlined v-model="offlineFeeDetails.issueDate" :rules="['DD-MM-YYYY']"  label="Issue Date" placeholder="dd-mm-yyyy">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="offlineFeeDetails.issueDate" mask="DD-MM-YYYY">
                          <div class="row items-center justify-end">
                            <q-btn class="text-capitalize" v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>

                </div>
                <div class="col">
                

                    <q-input dense outlined v-model="offlineFeeDetails.expiryDate" :rules="['DD-MM-YYYY']"  label="Expiry Date" placeholder="dd-mm-yyyy">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="offlineFeeDetails.expiryDate" mask="DD-MM-YYYY">
                          <div class="row items-center justify-end">
                            <q-btn class="text-capitalize" v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
            </div>

            <div class="row">
                <div class="col">  
                    <q-btn size="sm" dense label="Add" type="submit" color="primary" class="q-mr-md q-pl-sm q-pr-sm text-capitalize" style="cursor: pointer"/>
                    <q-btn size="sm" dense label="Reset" type="reset" color="primary" outline class="q-pl-sm q-pr-sm text-capitalize" style="cursor: pointer"/>
                </div>
            </div>
        </q-form>
        <q-separator class="q-mt-sm q-mb-sm"/>
        <q-table v-if="bid.id !== undefined"
                    class="my-sticky-header-table"
                    title="Fee Details"
                    dense
                    bordered
                    flat
                    :rows="offlineFeeList"
                    :columns="offlineFeeColumns"
                    row-key="instrumentNo"
                    selection="multiple"
                    v-model:selected="feeSelected">
                    <template v-slot:top-right v-if="feeSelected.length > 0">
                      <q-btn class="text-capitalize" color="primary" size="xs" label="Delete" @click="removeFee"/>
                  </template>
        </q-table>
        <q-btn class="q-mt-sm text-capitalize" color="primary" label="Save" @click="saveFee" v-if="assignBidFee >= bid.biddingCost"/>
    </div>
    <div v-else-if="feeMode == 'online'">
        <q-form @submit="saveFee" @reset="resetOnlineFee" class="">
                    <div class="q-gutter-md" style="max-width: 300px">
				              <q-select 
                        v-model="onlineFeeDetails.paymentMode" 
					              :options="onlineFeeOptions" 
					              label="Select Mode"
					              lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Select Mode']"/>
                    <q-input type="number"
                      dense
                      filled
                      v-model="onlineFeeDetails.amount"
                      label="Enter Amount"
                      lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Enter Amount']"/>
				            <q-input
                      dense
                      filled
                      v-model="onlineFeeDetails.transactionNumber"
                      label="Enter Transaction Detail/UTR"/>
				            <q-input type="textarea"
                      dense
                      filled
                      v-model="onlineFeeDetails.accountDetail"
                      label="Enter Account Detail"
                      lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Enter Account Detail']"/>

                    <q-btn dense label="Save" type="submit" color="primary" class="full-width text-capitalize"/>
                    <q-btn dense label="Reset" type="reset" color="primary" outline class="q-mt-sm full-width text-capitalize"/>
                  </div>
                </q-form>
    </div>
  </div>
  <div v-if="feeExist">
        <div v-if="feeMode === 'offline'">
            <q-btn v-if="bid.id !== undefined && bid.status === 'CREATED'"
                    class="q-mt-sm q-mr-sm"
                    label="Clear & Reassign" 
                    color="primary"
                    size="sm"
                    glossy
                    @click="clearFee()"/>
            <q-table
                    class="my-sticky-header-table"
                    title="Fee Details"
                    dense
                    bordered
                    flat
                    :rows="offlineFeeList"
                    :columns="offlineFeeColumns"
                    row-key="instrumentNo">
            </q-table>
        </div>
        <div v-else-if="feeMode === 'online'">
            <div class="row q-mb-md">
                <div class="col q-mr-md">
                    {{'Payment Mode: ' + onlineFeeDetails.paymentMode}}
                </div>
                <div class="col q-mr-md">
                    {{'Amount: INR ' + onlineFeeDetails.amount}}
                </div>
                <div class="col">
                    {{'Transaction: ' + onlineFeeDetails.transactionNumber}}
                </div>
            </div>
            <div>
                <q-input type="textarea" style="max-width: 300px"
                    disable
                    dense
                    filled
                    v-model="onlineFeeDetails.accountDetail"/>
            </div>
            <q-btn v-if="bid.id !== undefined && bid.status === 'CREATED'" class="q-mt-sm text-capitalize" label="Clear & Reassign" color="primary" size="sm" glossy @click="clearFee()"/>
        </div>
  </div>
</div>
</template>

<script>
import { ref } from 'vue'
import { commonMixin } from "../../../mixin/common"
import BidService from "../../../services/BidService"
export default {
  name: 'FeeDetails',
  mixins: [commonMixin],
  props: {
    bid: {
      type: Object,
      default: null
    },
  },
  watch: {
    feeMode(val){
        this.assignBidFee = 0
    },
    'onlineFeeDetails.amount'(value){
        this.assignBidFee = value
    }
  },
  setup () {
    return {
        offlineFeeColumns: [
        {name: "issuer",required: true,label: "Issuer",align: "left",field: "issuer"},
        {name: "instrumentNo",  align: "left", label: "Instrument No", field: "instrumentNo", field: row => row.instrumentNo},
        {name: "amount",  align: "left", label: "Amount", field: "amount"},
        {
          name: "issueDate",
          align: "left", 
          label: "Issue Date", 
          field: "issueDate"
        },
		{
          name: "expiryDate",
          align: "left", 
          label: "Expiry Date", 
          field: "expiryDate"
        }
	],
    feeSelected: ref([])
    }
  },
  created() {

  },
  mounted() {
      this.getBidCost()
  },
  components: {
  },
  data() {
    return {
        bidCost: null,
        feeExist: false,
        feeMode: 'offline',
        offlinePaymentOptions: ['Demand Draft', 'Fix Deposit', 'National Saving Certificate'],
        offlineFeeDetails: this.newOfflineFee(),
        onlineFeeDetails: this.newOnlineFee(),
        assignBidFee: 0,
        offlineFeeList: [],
        onlineFeeOptions: ['Net Banking', 'Challan Payment', 'UPI Payment', 'Card Payment']

    };
  },
  methods: {
      newOfflineFee(){
          return {
              mode: '',
              issuer: '',
              instrumentNo: '',
              amount: 0,
              issueDate: '',
              expiryDate: ''
          }
      },
      newOnlineFee(){
          return {
             amount: 0,
             transactionNumber: '',
             paymentMode: '',
             accountDetail: '',
             status: ''
          }
      },
      addToListFee() {
          this.offlineFeeList.push(this.offlineFeeDetails)
          this.assignBidFee = this.assignBidFee + parseInt(this.offlineFeeDetails.amount)
          this.offlineFeeDetails = this.newOfflineFee()
      },
      removeFee() {
          for(let ff of this.feeSelected) {
            this.offlineFeeList.splice(this.offlineFeeList.findIndex(item => item.instrumentNo === ff.instrumentNo) , 1)
            this.assignBidFee = this.assignBidFee - parseInt(ff.amount)
          }
      },
    
      saveFee() {
        if(this.assignBidFee < this.bid.biddingCost){
            this.fail('Amount is less that bid cost')
            return
        }
        let feeDetails ={
            'feeMode': this.feeMode,
            'offlineFeeDetails': this.offlineFeeList,
            'onlineFeeDetails': this.onlineFeeDetails,
            'comments': ''
        }
        console.log('Fee Details' + JSON.stringify(feeDetails))
        BidService.saveBidFee(feeDetails, this.bid.clientId, this.bid.id)
            .then(response => {
            if(response.offlineFeeDetails !== null) {
               this.offlineFeeDetails = response.offlineFeeDetails
            }
            if(response.onlineFeeDetails !== null) {
               this.onlineFeeDetails = response.onlineFeeDetails
            }
            this.offlineFeeList = []
            this.getBidCost()
            console.log(JSON.stringify(response))
        }).catch(err => {
        });
    },
    getBidCost() {
      let self = this
      BidService.getBidCost(this.bid.id)
        .then(response => {
        self.bidCost = response
        let feeDetails = self.bidCost.feeDetails
        self.feeExist = false
        if(feeDetails != null && feeDetails.feeMode === 'offline'){
            self.feeMode = feeDetails.feeMode
            this.offlineFeeDetails = feeDetails.offlineFeeDetails
            this.offlineFeeList = this.offlineFeeDetails
            for(let fee of this.offlineFeeList) {
                this.assignBidFee = this.assignBidFee + fee.amount
            }
            self.feeExist = true
        }
        if(feeDetails != null && feeDetails.feeMode === 'online'){
            self.feeMode = feeDetails.feeMode
            this.onlineFeeDetails = feeDetails.onlineFeeDetails
            self.feeExist = true
        }
        console.log(JSON.stringify(self.bidCost))
      }).catch(err => {
      });
    },
    resetOfflineFee() {
        this.offlineFeeDetails = this.newOfflineFee()
    },
    resetOnlineFee() {
          this.onlineFeeDetails = this.newOnlineFee()
    },
    clearFee() {
        BidService.clearFee(this.bid.id)
            .then(response => {
            this.feeMode = 'offline'
            this.resetOfflineFee()
            this.resetOnlineFee()
            this.offlineFeeList = []
            this.getBidCost()
            console.log(JSON.stringify(response))
        }).catch(err => {
        });
    },

  }
};
</script>
