<template>
  <div>
    <Payment />
    <q-table
      class="my-sticky-header-table"
      dense
      bordered
      flat
      :rows="drafts"
      :columns="columns"
      row-key="payment_id"
      :loading="loading"
      :pagination="draft_pagination"
      :filter="filter_draft"
      selection="multiple"
      v-model:selected="selected_draft"
      wrap-cells
    >
      <template v-slot:loading>
        <q-inner-loading v-if="loading" showing color="primary" label="Loading..." size="sm"/>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top-left>
        <q-btn
          v-if="print_list.length > 0"
          class="q-mt-sm q-mr-sm text-capitalize"
          color="primary"
          icon="print"
          label="Print Selected"
          size="sm"
          glossy
          @click="openPrint('CHALLAN')"
        />
        <q-btn
          v-if="print_list.length === 1"
          class="q-mt-sm q-mr-sm text-capitalize"
          color="primary"
          icon="print"
          label="Print Cheque"
          size="sm"
          glossy
          @click="openPrint('CHEQUE')"
        />
        <q-btn
          class="q-mt-sm q-mr-sm text-capitalize"
          outline
          color="primary"
          icon="refresh"
          label="Refresh"
          size="sm"
          glossy
          @click="getAllDrafts()"
        />
      </template>
      <template v-slot:top-right>
        <q-bar v-if="sum > 0"  class="bg-primary text-white q-mr-md text-weight-light shadow-4">
            <div >
              <q-icon :name="icons.rupee"/>
                {{sum.toLocaleString('en-IN') + '.00'}}
            </div>
             <q-tooltip 
                  transition-show="scale"  
                  transition-hide="scale" 
                  class="bg-primary text-white shadow-4">
                  {{getAmountInWords('sum')}}
              </q-tooltip>
          </q-bar>
        <q-input
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter_draft"
          placeholder="Search Payment"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td style="width: 90px">
            <q-btn
              size="xs"
              color="primary"
              round
              dense
              flat
              @click="expandDraft(props)"
              :icon="props.expand ? icons.expendLess : icons.expendMore"
            >
              <q-tooltip v-if="!props.expand" :delay="1000">Open payment details</q-tooltip>
              <q-tooltip v-if="props.expand" :delay="1000">Hide payment details</q-tooltip>
            </q-btn>
            <q-toggle
              v-model="props.row.print"
              size="xs"
              @click="addToPrint(props)"
              checked-icon="check"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.value !== 'undefined'">
              <span v-if="col.currency">
                <q-icon :name="icons.rupee" />
                 {{ col.value.toLocaleString("en-IN") + ".00"}}
              </span>
              <span v-else>
                {{ col.value}}
              </span>
            </span>
            <div v-else class="pointer">
              <q-btn-dropdown
                dense
                size="md"
                flat
                v-model="menu"
                class="text-capitalize text-caption"
                label="Actions"
              >
                <q-list dense>
                   <!-- <q-item clickable dense flat v-close-popup @click="sendForApproval(props.row)">
                     <q-icon name="arrow_forward" class="text-green q-mr-sm" size="sm"/>
                     <span  class="text-weight-light">Send for Approval</span>
                  </q-item> -->
                  <q-item clickable dense flat v-close-popup @click="updateDraft(props.row)">
                     <q-icon name="mode"  class="text-green q-mr-sm" size="sm"/>
                     <span  class="text-weight-light">Edit Draft</span>
                  </q-item>
                  <q-separator/>
                  <q-item clickable v-close-popup @click="deleteDraft(props.row)">
                    <q-icon name="clear" class="text-red q-mr-sm" size="sm"/>
                     <span  class="text-weight-light">Delete Draft</span>
                  </q-item>
                </q-list>
                
              </q-btn-dropdown>
            </div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-card>
              <q-card-section
                v-if="isNotNullOrUndefined(props.row.from_account)"
              >
                <div class="row bg-grey text-white text-light q-mb-sm" style="max-width: 90px;">
                  Debit Account
                </div>
                <div class="row">
                  <div class="col-2 text-bold">Account Holder</div>
                  <div class="col-3">
                    {{ props.row.from_account.accountHolder }}
                  </div>
                  <div class="col-2 text-bold">Account Number</div>
                  <div class="col-2">
                    {{ props.row.from_account.accountNumber }}
                  </div>
                  <div class="col-1 text-bold">Account Type</div>
                  <div class="col-1">
                    {{ props.row.from_account.acccountType }}
                  </div>
                </div>
                <div class="row q-mt-sm">
                  <div class="col-2 text-bold">Bank</div>
                  <div class="col-3">{{ props.row.from_account.bankName }}</div>
                  <div class="col-2 text-bold">IFSC Code</div>
                  <div class="col-2">{{ props.row.from_account.ifscCode }}</div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section v-if="isNotNullOrUndefined(props.row.to_account)">
                <div class="row bg-grey text-white text-light q-mb-sm" style="max-width: 90px;">
                  Credit Account
                </div>
                <div class="row">
                  <div class="col-2 text-bold">Account Holder</div>
                  <div class="col-3">
                    {{ props.row.to_account.accountHolder }}
                  </div>
                  <div class="col-2 text-bold">Account Number</div>
                  <div class="col-2">
                    {{ props.row.to_account.accountNumber }}
                  </div>
                </div>
                <div class="row q-mt-sm">
                  <div class="col-2 text-bold">Bank</div>
                  <div class="col-3">{{ props.row.to_account.bankName }}</div>
                  <div class="col-2 text-bold">IFSC Code</div>
                  <div class="col-2">{{ props.row.to_account.ifscCode }}</div>
                  <div class="col-1 text-bold">Branch</div>
                  <div class="col-1">
                    {{ props.row.to_account.branchName }}
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="row">
                  <div class="text-bold">Amount:</div>
                </div>
                <div class="row q-mb-md">
                  <q-icon :name="icons.rupee" />
                  <div class="col text-bold">
                    {{
                      props.row.amount.toLocaleString("en-IN") +
                      ".00" +
                      " (Rupees " +
                      props.row.amount_in_words +
                      ")"
                    }}
                  </div>
                </div>
                <div class="row">
                  <div class="text-bold">Payment Description:</div>
                </div>
                <div class="row wrap">
                  <div class="col-1 wrap">{{ props.row.remark }}</div>
                </div>
              </q-card-section>
            </q-card>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog
      v-model="update_draft"
      persistent
      @hide="resetDraft"
      ref="updateDraftRef"
    >
      <q-card class="my-card" style="width: 1000px; max-width: 100vw">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ "Update Draft" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="text-bold q-mb-md">Transaction Details</div>
          <div class="row q-mr-sm">
            <div class="col-2 q-mr-sm">
              <q-input
                dense
                readonly
                outlined
                v-model="payment_amount"
                label="Amount"
                placeholder="Enter payment amount"
                full-width
              >
                <template v-slot:prepend>
                  <q-icon :name="icons.rupee" />
                </template>
              </q-input>
            </div>
            <div class="col-3 q-mr-sm">
              <q-input
                dense
                outlined
                v-model="payment_date"
                :rules="['DD-MM-YYYY']"
                label="Transaction Date"
                :placeholder="'dd-mm-yyyy'"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="payment_date" mask="DD-MM-YYYY">
                        <div class="row items-center justify-end">
                          <q-btn
                            class="text-capitalize"
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-3 q-mr-sm">
              <q-select
                :readonly="payment_mode === 'Cash' ? true : false"
                label="Select Payment Mode"
                behavior="menu"
                dense
                outlined
                v-model="payment_mode"
                :options="payment_mode_options"
              >
              </q-select>
            </div>
            <div class="col-3">
              <q-input :readonly="payment_mode === 'Cash' ? true : false"
                dense
                outlined
                v-model="transaction_ref"
                label="Cheque/Transaction No"
                placeholder="Check No / UTR No / Transaction Ref No"
                full-width
              />
            </div>
            <div class="text-caption text-italic">
              <b>In Words:</b>{{ amount_in_words }}
            </div>
          </div>
          <div class="row q-mt-sm">
            <q-input
              style="width: 100%"
              type="textarea"
              dense
              outlined
              v-model="payment_remark"
              placeholder="Write some comment"
            />
          </div>
          <q-separator class="row q-mb-sm" />
          <div class="text-bold">Select a payment reason</div>
          <div class="row q-mb-sm">
            <div class="col-6">
              <q-option-group
                :options="payment_reason_options"
                type="radio"
                v-model="payment_reason"
              />
            </div>
            <div class="col-4" v-if="payment_reason === 'site'">
              <q-select
                label="Select Site"
                behavior="menu"
                dense
                outlined
                v-model="selected_site"
                :options="sites"
                option-label="display_name"
                option-value="id"
              >
              </q-select>
            </div>
            <div class="col-4" v-if="payment_reason === 'machine'">
              <q-select
                label="Select Machine"
                behavior="menu"
                dense
                outlined
                v-model="selected_machine"
                :options="machines"
                option-label="name"
                option-value="id"
              >
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space />
          <q-btn
            class="text-capitalize text-weight-light q-mr-sm"
            color="primary"
            label="Update Draft"
            @click="saveDraft('DRAFT')"
          />
          <q-btn
            class="text-capitalize text-weight-light q-mr-sm"
            color="primary"
            label="Send for Approval"
            @click="saveDraft('APPROVAL_REQUIRED')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <q-dialog v-model="open" persistent @hide="onHide" ref="createPaymentRef">
        <q-card flat bordered style="width: 1000px; max-width: 80vw">
          <IndianBankRTGS
            v-if="print_list.length > 0"
            :payments="payments"
            @clsoe="close"
          >
          </IndianBankRTGS>
        </q-card>
      </q-dialog>
      <q-dialog v-model="openCheque" persistent @hide="onHide" ref="createPaymentRef">
        <q-card flat bordered style="width: 1000px; max-width: 80vw">
          <Cheque
            v-if="print_list.length === 1"
            :payments="payments"
            @clsoe="close"
          >
          </Cheque>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import SiteService from "../../../services/SiteService";
