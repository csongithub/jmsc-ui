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
      selection="single"
      v-model:selected="selected_draft"
    >
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
          class="q-mt-sm q-mr-sm text-capitalize"
          color="primary"
          label="Approve All"
          size="sm"
          glossy
          @click="adminApproval(null, 'all')"
        />
        <q-btn
          v-if="selected_list.length > 0"
          class="q-mt-sm q-mr-sm text-capitalize"
          color="primary"
          icon="print"
          label="Print Selected"
          size="sm"
          glossy
          @click="openPrint"
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
        <q-btn
          class=""
          color="primary"
          flat
          :icon="icons.range"
          @click="selectRange = !selectRange"
        >
          <q-tooltip :delay="500"
            >Select Payments Date or Payments Between dates</q-tooltip
          >
        </q-btn>
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
          <q-td auto-width>
            <q-btn
              size="sm"
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
              @click="selectPayment(props)"
              checked-icon="check"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.value !== 'undefined'">
              <span v-if="col.currency">
                <q-icon :name="icons.rupee" />
                {{ col.value.toLocaleString("en-IN") + ".00" }}
              </span>
              <span v-else>
                {{ col.value }}
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
                  <q-item clickable dense flat v-close-popup @click="adminApproval(props.row, 'single')">
                     <q-icon name="check" class="text-green q-mr-sm" size="sm"/>
                     <span  class="text-weight-light">Approve Payment</span>
                  </q-item>
                  <q-separator/>
                  <q-item clickable v-close-popup @click="backToDraft(props.row)">
                    <q-icon name="arrow_back" class="text-orange q-mr-sm" size="sm"/>
                     <span  class="text-weight-light">Back to Draft</span>
                  </q-item>
                  <q-separator/>
                  <q-item clickable v-close-popup @click="deleteDraft(props.row)">
                    <q-icon name="clear" class="text-red q-mr-sm" size="sm"/>
                     <span  class="text-weight-light">Delete Payment</span>
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
                <div
                  class="row bg-grey text-white text-light q-mb-sm"
                  style="max-width: 90px"
                >
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
                <div
                  class="row bg-grey text-white text-light q-mb-sm"
                  style="max-width: 90px"
                >
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
  </div>
  <div>
      <q-dialog v-model="selectRange" persistent ref="selectDateRef">
        <q-card flat bordered>
          <q-date v-model="range" range today-btn />
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize"
              color="primary"
              flat
              @click="cancelRange"
              >cancel</q-btn
            >
            <q-btn
              class="text-capitalize"
              color="primary"
              flat
              @click="getForSelectedRange"
              >ok</q-btn
            >
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  <div>
    <q-dialog v-model="open" persistent @hide="onHide" ref="createPaymentRef">
      <q-card flat bordered style="width: 1000px; max-width: 80vw">
        <IndianBankRTGS
          v-if="selected_list.length > 0"
          :payments="payments"
          @clsoe="close"
        >
        </IndianBankRTGS>
      </q-card>
    </q-dialog>
  </div>
  <AdminAuth
    :options="openAuthorization"
    :title="authTitle"
    :message="authMessage"
    :data="authData"
    :actionLabel="actionLabel"
    @cancel="cancelAuth"
    @success="postApproval"
  ></AdminAuth>
</template>

