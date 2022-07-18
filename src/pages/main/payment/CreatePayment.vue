<template>
    <div>
        <Payment/>

        <div class="q-pa-md">
            <div class="row">
              <div class="col param">
                <q-select label="Select From Account"
                  behavior="menu"
                  :lazy-rules="true"
                  :rules="[val => !!val || 'Select From Account']"
                  dense outlined v-model="fromAccount" :options="accounts"
                  option-label="displayName" option-value="id">
                </q-select>
              </div>
              <div class="col param">
                <q-btn v-if="selected.length > 0" class="q-ml-sm text-capitalize text-weight-light text-subtitle2" 
                  color="primary"
                  label="Create" 
                  size="md"
                  glossy 
                  @click="openCreatePaymentDialog()"
                />
              </div>
            </div>
           
        </div>
        <div v-if="fromAccount !== null">
        <q-table
        class="my-sticky-header-table"
        title="Select Party Account"
        dense
        bordered
        flat
        :rows="partyAccounts"
        :columns="columns"
        row-key="accountNumber"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        selection="single"
        v-model:selected="selected"
      >
        <template v-slot:top-right>
        <!-- <q-btn v-if="selected.length > 0" class="q-mt-sm q-mr-sm" 
               color="primary"
               label="Create" 
               size="md"
               glossy 
               @click="openCreatePaymentDialog()"
              /> -->
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
      <q-dialog
        v-model="open"
        persistent
        @before-show="beforeShow"
        @hide="onHide"
        ref="createPaymentRef"
      >
        <q-card flat bordered style="width: 750px; max-width: 90vw;">
          <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ dialogLabel }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <div class="row q-ma-sm">
            <div class="col from q-mr-sm">
              <q-card class="my-card">
              <q-card-section>
              <div class="row">
                <div class="col">
                  <q-bar class="bg-primary text-white text-weight-light  q-mb-md">{{'From Account'}}</q-bar>
                </div>
              </div>
              <div class="row">
                <div class="col-4">Name:</div>
                <div class="col">{{fromAccount.accountHolder}}</div>
              </div>
              <div class="row">
                <div class="col-4">Bank:</div>
                <div class="col">{{fromAccount.bankName}}</div>
              </div>
              <div class="row">
                <div class="col-4">Account No:</div>
                <div class="col">{{fromAccount.accountNumber}}</div>
              </div>
              <div class="row">
                <div class="col-4">IFSC:</div>
                <div class="col">{{fromAccount.ifscCode}}</div>
              </div>
              </q-card-section>
              </q-card>
            </div>
            <div class="col to">
              <q-card class="my-card">
              <q-card-section>
              <div class="row">
                <div class="col">
                  <q-bar class="bg-primary text-white text-weight-light q-mb-md">{{'To Account'}}</q-bar>
                </div>
              </div>
              <div class="row">
                <div class="col-4">Party:</div>
                <div class="col">{{selected[0].partyName}}</div>
              </div>
              <div class="row">
                <div class="col-4">Account Holder:</div>
                <div class="col">{{selected[0].accountHolder}}</div>
              </div>
              <div class="row">
                <div class="col-4">Bank:</div>
                <div class="col">{{selected[0].bankName}}</div>
              </div>
              <div class="row">
                <div class="col-4">Account No:</div>
                <div class="col">{{selected[0].accountNumber}}</div>
              </div>
              <div class="row">
                <div class="col-4">IFSC:</div>
                <div class="col">{{selected[0].ifscCode}}</div>
              </div>
              </q-card-section>
              </q-card>
            </div>
          </div>
          
           <div class="q-ma-sm">
           <q-input class="q-mt-md"
                dense
                outlined
                v-model="paymentDraft.amount"
                label="Enter Payment Amount"
                full-width
                lazy-rules
                :rules="[val => (val && val > 0) || 'Enter valid amount']"
              />
            <div class="text-caption text-italic"><b>In Words:</b>{{getWords()}}</div>
            <q-input class="q-mt-md"
                dense
                outlined
                v-model="paymentDraft.note"
                label="Write a note here"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'What is the purpose of this payment']"
              />
           </div>
           <q-separator />
          <q-card-section>
            <q-form @submit="createPayment" @reset="cancelPayment">
              
              <div>
                <q-btn
                  dense
                  glossy
                  size="sm"
                  :label="'Create'"
                  type="submit"
                  color="primary"
                  class="text-capitalize q-px-md"
                />
                <q-btn
                  dense
                  glossy
                  size="sm"
                  label="Cancel"
                  type="reset"
                  class="text-capitalize q-px-md q-mx-sm"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
import PartyAccountService from "../../../services/PartyAccountService"
import Payment from "../payment/Payment.vue"
import PaymentService from "../../../services/PaymentService"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { ref } from 'vue'
export default {
  name: 'CreatePayments',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      columns: [
        {
          name: "partyName",
          required: true,
          label: "Party Name",
          align: "left",
          field: row => row.partyName,
          format: val => `${val}`,
          sortable: true
        },
        {name: "accountHolder",  align: "left", label: "Account Holder", field: "accountHolder", sortable: true},
        {name: "accountNumber",  align: "left", label: "Account Number", field: "accountNumber", sortable: true},
        {name: "ifscCode",  align: "left", label: "IFSC Code", field: "ifscCode", sortable: true},
        {name: "bankName",  align: "left", label: "Bank", field: "bankName", sortable: true},
        {name: "branchName",  align: "left", label: "Branch", field: "branchName", sortable: true},
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit
      },
    }
  },
  components: {
    Payment
  },
  created() {},
  mounted() {
   this.getActiveAccounts()
   this.getPartyAccounts()
  },
  data() {
    return {
      clientId: this.getClientId(),
      myPagination: { rowsPerPage: 15 },
      filter: "",
      loading: true,
      partyAccounts: [],
      open: false,
      dialogLabel: "Create Payment",
      accounts: [],
      fromAccount: null,
      paymentDraft: {
          fromAccount: null,
          toAccount: null,
          amount: 0.0,
          inWords:'',
          note:''
      }
    };
  },
  methods: {
    getActiveAccounts() {
      PaymentService.getActiveAccounts(this.clientId)
        .then(response => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts = response; 
      }).catch(err => {
       this.fail('Error in loading active accounts')
      });
    },
    getPartyAccounts() {
      this.loading = true;
      PartyAccountService.getPartyAccounts(this.clientId)
        .then(response => {
        this.partyAccounts.splice(0, this.partyAccounts.length)
        this.partyAccounts = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
         this.fail('Error in loading party accounts')
      });
    },
    getWords() {
        if(this.paymentDraft.amount > 0)
            this.paymentDraft.inWords = PaymentService.convertNumberToWords(this.paymentDraft.amount) + 'Only'
        else
            this.paymentDraft.inWords = ''
        
        return this.paymentDraft.inWords;
    },
    openCreatePaymentDialog() {
        this.open = true;
    },
    beforeShow () {
        this.paymentDraft.amount = 0.0
        this.paymentDraft.inWords = ''
    },
    onHide() {

    },
    createPayment() {
        this.paymentDraft.fromAccount = this.fromAccount
        this.paymentDraft.toAccount = this.selected[0]
        let draft = {
            clientId: this.clientId,
            id:null,
            status: 'CREATED',
            draftJson: JSON.stringify(this.paymentDraft)
        }
        PaymentService.createDraft(draft)
        .then(response => {
            this.success('Payment Created');
             this.open = false;
      }).catch(err => {
       this.fail('Error in Creating Payment')
      });
    },
    cancelPayment() {
         this.open = false;
    }
  }
};
</script>