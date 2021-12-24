<template>
  <div>
  <q-layout view="lHh lpr lFf" container style="height: 50px" class="">
      <q-header elevated>
        <q-toolbar>
          <q-avatar>
          </q-avatar>
          <q-toolbar-title>
          </q-toolbar-title>
  
            <q-btn class="q-mr-sm" color="primary" glossy size="sm"   label="Print" v-print="printObj"/>
            <q-btn class="q-mr-sm" color="primary" glossy  size="sm"  label="Done" @click="printed" />
            <q-btn color="primary" glossy size="sm"   label="Cancel" @click="cancelPrint"/>
        </q-toolbar>
      </q-header>
      <q-page-container>  
      </q-page-container>
    </q-layout>
  <div class="row">
  </div>
    <div class="print-row" id="printMe">
      <div class="print-column" v-for="(payment, index) of payments" v-bind:key="index">
      <div class="row justify-center">
        <q-img :src="image_ulr"
          class="vertical-middle"
          loading="lazy"
          spinner-color="white"
          height="5%"
          style="max-width: 30%"/>
      </div>
      <div class="row justify-center param"> <b>Challan for remittance through RTGS/NEFT</b></div>
      <br>
      <div class="row">
        <div class="col param"><b>Branch: {{payment.fromBranch}}</b></div>
        <div class="col param"></div>
        <div class="col param"></div>
        <div class="col param"><b>Date: {{currentDate()}}</b></div>
      </div>
      <table style="width:100%;">
       <tr>
          <th scope="col" colspan="2">SENDER</th>
          <th scope="col" colspan="2">BENEFICIARY</th>
        </tr>
        <tr>
          <td>{{'Name and Address'}}</td>
          <td ><b>{{payment.fromAccount}}</b></td>
          <td>{{'Name'}}</td>
          <td><b>{{payment.toAccount}}</b></td>
        </tr>
        <tr>
          <td>{{'Mobile No'}}</td>
          <td>{{payment.fromMobile}}</td>
          <td>{{'Bank Name'}}</td>
          <td>{{''}}</td>
        </tr>
        <tr>
          <td>{{'A/C No'}}</td>
          <td><b>{{payment.fromAccountNumber}}</b></td>
          <td>{{'Branch Name'}}</td>
          <td>{{''}}</td>
        </tr>
        <tr>
          <td>{{'Mode of Remittance'}}</td>
          <td>{{'Cheque'}}</td>
          <td>{{'IFSC Code'}}</td>
          <td><b>{{payment.toIFSC}}</b></td>
        </tr>
        <tr>
          <td>{{'Amount'}}</td>
          <td><b>{{'Rs. ' + payment.amount +' /-'}}</b></td>
          <td>{{'Type of Account'}}</td>
          <td>{{''}}</td>
        </tr>
        <tr>
          <td>{{'Charges'}}</td>
          <td>{{''}}</td>
          <td>{{'Account No'}}</td>
          <td><b>{{payment.toAccountNumber}}</b></td>
        </tr>
        <tr>
          <td>{{'Total Amount'}}</td>
          <td>{{''}}</td>
          <td>{{'Amount In Words'}}</td>
          <td><b>{{payment.inWords}}</b></td>
        </tr>
        <tr>
          <td>{{'Purpose of Remittance'}}</td>
          <td>{{''}}</td>
          <td>{{'Excluding charges'}}</td>
          <td>{{''}}</td>
        </tr>
      </table>
      <div class="row param">Remit the amount as per above details by debiting my/our account of the amount of remittance plus 
      applicable charges.</div>
      <br>
      <div class="row justify-center"><u>Condition of Transfer</u></div>
      <div class="row param">1. Remitting bank shall not be liable for any loss of damage arising or resulting from delay in transmission
        delivery or Non-delivery of Electronic message or any mistake, omission, or error in transmission of delivery
        thereof or in deciphering the message from any couse whatsover or from its misinterpretation received or the action of the destination
        Bank or any act or even beyond control.
      </div>
      <div class="row param">2. All payment instruction sholud be checked carefully by the remitter.</div>
      <div class="row param">3. Message received after cut-off time will be sent on the next working day.</div>
      <br>
      <div class="row">
        <div class="col param"><b>Date: </b></div>
        <div class="col param"></div>
        <div class="col param"></div>
        <div class="col param"><b>Authorised Signatory</b></div>
      </div>
     <hr>
      <div class="row branch">For Branch Use Only</div>
      <div class="row branch">Rupees</div>
      <div class="row">
        <div class="col branch">Debited applicant's A/C</div>
        <div class="col branch">Date of Transfer</div>
      </div>
      <div class="row">
        <div class="col branch">Clerk/Shroff:</div>
        <div class="col branch">Asstt. Manager/Manager</div>
      </div>
      <br>
      </div>
    </div>
  </div>
</template>

<script>
import print from 'vue3-print-nb'
import { ref } from 'vue'

export default {
  setup () {
    return {
       
    }
  },
  directives: {
    print   
  },
  props: {
      payments: {default:null, type: Array}
  },
  created() {},
  mounted() {
      //window.prompt(JSON.stringify(this.payment))
  },
  data() {
    return {
      tab: ref('create'),
      image_ulr: require('../../../../assets/images/indian_bank.png'),
      printObj: {
              id: "printMe",
              preview: false,
              previewTitle: 'Preview',
              popTitle: 'RTGS',
              previewBeforeOpenCallback (vue) {
              },
              previewOpenCallback (vue) {
              },
              beforeOpenCallback (vue) {
              },
              openCallback (vue) {
              },
              closeCallback (vue) {
              }
      }
    };
  },
  methods: {
    currentDate() {
      const current = new Date();
      const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
      return date;
    },
    printed() {
      window.alert('document has been printed')
    },
    cancelPrint() {
      window.alert('print cancel')
    }
  }
};
</script>

<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  font-size:10px;
}
/* Create two equal columns that floats next to each other */
.print-column {
  float: left;
  width: 50%;
  padding: 10px;
}

/* Clear floats after the columns */
.print-row:after {
  content: "";
  display: table;
  clear: both;
}

.param{
   font-size:10px;
}

.branch{
  font-size:10px;
}
</style>
