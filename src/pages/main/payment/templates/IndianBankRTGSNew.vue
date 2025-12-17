<template>
  <div>
    <q-layout view="lHh lpr lFf" container style="height: 50px" class="">
      <q-header elevated>
        <q-toolbar>
          <q-avatar> </q-avatar>
          <q-toolbar-title>
            <div class="q-gutter-sm">
              <q-checkbox
                size="xs"
                v-model="branch"
                val="xs"
                label="Branch"
                color="yellow"
              />
              <q-checkbox
                size="xs"
                v-model="date"
                val="xs"
                label="Date"
                color="yellow"
              />
            </div>
          </q-toolbar-title>
          <q-btn
            class="q-mr-sm text-capitalize"
            color="primary"
            glossy
            size="sm"
            label="Print"
            v-print="printObj"
          />
          <q-btn
            class="text-capitalize"
            color="primary"
            glossy
            size="sm"
            label="Close"
            @click="cancelPrint"
          />
        </q-toolbar>
      </q-header>
      <q-page-container> </q-page-container>
    </q-layout>

    <div class="print-row" id="printMe">
      <div
        class="print-column"
        style="font-family: 'Arial'"
        v-for="(payment, index) of payments"
        v-bind:key="index"
      >
        <div class="row justify-center">
          <q-img
            :src="image_ulr"
            class="vertical-middle"
            loading="lazy"
            spinner-color="white"
            height="5%"
            style="max-width: 30%"
          />
        </div>
        <div class="row justify-center param">
          <b><p>Challan for remittance through RTGS/NEFT</p></b>
        </div>
        <br />
        <div class="row">
          <div class="col param" v-if="branch">
            <b>Branch: {{ payment.from_branch }}</b>
          </div>
          <div class="col param" v-else>
            <b>Branch:_______________________</b>
          </div>
          <div class="col param"></div>
          <div class="col param"></div>
          <div class="col param" v-if="date">
            <b>Date: {{ currentDate() }}</b>
          </div>
          <div class="col param" v-else><b>Date:_____/_____/__________</b></div>
        </div>
        <table style="width: 100%">
          <thead>
            <tr>
              <th scope="col" colspan="2">SENDER</th>
              <th scope="col" colspan="2">BENEFICIARY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ "Name and Address" }}</td>
              <td>
                <b>{{ payment.from_acc_name }}</b>
              </td>
              <td>{{ "Name" }}</td>
              <td>
                <b>{{ payment.to_acc_name }}</b>
              </td>
            </tr>
            <tr>
              <td>{{ "Mobile No" }}</td>
              <td>{{ payment.from_mobile }}</td>
              <td>{{ "Bank Name" }}</td>
              <td>{{ payment.to_bank }}</td>
            </tr>
            <tr>
              <td>{{ "A/C No" }}</td>
              <td>
                <b>{{ payment.from_acc_no }}</b>
              </td>
              <td>{{ "Branch Name" }}</td>
              <td>{{ payment.to_branch }}</td>
            </tr>
            <tr>
              <td>{{ "Mode of Remittance" }}</td>
              <td>{{ "Cheque" }}</td>
              <td>{{ "IFSC Code" }}</td>
              <td>
                <b>{{ payment.to_ifsc }}</b>
              </td>
            </tr>
            <tr>
              <td>{{ "Amount" }}</td>
              <td>
                <b>{{ "Rs. " + payment.amount + " /-" }}</b>
              </td>
              <td>{{ "Type of Account" }}</td>
              <td>{{ "" }}</td>
            </tr>
            <tr>
              <td>{{ "Charges" }}</td>
              <td>{{ "" }}</td>
              <td>{{ "Account No" }}</td>
              <td>
                <b>{{ payment.to_acc_no }}</b>
              </td>
            </tr>
            <tr>
              <td>{{ "Total Amount" }}</td>
              <td>{{ "" }}</td>
              <td>{{ "Amount In Words" }}</td>
              <td>
                <b>{{ payment.amount_in_words }}</b>
              </td>
            </tr>
            <tr>
              <td>{{ "Purpose of Remittance" }}</td>
              <td>{{ "" }}</td>
              <td>{{ "Excluding charges" }}</td>
              <td>{{ "" }}</td>
            </tr>
          </tbody>
        </table>
        <div class="row param">
          Remit the amount as per above details by debiting my/our account of
          the amount of remittance plus applicable charges.
        </div>
        <br />
        <div class="row justify-center">
          <u><span>Condition of Transfer</span></u>
        </div>
        <div class="row param">
          1. Remitting bank shall not be liable for any loss of damage arising
          or resulting from delay in transmission delivery or Non-delivery of
          Electronic message or any mistake, omission, or error in transmission
          of delivery thereof or in deciphering the message from any couse
          whatsover or from its misinterpretation received or the action of the
          destination Bank or any act or even beyond control.
        </div>
        <div class="row param">
          2. All payment instruction sholud be checked carefully by the
          remitter.
        </div>
        <div class="row param">
          3. Message received after cut-off time will be sent on the next
          working day.
        </div>
        <br />
        <div class="row">
          <div class="col param"><b>Date: </b></div>
          <div class="col param"></div>
          <div class="col param"></div>
          <div class="col param"><b>Authorised Signatory</b></div>
        </div>
        <hr />
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
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import print from "vue3-print-nb";
import { ref } from "vue";

export default {
  setup() {
    return {};
  },
  directives: {
    print,
  },
  props: {
    payments: { default: null, type: Array },
    done: { default: true, type: Boolean },
  },
  created() {},
  mounted() {},
  data() {
    return {
      branch: true,
      date: true,
      tab: ref("create"),
      image_ulr: require("../../../../assets/images/indian_bank.png"),
      printObj: {
        id: "printMe",
        preview: false,
        previewTitle: "Preview",
        popTitle: ".",
        url: "",
        previewBeforeOpenCallback(vue) {},
        previewOpenCallback(vue) {},
        beforeOpenCallback(vue) {},
        openCallback(vue) {},
        closeCallback(vue) {},
      },
    };
  },
  methods: {
    currentDate() {
      const current = new Date();
      const date = `${current.getDate()}/${
        current.getMonth() + 1
      }/${current.getFullYear()}`;
      return date;
    },
    cancelPrint() {
      this.$emit("clsoe");
    },
  },
};
</script>

<style>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  font-size: 10px;
}
/* Create two equal columns that floats next to each other */
.print-column {
  float: right;
  width: 50%;
  padding: 10px;
}

/* Clear floats after the columns */
.print-row:after {
  content: "";
  display: table;
  clear: both;
}

.param {
  font-size: 10px;
}

.branch {
  font-size: 10px;
}
</style>
