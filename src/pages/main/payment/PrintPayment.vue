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
        :visible-columns="visibleColumns"
        :columns="columns"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        selection="multiple"
        v-model:selected="selected"
      >
        <template v-slot:top-right>
          <q-btn v-if="selected.length > 0" class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="Print" 
               size="sm"
               glossy
               @click="openPrinter"
              />
          <q-btn v-if="selected.length > 0" class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="View" 
               size="sm"
               glossy
               @click="openView"
              />

        
          <q-input class="q-mr-sm" borderless dense outlined debounce="300" v-model="filter" placeholder="Search Payments">
            <template v-slot:append><q-icon name="search" /></template>
          </q-input>
          <q-space/>
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
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
              <div class="pointer">
                <q-btn color="red" :icon="icons.trash" flat size="sm" @click="confirmDiscard(props.row)">
                  <q-tooltip>Discard this payment</q-tooltip>
                </q-btn>
              </div>
          </q-td>
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
          <q-card flat bordered style="width: 1000px; max-width: 80vw;">
            <IndianBankRTGS v-if="selected.length > 0"
                            :payments="payments"
                            @printed="markPrinted"
                            @cancel="cancelPrint">
            </IndianBankRTGS>
        </q-card>
        </q-dialog>
      </div>
      <div>
        <q-dialog
        v-model="view"
        persistent
        ref="paymentView">
        <q-card flat bordered>
          <q-bar class="bg-primary glossy">
            {{ dialogLabel }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-actions v-for="(payment, index) of selected" v-bind:key="index">
          <q-card-section>
            <div class="text-h6">From Account</div>
            <div class="row">
              <div class="col">Account Name:</div>
              <div class="col">{{payment.fromAccount}}</div>
            </div>
            <div class="row">
              <div class="col">Bank Name:</div>
              <div class="col">{{payment.fromBank}}</div>
            </div>
            <div class="row">
              <div class="col">Account Number:</div>
              <div class="col">{{payment.fromAccountNumber}}</div>
            </div>
            <div class="row">
              <div class="col">IFSC Code:</div>
              <div class="col">{{payment.fromIFSC}}</div>
            </div>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <div class="text-h6">To Account</div>
            <div class="row">
              <div class="col">Party Name:</div>
              <div class="col">{{payment.toParty}}</div>
            </div>
            <div class="row">
              <div class="col">Account Name:</div>
              <div class="col">{{payment.toAccount}}</div>
            </div>
            <div class="row">
              <div class="col">Account Number:</div>
              <div class="col">{{payment.toAccountNumber}}</div>
            </div>
            <div class="row">
              <div class="col">IFSC Code:</div>
              <div class="col">{{payment.toIFSC}}</div>
            </div>
            <q-separator/>
            <div class="row">
              <div class="col">Amount:</div>
              <div class="col">{{payment.amount}} ({{payment.inWords}})</div>
            </div>
            <q-separator/>
            <div class="row">
              <div class="col">Note:</div>
              <div class="col">{{payment.note}}</div>
            </div>
          </q-card-section>
          </q-card-actions>
        </q-card>
      </q-dialog>
      </div>
    </div>
</template>

<script>

import {matDelete, matCurrencyRupee} from "@quasar/extras/material-icons";
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
      icons: {
        trash: matDelete,
        rupee: matCurrencyRupee
      },
      myPagination: { rowsPerPage: 15 },
      visibleColumns: ref(['toParty', 'toAccount', 'toAccountNumber', 'amount']),
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
        {name: "actions", align: "left", label: "", field: "actions", required: true},
      ],
    }
  },
  created() {},
  mounted() {
    this.getAllDrafts()
  },
  data() {
    return {
      clientId: this.getClientId(),
      loading: true,
      filter: "",
      drafts: [],
      open: false,
      view: false,
      payload: {},
      payments:[]
    };
  },
  methods: {
    getAllDrafts() {
      this.loading = true;
      PaymentService.getAllDrafts(this.clientId).then(response => {
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
            fromBank: payment.fromAccount.bankName,
            fromIFSC: payment.fromAccount.ifscCode,
            fromAccountNumber: payment.fromAccount.accountNumber,
            fromMobile: payment.fromAccount.mobileNo,
            toParty: payment.toAccount.partyName,
            toAccount: payment.toAccount.accountHolder,
            toAccountNumber: payment.toAccount.accountNumber,
            toIFSC: payment.toAccount.ifscCode,
            amount: payment.amount,
            inWords: payment.inWords,
            note: payment.note
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
    openView() {
      this.view = true
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
    cancelPrint() {
       this.open = false
    },
    beforeShow() {

    },
    onHide() {
      this.open = false
    },
    confirmDiscard(row) {
      this.$q.dialog({
        title: 'Are You Sure?',
        message: 'It will delete all selected challan(s)',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.deleteSelected(row)
      }).onOk(() => {
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    deleteSelected(row){
      PaymentService.deletePayments(row.id).then(response => {
        this.getAllDrafts()
        this.success("Challan deleted successfully")
      }).catch(err => {
    });
    },
    markPrinted(payments){
      let list = []
      for(var i=0; i<payments.length; i++) {
        list.push(payments[i].id)
      }
      PaymentService.markPrinted(list).then(response => {
        this.success('Payments has been marked printed')
        this.getAllDrafts()
        this.open = false
        this.selected.splice(0, this.selected.length)
      }).catch(err => {
        this.open = false
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