import MachineService from "../../../services/MachineService";
import { commonMixin } from "../../../mixin/common";
import Payment from "../payment/Payment.vue";
import PaymentService2 from "../../../services/PaymentService2";
import BankAccountService from "../../../services/BankAccountService";
import PartyAccountService from "../../../services/PartyAccountService";
import IndianBankRTGS from "../payment/templates/IndianBankRTGSNew.vue";
import Cheque from "../payment/templates/Cheque.vue";
import {
  matCurrencyRupee,
  matEdit,
  matDelete,
  matExpandMore,
  matExpandLess,
} from "@quasar/extras/material-icons";
import { ref } from "vue";
export default {
  name: "PaymentDraft",
  mixins: [commonMixin],
  setup() {
    return {
      selected_draft: ref([]),
      step: ref(1),
      

      icons: {
        rupee: matCurrencyRupee,
        delete: matDelete,
        edit: matEdit,
        expendMore: matExpandMore,
        expendLess: matExpandLess,
      },
    };
  },
  components: {
    Payment,
    IndianBankRTGS,
    Cheque
  },
  watch: {
    payment_reason(val) {
      if (val === "site") {
        this.selected_machine = null;
      } else if (val === "machine") {
        this.selected_site = null;
      } else {
        this.selected_machine = null;
        this.selected_site = null;
      }
    },
  },
  created() {},
  mounted() {
    this.getAllSites();
    this.getAllMachines();
    this.getAllDrafts();
  },
  data() {
    return {
      client_id: this.getClientId(),
      draft_pagination: { rowsPerPage: 25 },
      sum: 0,
      columns: [
        {
          name: "party_nick_name",
          required: true,
          label: "Party",
          align: "left",
          field: row => this.getPartyNames(row.party_id,'nick_name'),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "party_name",
          align: "left",
          label: "Party Legal Name",
          field: row => this.getPartyNames(row.party_id,'name'),
          sortable: true,
        },
        {
          name: "amount",
          align: "left",
          label: "Amount",
          field: "amount",
          sortable: true,
          currency: true,
        },
        {
          name: "reason",
          align: "left",
          label: "Reason",
          field: "reason",
          sortable: true,
        },
        {
          name: "reason_name",
          align: "left",
          label: "Payment For",
          field: "reason_name",
          sortable: true,
        },
        {
          name: "mode",
          align: "left",
          label: "Mode",
          field: "mode",
          sortable: true,
        },
        {
          name: "transaction_ref",
          align: "left",
          label: "Cheque/UTR No",
          field: "transaction_ref",
          sortable: true,
        },
        {
          name: "payment_date",
          align: "left",
          label: "Payment Date",
          field: "payment_date",
          sortable: true,
        },
        {
          name: "actions",
          label: "",
          required: true,
          align: "center",
          field: "actions",
          format: (val) => `${val}`,
        },
      ],
      drafts: [],
      loading: false,
      filter_draft: "",
      update_draft: false,
      payment_amount: null,
      amount_in_words: "",
      payment_date: null,
      payment_mode: null,
      payment_mode_options: ["Cheque", "Netbanking", "Cash", "UPI"],
      transaction_ref: null,
      payment_remark: null,
      payment_reason: "",
      payment_reason_options: [
        { label: "Site", value: "site" },
        { label: "Machine/Vehicle", value: "machine" },
        { label: "Personal", value: "personal" },
        { label: "Other", value: "other" },
      ],
      selected_site: null,
      sites: [],
      selected_machine: null,
      machines: [],
      tempDraft: {},
      tempPayment: {},
      tempPaymentSummary: {},
      print_list: [],
      open: false,
      payments: [],
      openCheque: false
    };
  },
  methods: {
    getAmountInWords(mode) {
      if (this.sum > 0)
        this.in_words =
          PaymentService2.convertNumberToWords(this.sum) + "Only";
      else this.in_words = "";

      return this.in_words;
    },
    openPrint(val) {
      this.payments.splice(0, this.payments.length);
      for (let p of this.print_list) {
        let payment = {};
        payment.from_acc_name = p.from_account.accountHolder;
        payment.from_acc_no = p.from_account.accountNumber;
        payment.from_branch = p.from_account.branchName;
        payment.from_mobile = p.from_account.mobileNo;

        payment.to_acc_name = p.to_account.accountHolder;
        payment.to_acc_no = p.to_account.accountNumber;
        payment.to_ifsc = p.to_account.ifscCode;
        payment.to_branch = p.to_account.branchName;
        payment.to_bank = p.to_account.bankName;

        payment.amount = p.amount;
        payment.amount_in_words = p.amount_in_words;

        this.payments.push(payment);
      }
      if(val === 'CHALLAN')
        this.open = true;
      else
        this.openCheque = true
    },
    close() {
      this.onHide();
    },
    onHide() {
      this.open = false;
      this.openCheque = false
    },
    addToPrint(props) {
      if(props.row.mode === 'Cash') {
        props.row.print = false
        this.info('Cash payment can not be printed')
        return
      }
      if (this.print_list.length === 2 && props.row.print) {
        this.fail("Maximum two payments can be printed");
        props.row.print = !props.row.print;
        return;
      }
      let print_object = {};
      print_object.payment_id = props.row.payment_id;
      print_object.amount = props.row.amount;
      print_object.amount_in_words = props.row.amount_in_words;
      if (props.row.print) {
        BankAccountService.accountById(
          this.client_id,
          props.row.from_account_id
        )
          .then((response) => {
            print_object.from_account = response;
            PartyAccountService.accountById(
              this.client_id,
              props.row.to_account_id
            )
              .then((response) => {
                print_object.to_account = response;
                this.print_list.push(print_object);
                // window.alert(JSON.stringify(this.print_list));
                console.log(JSON.stringify(this.print_list));
              })
              .catch((err) => {
                this.fail(this.getErrorMessage(err));
              });
          })
          .catch((err) => {
            this.fail(this.getErrorMessage(err));
          });
      } else {
        this.print_list = this.print_list.filter(
          (item) => item.payment_id !== props.row.payment_id
        );
        // window.alert(JSON.stringify(this.print_list));
      }
    },
    openUpdateDraftDialog() {
      this.update_draft = true;
    },
    resetDraft() {
      this.tempDraft = {};
      this.tempPaymentSummary = {};
      this.tempPayment = {};
    },
    getAllSites() {
      SiteService.all(this.client_id)
        .then((response) => {
          this.sites.splice(0, this.sites.length);
          this.sites = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllMachines() {
      MachineService.all(this.client_id)
        .then((response) => {
          this.machines.splice(0, this.machines.length);
          this.machines = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    deleteDraft(draft) {
      console.log(JSON.stringify(draft));
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "This will delete the draft permanently.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          PaymentService2.deletePayment(
            this.client_id,
            draft.payment_id,
            "DRAFT"
          )
            .then((response) => {
              if (response === 0) {
                this.getAllDrafts();
                this.success("Draft has been deleted");
              }
            })
            .catch((err) => {
              this.loading = false;
              this.fail(this.getErrorMessage(err));
            });
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    updateDraft(draft) {
      console.log(JSON.stringify(draft));
      console.log("Getting Payment Draft");
      PaymentService2.getPayment(this.client_id, draft.payment_id)
        .then((response) => {
          this.tempDraft = response;
          this.tempPayment = JSON.parse(this.tempDraft.payment);
          this.tempPaymentSummary = JSON.parse(this.tempDraft.payment_summary);

          this.payment_amount = this.tempPayment.payment_amount;
          this.amount_in_words = this.tempPayment.amount_inwords;
          this.payment_date = this.tempDraft.payment_date;
          this.payment_mode = this.tempPayment.payment_mode;
          this.transaction_ref = this.tempPayment.transaction_ref;
          this.payment_remark = this.tempPayment.payment_remark;
          this.payment_reason = this.tempPayment.payment_reason;
          this.selected_site = this.tempPayment.site;
          this.selected_machine = this.tempPayment.machine;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
      this.openUpdateDraftDialog();
    },
    // sendForApproval(draft) {
    //   this.payment_date = draft.payment_date
    //   this.payment_mode = draft.mode
    //   this.saveDraft('APPROVAL_REQUIRED')
    // },
    saveDraft(mode) {

      if(this.payment_date === null || this.payment_date === '') {
        this.fail('Please enter payment date')
        return;
      }
      let payment = {
        id: this.tempDraft.id,
        client_id: this.client_id,
        payment: null,
        payment_summary: null,
        payment_date: this.payment_date,
      };

      if (mode === "DRAFT") {
        payment.status = "DRAFT";
      } else if (mode === "APPROVAL_REQUIRED") {
        if (this.isNullOrUndefined(this.payment_date)) {
          this.fail("Please select payment date");
          return;
        }
        if (this.isNullOrUndefined(this.payment_reason)) {
          this.fail("Please select paymet reason");
          return;
        }
        if (this.isNullOrUndefined(this.payment_mode)) {
          this.fail("Please select paymet mode");
          return;
        }
        if (this.isNullOrUndefined(this.transaction_ref) && this.payment_mode !== 'Cash') {
          this.fail("Please enter cheque no/transaction reference number");
          return;
        }
        if (this.isNullOrUndefined(this.payment_remark)) {
          this.fail("Please enter payment description/remark");
          return;
        }
        if (this.payment_reason === "") {
          this.fail("Please select payment reason");
          return;
        }
        payment.status = "APPROVAL_REQUIRED";
      }

      let payment_details = {
        party: this.tempPayment.party,
        from_account: this.tempPayment.from_account,
        to_account: this.tempPayment.to_account,
        payment_amount: this.tempPayment.payment_amount,
        amount_inwords: this.tempPayment.amount_inwords,
        payment_reason: this.payment_reason,
        site: this.selected_site,
        machine: this.selected_machine,
        payment_mode: this.payment_mode,
        transaction_ref: this.transaction_ref,
        payment_remark: this.payment_remark,
      };

      let payment_summary = {
        party_id: payment_details.party.id,
        party_name: this.tempPaymentSummary.party_name,
        party_nick_name: this.tempPaymentSummary.party_nick_name,
        from_account_id: this.tempPaymentSummary.from_account_id,
        to_account_id: this.tempPaymentSummary.to_account_id,
        amount: this.tempPaymentSummary.amount,
        amount_in_words: this.tempPaymentSummary.amount_in_words,
        mode: this.payment_mode,
        transaction_ref: this.transaction_ref,
        remark: this.payment_remark,
        reason: this.payment_reason,
      };

      if (this.payment_reason === "site") {
        if (this.selected_site === null) {
          this.fail("Please select site");
          return;
        }
        payment_summary.reasonId = this.selected_site.id;
        payment_summary.reason_name = this.selected_site.display_name;
      } else if (this.payment_reason === "machine") {
        if (this.selected_machine === null) {
          this.fail("Please select machine");
          return;
        }
        payment_summary.reasonId = this.selected_machine.id;
        payment_summary.reason_name = this.selected_machine.name;
      }

      payment.payment = JSON.stringify(payment_details);
      payment.payment_summary = JSON.stringify(payment_summary);

      PaymentService2.savePayment(payment)
        .then((response) => {
          console.log(response);
          this.resetDraft();
          if (mode === "DRAFT") {
            this.success("Draft updated successfully");
          } else if (mode === "APPROVAL_REQUIRED") {
            this.success("Payment sent for approval");
          }
          this.getAllDrafts();
          this.update_draft = false;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllDrafts() {
      this.sum = 0
      this.print_list = [];
      this.loading = true;
      PaymentService2.getAllDrafts(this.client_id, "DRAFT")
        .then((response) => {
          this.drafts.splice(0, this.drafts.length);
          this.drafts = response;
          for(let d of this.drafts) {
            this.sum = this.sum +  d.amount
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    expandDraft(props) {
      console.log(JSON.stringify(props.row))
      if(props.row.mode === 'Cash') {
        props.expand = !props.expand;
        return
      }
  
      if (!props.expand) {
        BankAccountService.accountById(
          this.client_id,
          props.row.from_account_id
        )
          .then((response) => {
            props.row.from_account = response;
          })
          .catch((err) => {
            this.fail(this.getErrorMessage(err));
          });
        PartyAccountService.accountById(this.client_id, props.row.to_account_id)
          .then((response) => {
            props.row.to_account = response;
          })
          .catch((err) => {
            this.fail(this.getErrorMessage(err));
          });
      }
      props.expand = !props.expand;
    },
  },
};
</script>