<script>
import AdminAuth from "../../auth/AdminAuth";
import { commonMixin } from "../../../mixin/common";
import Payment from "../payment/PaymentNew.vue";
import PaymentService2 from "../../../services/PaymentService2";
import BankAccountService from "../../../services/BankAccountService";
import PartyAccountService from "../../../services/PartyAccountService";
import IndianBankRTGS from "../payment/templates/IndianBankRTGSNew.vue";
import {
  matCurrencyRupee,
  matExpandMore,
  matExpandLess,
  matDateRange
} from "@quasar/extras/material-icons";
import { ref } from "vue";
export default {
  name: "PaymentDraft",
  mixins: [commonMixin],
  setup() {
    return {
      selected_draft: ref([]),
      step: ref(1),
      columns: [
        {
          name: "party_nick_name",
          required: true,
          label: "Party",
          align: "left",
          field: (row) => row.party_nick_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "party_name",
          align: "left",
          label: "Party Legal Name",
          field: "party_name",
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

      icons: {
        rupee: matCurrencyRupee,
        expendMore: matExpandMore,
        expendLess: matExpandLess,
        range: matDateRange,
      },
    };
  },
  components: {
    Payment,
    AdminAuth,
    IndianBankRTGS,
  },
  watch: {},
  created() {},
  mounted() {
    this.getAllDrafts();
  },
  data() {
    return {
      openAuthorization: false,
      authTitle: "",
      authMessage: "",
      authData: null,
      actionLabel: 'Approve',
      approval_mode: null,
      client_id: this.getClientId(),
      draft_pagination: { rowsPerPage: 25 },
      drafts: [],
      loading: false,
      filter_draft: "",

      tempDraft: {},
      tempPayment: {},
      tempPaymentSummary: {},
      selected_list: [],
      open: false,
      payments: [],
      selectRange: false,
      range: ref({ from: "", to: "" }),
    };
  },
  methods: {
    cancelRange() {
      this.selectRange = false;
      this.range = { from: "", to: "" };
    },
    getForSelectedRange() {
      let range = {};
      if (this.range.from !== undefined && this.range.to !== undefined) {
        range = {
          from: this.range.from,
          to: this.range.to,
        };
      } else {
        range = {
          from: this.range,
          to: this.range,
        };
      }

      let req = {
        range: range,
      };
      // window.alert(JSON.stringify(req))
      PaymentService2.paymentsBetweenDates(this.client_id, "APPROVAL_REQUIRED", req)
        .then((response) => {
          this.drafts.splice(0, this.drafts.length);
          this.drafts = response;
          this.cancelRange();
        })
        .catch((err) => {});
    },
    openPrint() {
      this.payments.splice(0, this.payments.length);
      for (let p of this.selected_list) {
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
      this.open = true;
    },
    close() {
      this.onHide();
    },
    onHide() {
      this.open = false;
    },
    selectPayment(props) {
      if (props.row.mode === "Cash") {
        this.info("Cash payment can not be printed");
        props.row.print = false;
        return;
      }
      if (this.selected_list.length === 2 && props.row.print) {
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
                this.selected_list.push(print_object);
                // window.alert(JSON.stringify(this.selected_list));
                console.log(JSON.stringify(this.selected_list));
              })
              .catch((err) => {
                this.fail(this.getErrorMessage(err));
              });
          })
          .catch((err) => {
            this.fail(this.getErrorMessage(err));
          });
      } else {
        this.selected_list = this.selected_list.filter(
          (item) => item.payment_id !== props.row.payment_id
        );
        //  window.alert(JSON.stringify(this.selected_list));
      }
    },
    adminApproval(draft, approval_mode) {
      this.approval_mode = approval_mode;
      this.openAuth(
        "Approve",
        "Please enter the admin password",
        true,
        draft,
        "Approve"
      );
    },
    reject(draft, approval_mode) {
      this.approval_mode = approval_mode;
      this.openAuth(
        "Reject",
        "Please enter the admin password",
        true,
        draft,
        "Reject"
      );
    },
    openAuth(title, message, options, data, actionLabel) {
      this.authTitle = title
      this.authMessage = message
      this.openAuthorization = options
      this.authData = data
      this.actionLabel = actionLabel
    },
    cancelAuth(val) {
      this.openAuthorization = val;
    },
    postApproval(draft) {
      console.log('Draft' + JSON.stringify(draft));
      if (this.approval_mode === "single") {
        this.approveSingle(draft);
      } else if (this.approval_mode === "all") {
        this.approveAll();
      }
    },
    approveAll() {
      let approval_begins = false
      let self = this
      for (let payment of this.drafts) {
        PaymentService2.approvePayment(this.client_id, payment.payment_id)
          .then((response) => {
            if (response === 0) {
              self.getAllDrafts();
              self.success("All payments has been approved");
              // if(self.isNotNullOrUndefined(payment.to_account_id)) {
              //   self.linkPartyAccount(payment.party_id, payment.to_account_id)
              // }
            }
          })
          .catch((err) => {
            self.fail(this.getErrorMessage(err));
          });
      }
      //Update Party linkage account
      for (let draft of this.drafts) {
          if(self.isNotNullOrUndefined(draft.to_account_id)) {
          self.linkPartyAccount(draft.party_id, draft.to_account_id)
        }
      }
    },
    approveSingle(draft) {
      let self = this
      PaymentService2.approvePayment(this.client_id, draft.payment_id)
        .then((response) => {
          if (response === 0) {
            self.getAllDrafts();
            self.success("Payment has been approved");
            //Check if the payment is account payment and link to ther party
            if(this.isNotNullOrUndefined(draft.to_account_id)) {
              self.linkPartyAccount(draft.party_id, draft.to_account_id)
            }
          }
        })
        .catch((err) => {
          self.fail(self.getErrorMessage(err));
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
            "APPROVAL_REQUIRED"
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
    backToDraft(draft) {
      console.log(JSON.stringify(draft));
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "The payment will move to draft.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.backToDraftInternal(draft)
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    backToDraftInternal(draft) {
      let self = this
      PaymentService2.rejectPayment(this.client_id, draft.payment_id)
        .then((response) => {
          if (response === 0) {
            // self.getAllDrafts();
            this.drafts.splice(this.drafts.findIndex(d => d.payment_id === draft.payment_id) , 1)
            self.success("Payment has been rejected");
          }
        })
        .catch((err) => {
          self.fail(self.getErrorMessage(err));
        });
    },
    linkPartyAccount(party_id, account_id){
      PaymentService2.linkPartyAccount(this.client_id, party_id, account_id)
        .then((response) => {
          if (response === 0) {
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllDrafts() {
      this.selected_list = [];
      this.loading = true;
      PaymentService2.getAllDrafts(this.client_id, "APPROVAL_REQUIRED")
        .then((response) => {
          this.drafts.splice(0, this.drafts.length);
          this.drafts = response;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    expandDraft(props) {
      console.log(JSON.stringify(props.row));
      if (props.row.mode === "Cash") {
        props.expand = !props.expand;
        return;
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