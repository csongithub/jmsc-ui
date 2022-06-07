<template>
    <div>
        <Payment/>
        <q-table
        class="my-sticky-header-table"
        :title="appendTitle"
        dense
        bordered
        flat
        :rows="drafts"
        :columns="columns"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        selection="multiple"
        v-model:selected="selected"
      >
        <template v-slot:top-right>
          <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
                outline
                color="primary" 
                icon="refresh" 
                label="Reload"
                size="sm"
                glossy
                @click="getAllPrinted()"/>
          <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="Select Date" 
               size="sm"
               glossy
               @click="selectRange = !selectRange"
              />
          <q-btn v-if="selected.length > 0" class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="Re-Print"
               size="sm"
               glossy
               @click="openPrinter"
              />
        </template>
      </q-table>
      <div>
        <q-dialog
          v-model="selectRange"
          persistent
          @before-show="beforeShow"
          @hide="onHide"
          ref="createPaymentRef"
        >
        <q-card flat bordered>
            <q-date v-model="range" range today-btn/>
            <q-card-actions align="right">
              <q-btn class="text-capitalize" color="primary" flat  @click="cancelRange">cancel</q-btn>
              <q-btn class="text-capitalize" color="primary" flat  @click="getForSelectedRange">ok</q-btn>
            </q-card-actions>
        </q-card>
        </q-dialog>
      </div>

      <div>
        <q-dialog
          v-model="open"
          persistent
          @before-show="beforeShow"
          @hide="onHide"
          ref="createPaymentRef"
        >
          <q-card flat bordered style="width: 100%px; max-width: 80vw;">
            <IndianBankRTGS v-if="selected.length > 0"
                            :payments="payments"
                            :done="showDone"
                            @cancel="cancelPrint">
            </IndianBankRTGS>
        </q-card>
        </q-dialog>
      </div>
    </div>
</template>

<script>

import PaymentService from "../../../services/PaymentService"
import { commonMixin } from "../../../mixin/common"
import Payment from "../payment/Payment.vue"
import IndianBankRTGS from "../payment/templates/IndianBankRTGS.vue"
import { ref } from 'vue'

export default {
  name: 'PrintPayment',
  components: {
    Payment,
    IndianBankRTGS
  },
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      myPagination: { rowsPerPage: 15 },
      filter: "",
      columns: [
        {
          name: "toParty",
          required: true,
          label: "Party Name",
          align: "left",
          field: row => row.toParty,
          format: val => `${val}`,
          sortable: true
        },
        {name: "fromAccount",  align: "left", label: "From Account", field: "fromAccount", sortable: true},
        {name: "fromAccountNumber",  align: "left", label: "From A/C Number", field: "fromAccountNumber", sortable: true},
        {name: "toAccount",  align: "left", label: "To Account", field: "toAccount", sortable: true},
         {name: "toAccountNumber",  align: "left", label: "To A/C Number", field: "toAccountNumber", sortable: true},
        {name: "toIFSC",  align: "left", label: "IFSC", field: "toIFSC", sortable: true},
        {name: "amount",  align: "left", label: "Amount", field: "amount", sortable: true},
       
      ],
    }
  },
  created() {},
  mounted() {
    this.getAllPrinted()
  },
  data() {
    return {
      clientId: this.getClientId(),
      loading: true,
      drafts: [],
      open: false,
      payload: {},
      payments:[],
      showDone: false,
      range: ref({ from: '', to: '' }),
      selectRange: false,
      appendTitle: 'Showing All Records'
    };
  },
  methods: {
    getAllPrinted() {
      this.loading = true;
      PaymentService.getAllPrinted(this.clientId).then(response => {
        this.appendTitle = 'Showing All Records'
        this.buildResponse(response)
      }).catch(err => {
        this.loading = false;
        this.fail('Error in getting payment drafts')
        
      });
    },
    openPrinter() {
      if(this.selected.length > 2) {
        this.warning('Please select maximum two payments to print')
        return
      }
      this.payments.splice(0, this.payments.length)
      for(let s of this.selected){
          this.payments.push(s)
      }
      this.open = true
    },
    beforeShow() {

    },
    onHide() {
      this.open = false
    },
    markPrinted(payments){
        this.onHide()
    },
    cancelPrint() {
      this.onHide()
    },
    cancelRange() {
       this.selectRange = false
       this.range={ from: '', to: '' }
    },
    getForSelectedRange () {
       let range = {}
      if(this.range.from !== undefined && this.range.to !== undefined) {
        range = {
          from: this.range.from,
          to: this.range.to
        }
      } else {
        range = {
          from: this.range,
          to: this.range
        }
      }
      
      let req = {
        range: range
      }
      // window.alert(JSON.stringify(req))
      PaymentService.getByRange(this.clientId, req).then(response => {
       this.buildResponse(response)
       
       this.appendTitle = 'Showing Records from ' + range.from + ' To ' + range.to;
       this.cancelRange()
      }).catch(err => {
      });
    },
    buildResponse (response){
      this.drafts.splice(0, this.drafts.length)
        let temp = response;
        for(let t of temp) {
          let payment = JSON.parse(t.draftJson)
          let draft = {
            id: t.id,
            fromAccount: payment.fromAccount.accountHolder,
            fromBranch: payment.fromAccount.branchName,
            fromAccountNumber: payment.fromAccount.accountNumber,
            fromMobile: payment.fromAccount.mobileNo,
            toParty: payment.toAccount.partyName,
            toAccount: payment.toAccount.accountHolder,
            toAccountNumber: payment.toAccount.accountNumber,
            toIFSC: payment.toAccount.ifscCode,
            amount: payment.amount,
            inWords: payment.inWords
          }
          this.drafts.push(draft)
        }
        this.loading = false;
    }
  }
};
</script>
