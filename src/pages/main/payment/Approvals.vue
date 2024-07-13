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
      :visible-columns="visibleColumns"
      :loading="loading"
      :pagination="draft_pagination"
      :filter="filter_draft"
      selection="single"
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
        <q-btn v-if="isAdmin || permissions.approvePayments"
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
        <div class="row q-mt-sm bg-grey" v-if="filter_criteria.show">
          <q-icon :name="icons.filter" color="primary"/>
          <div class="col q-mr-sm" v-if="filter_criteria.from_account">
            <span >{{'From A/C: ' + filter_criteria.from_account}}</span>
          </div>
          <div class="col q-mr-sm" v-if="filter_criteria.to_account">
            <span >{{'To A/C: ' + filter_criteria.to_account}}</span>
          </div>
          <div class="col" v-if="filter_criteria.party_name">
            <span >{{'Party Name/Nick Name: ' + filter_criteria.party_name}}</span>
          </div>
        </div>
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
        <span v-if="showLabel && range.from !== undefined">Payments Between:<b> {{range.from + ' to ' + range.to}}</b></span>
        <span v-else-if="showLabel">Payments On : <b>{{range}}</b></span>
        <q-btn
          class=""
          color="primary"
          flat
          :icon="icons.filter"
          @click="openFilterWindow()"
        >
          <q-tooltip :delay="500"
            >Apply Filters</q-tooltip
          >
        </q-btn>
        <q-btn
          class=""
          color="primary"
          flat
          :icon="icons.range"
          @click="showDateSelector()"
        >
          <q-tooltip :delay="500"
            >Select Payments Date or Payments Between dates</q-tooltip
          >
        </q-btn>
        <q-input class="q-mr-sm"
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
          />
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
              @click="selectPayment(props)"
              checked-icon="check"
            />
          </q-td>
          <q-td key="payment_id" :props="props">{{props.row.payment_id}}</q-td>
          <q-td key="party_nick_name" :props="props">{{props.row.party_nick_name}}</q-td>
          <q-td key="party_name" :props="props">{{props.row.party_nick_name}}</q-td>
          <q-td key="account_holder" :props="props">{{props.row.account_holder}}</q-td>
           <q-td key="account_number" :props="props">{{props.row.account_number}}</q-td>
          <q-td key="amount" :props="props"> 
                <q-icon :name="icons.rupee" />
                {{ props.row.amount.toLocaleString("en-IN") + ".00" }}
          </q-td>
          <q-td key="reason" :props="props">{{props.row.reason}}</q-td>
          <q-td key="reason_name" :props="props">{{props.row.reason_name}}</q-td>
          <q-td key="mode" :props="props">{{props.row.mode}}</q-td>
          <q-td key="transaction_ref" :props="props">{{props.row.transaction_ref}}</q-td>
          <q-td key="payment_date" :props="props">{{props.row.payment_date}}</q-td>
          <q-td key="actions">
            <q-btn-dropdown
                dense
                size="md"
                flat
                v-model="menu"
                class="text-capitalize text-caption"
                label="Actions"
              >
                <q-list dense>
                  <q-item v-if="isAdmin || permissions.approvePayments" clickable dense flat v-close-popup @click="adminApproval(props.row, 'single')">
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
                <div class="row">
                  <div class="col">{{ props.row.remark }}</div>
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
              @click="hideDateSelector"
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
            <q-dialog v-model="filter_window" persistent ref="filterRef">
        <q-card flat bordered style="width: 400px; max-width: 80vw"> 
          <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
          {{ "Apply Filters" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
          <q-card-section>
            <div class="row q-mb-sm">
              <div class="col">
                <q-input dense outlined v-model="filter_criteria.from_account"
                  label="From Acccount"
                  placeholder="Enter from account number"
                  full-width
                />
              </div>
            </div>
            <div class="row q-mb-sm">
              <div class="col">
                <q-input dense outlined v-model="filter_criteria.to_account"
                  label="To Acccount"
                  placeholder="Enter to account number"
                  full-width
                />
              </div>
            </div>
            <div class="row q-mb-sm">
              <div class="col">
                <q-input dense outlined v-model="filter_criteria.party_name"
                  label="Party Name / Nick Name"
                  placeholder="Enter party name or nick name"
                  full-width
                />
              </div>
            </div>
            <!-- <div class="row q-mb-sm">
              <div class="col q-mr-sm">
               <q-input dense outlined v-model="filter_criteria.range.from"
                  label="From Date"
                  placeholder="DD/MM/YYYY"
                  full-width
                />
              </div>
              <div class="col">
                 <q-input dense outlined v-model="filter_criteria.range.to"
                  label="To Date"
                  placeholder="DD/MM/YYYY"
                  full-width
                />
              </div>
            </div> -->
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize"
              color="primary"
              flat
              label="Clear"
              @click="clearFilter"/>
            <q-btn
              class="text-capitalize"
              color="primary"
              flat
              label="Apply Filter"
              @click="getFilterResult"/>
            
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
import Payment from "../payment/Payment.vue";
import PaymentService2 from "../../../services/PaymentService2";
import BankAccountService from "../../../services/BankAccountService";
import PartyAccountService from "../../../services/PartyAccountService";
import IndianBankRTGS from "../payment/templates/IndianBankRTGSNew.vue";
import {
  matCurrencyRupee,
  matExpandMore,
  matExpandLess,
  matDateRange,
  matFilterAlt
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
        expendMore: matExpandMore,
        expendLess: matExpandLess,
        range: matDateRange,
        filter: matFilterAlt
      },
      visibleColumns: ref(['party_nick_name', 'account_holder', 'amount', 'mode', 'transaction_ref', 'payment_date']),
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
      draft_pagination: { rowsPerPage: 100 },
       sum: 0,
      columns: [
         {
          name: "payment_id",
          align: "left",
          label: "Payment ID",
          field: "payment_id",
          sortable: true,
        },
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
          name: "account_holder",
          align: "left",
          label: "Bank Account",
          field: "account_holder",
          sortable: true,
          currency: false,
        },
        {
          name: "account_number",
          align: "left",
          label: "Account Number",
          field: "account_number",
          sortable: true,
          currency: false,
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

      tempDraft: {},
      tempPayment: {},
      tempPaymentSummary: {},
      selected_list: [],
      open: false,
      payments: [],
      selectRange: false,
      range: ref({ from: "", to: "" }),
      showLabel: false,
      filter_window: false,
      filter_criteria: this.newFiletr(),
      isAdmin: this.isAdmin(),
      permissions: this.getPermissions(),
      askPasswordForAdmin: false
    };
  },
  methods: {
    clearFilter() {
      this.filter_criteria = this.newFiletr()
    },
    getFilterResult() {
      PaymentService2.getPaymentByCriteria(this.client_id, "APPROVAL_REQUIRED", this.filter_criteria)
        .then((response) => {
          this.drafts.splice(0, this.drafts.length);
          this.drafts = response;
          this.filter_criteria.show = true
        })
        .catch((err) => {});
    },
    newFiletr() {
      return {
        show: false,
        from_account: null,
        to_account: null,
        party_name: null,
        range: {
          from: null,
          to: null
        }
      }
    },
    openFilterWindow() {
      this.filter_criteria.show = false
      this.filter_window = true
    },
    getAmountInWords(mode) {
      if (this.sum > 0)
        this.in_words =
          PaymentService2.convertNumberToWords(this.sum) + "Only";
      else this.in_words = "";

      return this.in_words;
    },
    hideRangeLabel() {
      this.range = { from: "", to: "" };
      this.showLabel = false
    },
    showDateSelector(){
      this.beforeShowDateSelector()
      this.selectRange = true
    },
    beforeShowDateSelector() {
      this.hideRangeLabel()
    },
    hideDateSelector(){
      this.selectRange = false
    },
    getForSelectedRange() {
      this.clearFilter()
      this.showLabel = true
      this.sum = 0
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
          for(let d of this.drafts) {
            this.sum = this.sum + d.amount
          }
        })
        .catch((err) => {});
        this.hideDateSelector()
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
      if(this.askPasswordForAdmin) {
        this.openAuth(
          "Approve",
          "Please enter the admin password",
          true,
          draft,
          "Approve"
        );
      } else {
        this.approveWithoutPassword(draft)
      }
    },
    approveWithoutPassword(draft) {
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "The payment will move to history.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.postApproval(draft)
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
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
      // console.log('Draft' + JSON.stringify(draft));
      if (this.approval_mode === "single") {
        this.approvePayments(draft, true);
      } else if (this.approval_mode === "all") {
        this.approvePayments(null, false);
      }
    },
    approvePayments(payment, is_single_approve) {
      let self = this
      let payments = []
      if(is_single_approve) {
        payments.push(payment.payment_id)
      } else {
        for (let d of this.drafts) {
          payments.push(d.payment_id)
        }
      }
      let req = {
        client_id: this.client_id,
        payments: payments
      }
      PaymentService2.approvePayments(req)
          .then((response) => {
            if (response === 0) {
              self.getAllDrafts();
              if(is_single_approve) {
                self.success("Payment has been approved");
              } else {
                self.success("All payments has been approved");
              }
            }
          })
          .catch((err) => {
            self.fail(this.getErrorMessage(err));
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
      PartyAccountService.linkPartyAccount(this.client_id, party_id, account_id)
        .then((response) => {
          if (response === 0) {
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllDrafts() {
      this.clearFilter()
      this.sum = 0
      this.selected_list = [];
      this.loading = true;
      this.hideRangeLabel()
      PaymentService2.getAllDrafts(this.client_id, "APPROVAL_REQUIRED")
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