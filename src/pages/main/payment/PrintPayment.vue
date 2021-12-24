<template>
    <div>
        <Payment/>
        <q-table
        class="my-sticky-header-table"
        title="Print Challan"
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
          <q-btn v-if="selected.length > 0" class="q-mt-sm q-mr-sm" 
               color="primary"
               label="Print" 
               size="sm"
               glossy
               @click="openPrinter"
              />
          <q-btn v-if="selected.length > 0" class="q-mt-sm q-mr-sm" 
               color="primary"
               label="Discard" 
               size="sm"
               glossy
               @click="discard"
              />
        </template>
      </q-table>

      <div>
        <q-dialog
          v-model="open"
          persistent
          @before-show="beforeShow"
          @hide="onHide"
          ref="createPaymentRef"
        >
          <q-card flat bordered style="width: 100%px; max-width: 80vw;">
            <q-bar class="bg-primary glossy">
              {{ 'Print Challan' }}
              <q-space />
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip>Close</q-tooltip>
              </q-btn>
            </q-bar>
            <IndianBankRTGS v-if="selected.length > 0" :payments="payments"/>
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
import print from 'vue3-print-nb'


export default {
  name: 'PrintPayment',
  components: {
    Payment,
    IndianBankRTGS
  },
  directives: {
    print   
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
    this.getActiveAccounts()
  },
  data() {
    return {
      loading: true,
      drafts: [],
      open: false,
      payments: []
    };
  },
  methods: {
    getActiveAccounts() {
      this.loading = true;
      PaymentService.getAllDrafts().then(response => {
        this.drafts.splice(0, this.drafts.length)
        let temp = response;
        for(let t of temp) {
          if(t.status !== 'CREATED')
            continue;
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
        // console.log(JSON.stringify(this.drafts))
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
      this.payments.splice(0, this.payments.length);
      let index= 1;
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
    discard() {

    }
  }
};
</script>
