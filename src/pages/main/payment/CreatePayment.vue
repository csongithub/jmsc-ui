<template>
  <div>
    <Payment />
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-3">
            <q-select
              :disable="disable"
              label="Select From Account"
              behavior="menu"
              dense
              outlined
              v-model="from_Account"
              :options="accounts"
              option-label="displayName"
              option-value="id"
            >
            </q-select>
          </div>
          <div class="col-1 q-ml-lg" v-if="from_Account === null">
            <q-btn class="text-bold" color="primary" label="OR" flat />
          </div>
          <div class="col-1 q-ml-lg" v-if="from_Account !== null">
            <q-btn
              class="text-bold"
              outline
              color="primary"
              label="Reset"
              @click="resetMode"
            />
          </div>
          <div class="col-2" v-if="from_Account === null">
            <q-btn
              :disable="disable"
              class="text-capitalize text-weight-light"
              color="primary"
              label="Pay in Cash"
              @click="onStart"
            />
          </div>
        </div>
        <div class="q-mt-md" v-if="from_Account != null">
          <div class="row">
            <div class="col-2 text-bold">Account Holder</div>
            <div class="col">{{ from_Account.accountHolder }}</div>
            <div class="col-2 text-bold">Account Type</div>
            <div class="col">{{ from_Account.acccountType }}</div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-2 text-bold">Account Number</div>
            <div class="col">{{ from_Account.accountNumber }}</div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-2 text-bold">Bank</div>
            <div class="col">{{ from_Account.bankName }}</div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-2 text-bold">IFSC Code</div>
            <div class="col">{{ from_Account.ifscCode }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="text-red" v-if="disable">
      You don't have permissions to create payments
    </div>
    <q-table
      v-if="from_Account !== null"
      class="my-sticky-header-table"
      dense
      bordered
      flat
      :rows="parties"
      :columns="columns"
      row-key="nick_name"
      :loading="loading"
      :pagination="party_pagination"
      :filter="filter"
      selection="single"
      v-model:selected="selected_party"
    >
      <template v-slot:top-left>
        <span class="text-white bg-primary q-pa-sm"
          >Please, select a party to start with !</span
        >
      </template>
      <template v-slot:top-right>
        <q-btn
          class="text-capitalize text-weight-light q-mr-sm"
          color="primary"
          label="reload"
          icon="refresh"
          @click="getAllParties"
        />
        <q-btn
          v-if="selected_party.length > 0"
          class="text-capitalize text-weight-light q-mr-sm"
          color="primary"
          label="start"
          @click="onStart"
        >
          <q-tooltip class="bg-primary"
            >Click this button to create a payment</q-tooltip
          >
        </q-btn>

        <q-input
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Search Party"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <q-dialog
      v-model="show_create_payment"
      persistent
      @hide="resetPayment"
      ref="createPaymentRef"
    >
      <q-card class="my-card" style="width: 1000px; max-width: 100vw">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ "Create Payment" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-stepper v-model="step" ref="stepper" color="primary" animated>
            <q-step
              class=""
              :name="1"
              :title="payment_mode === 'Cash' ? 'Party' : 'Party Account'"
              icon="create_new_folder"
              :done="step > 1"
            >
              <div v-if="from_Account !== null">
                <div class="row q-mb-lg">
                  <div class="col-1 text-bold q-mr-sm">Party Name</div>
                  <div class="col">{{ selected_party[0].nick_name }}</div>
                  <div class="col-1 text-bold q-mr-sm">Legal Name</div>
                  <div class="col">{{ selected_party[0].name }}</div>
                </div>
                <q-table
                  class="my-sticky-header-table"
                  title="Select Bank Account"
                  dense
                  bordered
                  flat
                  :rows="party_linked_accounts"
                  :columns="party_all_account_columns"
                  row-key="accountNumber"
                  :filter="party_all_acc_filter"
                  selection="single"
                  v-model:selected="selected_party_account"
                >
                  <template v-slot:top-right>
                    <q-input
                      borderless
                      dense
                      outlined
                      debounce="300"
                      v-model="party_all_acc_filter"
                      placeholder="Search Account"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                </q-table>
              </div>
              <div v-else>
                <q-table
                  class="my-sticky-header-table"
                  dense
                  bordered
                  flat
                  :rows="parties"
                  :columns="columns"
                  row-key="nick_name"
                  :loading="loading"
                  :pagination="party_pagination"
                  :filter="filter"
                  selection="single"
                  v-model:selected="selected_party"
                >
                  <template v-slot:top-left>
                    <span class="text-primary text-bold"
                      >Please select a party to continue</span
                    >
                  </template>
                  <template v-slot:top-right>
                    <q-input
                      borderless
                      dense
                      outlined
                      debounce="300"
                      v-model="filter"
                      placeholder="Search Party"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </template>
                </q-table>
              </div>
            </q-step>

            <q-step
              class=""
              :name="2"
              title="Payment Details"
              icon="create_new_folder"
              :done="step > 2"
            >
              <div class="text-bold q-mb-md">Transaction Details</div>
              <div class="row q-mr-sm">
                <div class="col-2 q-mr-sm">
                  <q-input
                    dense
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
                    :label="
                      payment_mode === 'Cash'
                        ? 'Payment Date'
                        : 'Transaction Date'
                    "
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
                  <q-input
                    :readonly="payment_mode === 'Cash' ? true : false"
                    dense
                    outlined
                    v-model="transaction_ref"
                    label="Cheque/Transaction No"
                    placeholder="Check No / UTR No / Transaction Ref No"
                    full-width
                  />
                </div>
                <div class="text-caption text-italic">
                  <b>In Words:</b>{{ getAmountInWords() }}
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
                <!-- <div class="col-4" v-if="payment_reason === 'capital'"> -->
                <!-- <q-select
                    label="Capital"
                    outlined
                    class="q-ml-sm"
                    dense
                    hide-bottom-space
                    :options="capitalOptions"
                    v-model="selected_capital"
                    option-disable="inactive"
                    emit-value
                    map-options
                    use-input
                    input-debounce="0"
                    @filter="filterCapital"
                    hide-dropdown-icon
                    lazy-rules
                    :rules="[(val) => val > 0 || 'required']"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-red">
                          No Capital Account Matched
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div> -->
                <div class="col-4" v-if="payment_reason === 'capital'">
                  <q-select
                    label="Select Capital"
                    behavior="menu"
                    dense
                    outlined
                    v-model="selected_capital"
                    :options="capitalOptions"
                    option-label="label"
                    option-value="value"
                    use-input
                    input-debounce="0"
                    @filter="filterCapital"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-red">
                          No Capital Account Matched
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
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
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation align="right">
                <q-btn
                  v-if="step === 2"
                  class="text-capitalize text-weight-light q-mr-sm"
                  color="primary"
                  label="Save As Draft"
                  @click="savePayment('DRAFT')"
                />
                <q-btn
                  v-if="
                    (payment_mode === 'Cash' && selected_party.length > 0) ||
                    selected_party_account.length > 0
                  "
                  class="text-capitalize text-weight-light q-mr-sm"
                  @click="
                    step === 2
                      ? savePayment('APPROVAL_REQUIRED')
                      : $refs.stepper.next()
                  "
                  color="primary"
                  :label="step === 2 ? 'Send for Approval' : 'Continue'"
                />

                <!-- <q-btn
                  v-if="
                    from_Account == null &&
                    selected_party.length > 0 &&
                    step === 1
                  "
                  class="text-capitalize text-weight-light q-mr-sm"
                  @click="$refs.stepper.next()"
                  color="primary"
                  label="Continue"
                /> -->

                <q-btn
                  v-if="step > 1"
                  class="text-capitalize text-weight-light"
                  outline
                  flat
                  color="primary"
                  @click="$refs.stepper.previous()"
                  label="Back"
                />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { commonMixin } from "../../../mixin/common";
import Payment from "../payment/Payment.vue";
import PartyService from "../../../services/main/PartyService";
import PaymentService2 from "../../../services/PaymentService2";
import BankAccountService from "../../../services/main/BankAccountService";
import PartyAccountService from "../../../services/PartyAccountService";
import SiteService from "../../../services/SiteService";
import MachineService from "../../../services/MachineService";
import { matCurrencyRupee } from "@quasar/extras/material-icons";
import { ref } from "vue";
import { capitalAccountStore } from "src/pinia_stores/CapitalAccountStore";
import { filter } from "src/pages/accounting/Utils/filterUtils";
export default {
  name: "CreatePayment",
  mixins: [commonMixin],
  setup() {
    return {
      selected_party: ref([]),
      step: ref(1),
      party_account_tab: ref("existing"),
      columns: [
        {
          name: "nick_name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.nick_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "name",
          align: "left",
          label: "Legal Name",
          field: "name",
          sortable: true,
        },
        {
          name: "party_type",
          align: "left",
          label: "Party Type",
          field: "party_type",
          sortable: true,
        },
        {
          name: "mobile",
          align: "left",
          label: "Mobie",
          field: "mobile",
          sortable: true,
        },
        {
          name: "address",
          align: "left",
          label: "Address",
          field: "address",
          sortable: true,
        },
        {
          name: "actions",
          required: false,
          label: "Actions",
          field: "actions",
        },
      ],
      party_all_account_columns: [
        {
          name: "partyName",
          required: true,
          label: "Account Nick Name",
          align: "left",
          field: (row) => row.partyName,
          format: (val) => `${val}`,
          sortable: true,
          style: (row) => "width: 10px",
        },
        {
          name: "accountHolder",
          align: "left",
          label: "Account Holder Name",
          field: "accountHolder",
          sortable: true,
          style: "width: 10px",
        },
        {
          name: "accountNumber",
          align: "left",
          label: "Account Number",
          field: "accountNumber",
          sortable: true,
        },
        {
          name: "ifscCode",
          align: "left",
          label: "IFSC Code",
          field: "ifscCode",
          sortable: true,
        },
        {
          name: "bankName",
          align: "left",
          label: "Bank",
          field: "bankName",
          sortable: true,
        },
        {
          name: "branchName",
          align: "left",
          label: "Branch",
          field: "branchName",
          sortable: true,
        },
      ],
      payment_reason: ref(""),
      icons: {
        rupee: matCurrencyRupee,
      },
    };
  },
  components: {
    Payment,
  },
  watch: {
    payment_reason(val) {
      if (val === "site") {
        this.selected_machine = null;
        this.selected_capital = null;
      } else if (val === "machine") {
        this.selected_site = null;
        this.selected_capital = null;
      } else if (val === "capital") {
        this.selected_site = null;
        this.selected_machine = null;
      } else {
        this.selected_machine = null;
        this.selected_site = null;
        this.selected_capital = null;
      }
    },
  },
  created() {},
  async mounted() {
    this.getActiveAccounts();
    this.getAllParties();
    await this.initiateData();
  },
  data() {
    return {
      client_id: this.getClientId(),
      party_pagination: { rowsPerPage: 25 },
      parties: [],
      loading: false,
      filter: "",
      party_all_acc_filter: "",
      show_create_payment: false,
      accounts: [],
      from_Account: null,
      party_all_accounts: [],
      party_linked_accounts: [],
      selected_party_account: [],
      sites: [],
      machines: [],
      payment_reason_options: [
        { label: "Capital Funding (*New)", value: "capital", color: "red" },
        { label: "Site", value: "site" },
        { label: "Machine/Vehicle", value: "machine" },
        { label: "Personal", value: "personal" },
        { label: "Other", value: "other" },
      ],
      selected_site: null,
      selected_machine: null,
      payment_mode_options: ["Cheque", "Netbanking", "Cash", "UPI"],
      payment_mode: null,
      transaction_ref: null,
      payment_remark: null,
      payment_date: null,
      payment_amount: 0,
      disable: this.disableByPermission(this.getPermissions().createPayments),
      capitalOptions: [],
      capitals: [],
      selected_capital: null,
    };
  },
  methods: {
    async initiateData() {
      this.capitals = await capitalAccountStore().loadCapitalAccounts(
        this.getClientId(),
        false
      );
    },
    filterCapital(input, update, abort) {
      this.capitalOptions = filter(input, update, this.capitals);
    },
    resetMode() {
      this.from_Account = null;
      this.selected_party = ref([]);
      this.selected_party_account = ref([]);
    },
    getAmountInWords() {
      if (this.payment_amount > 0)
        this.amount_inwords =
          PaymentService2.convertNumberToWords(this.payment_amount) + "Only";
      else this.amount_inwords = "";

      return this.amount_inwords;
    },
    onStart() {
      this.payment_date = this.getTodaysDate();
      // this.getPartyAllAccounts();
      this.getPartyLinkedAccounts();
      this.getAllSites();
      this.getAllMachines();
      this.openCreatePaymentWindow();
    },
    openCreatePaymentWindow() {
      if (this.from_Account == null) {
        this.payment_mode = "Cash";
      }
      this.show_create_payment = true;
    },
    resetPayment() {
      this.show_create_payment = false;
      (this.step = ref(1)),
        (this.selected_site = null),
        (this.selected_machine = null),
        (this.payment_mode = null),
        (this.transaction_ref = null),
        (this.payment_remark = null),
        (this.payment_date = null),
        (this.payment_amount = null),
        (this.selected_party_account = []);
      this.selected_capital = null;
    },
    getAllParties() {
      this.loading = true;
      PartyService.allByStatus(this.client_id, "ACTIVE")
        .then((response) => {
          this.parties.splice(0, this.parties.length);
          this.parties = response;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    getActiveAccounts() {
      BankAccountService.getActiveAccounts(this.client_id)
        .then((response) => {
          this.accounts.splice(0, this.accounts.length);
          this.accounts = response;
        })
        .catch((err) => {
          this.fail("Error in loading active accounts");
        });
    },
    // getPartyAllAccounts() {
    //   this.loading = true;
    //   PartyAccountService.getPartyAccounts(this.client_id)
    //     .then((response) => {
    //       this.party_all_accounts.splice(0, this.party_all_accounts.length);
    //       this.party_all_accounts = response.filter(ac => ac.status === 'ACTIVE');
    //       this.loading = false;
    //     })
    //     .catch((err) => {
    //       this.loading = false;
    //       this.fail("Error in loading party accounts");
    //     });
    // },
    getPartyLinkedAccounts() {
      if (
        this.isNullOrUndefined(this.selected_party) ||
        this.selected_party.length === 0
      )
        return;
      PartyService.getPartyLinkedAccounts(
        this.client_id,
        this.selected_party[0].id
      )
        .then((response) => {
          this.party_linked_accounts.splice(
            0,
            this.party_linked_accounts.length
          );
          this.party_linked_accounts = response.filter(
            (ac) => ac.status === "ACTIVE"
          );
        })
        .catch((err) => {
          this.fail("Error in loading party linked accounts");
        });
    },
    getAllSites() {
      SiteService.all(this.client_id)
        .then((response) => {
          this.sites.splice(0, this.sites.length);
          this.sites = response;
          this.loading = false;
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
          // window.alert(JSON.stringify(this.sites))
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },

    savePayment(mode) {
      if (
        this.isNullOrUndefined(this.payment_amount) ||
        this.payment_amount === null ||
        this.payment_amount === 0
      ) {
        this.fail("Please enter the amount");
        return;
      }

      if (this.payment_date === null || this.payment_date === "") {
        this.fail("Please enter payment date");
        return;
      }
      let payment = {
        client_id: this.client_id,
        payment: null,
        payment_summary: null,
        payment_date: this.payment_date,
      };

      if (mode === "DRAFT") {
        payment.status = "DRAFT";
      } else if (mode === "APPROVAL_REQUIRED") {
        if (this.isNullOrUndefined(this.payment_reason)) {
          this.fail("Please select paymet reason");
          return;
        }
        if (this.isNullOrUndefined(this.payment_mode)) {
          this.fail("Please select paymet mode");
          return;
        }
        if (
          this.isNullOrUndefined(this.transaction_ref) &&
          this.payment_mode !== "Cash"
        ) {
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
        party: this.selected_party[0],
        from_account: this.from_Account !== null ? this.from_Account : null,
        to_account:
          this.selected_party_account[0] !== null
            ? this.selected_party_account[0]
            : null,
        payment_amount: parseInt(this.payment_amount),
        amount_inwords: this.amount_inwords,
        payment_reason: this.payment_reason,
        site: this.selected_site,
        machine: this.selected_machine,
        payment_mode: this.payment_mode,
        transaction_ref: this.transaction_ref,
        payment_remark: this.payment_remark,
        cpital_account: this.selected_capital,
      };

      let payment_summary = {
        party_id: this.selected_party[0].id,
        party_name: this.selected_party[0].name,
        party_nick_name: this.selected_party[0].nick_name,
        from_account_id:
          this.from_Account !== null ? this.from_Account.id : null,
        to_account_id:
          this.selected_party_account[0] != null
            ? this.selected_party_account[0].id
            : null,
        amount: parseInt(this.payment_amount),
        amount_in_words: this.amount_inwords,
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
      } else if (this.payment_reason === "capital") {
        if (this.selected_capital === null) {
          this.fail("Please select machine");
          return;
        }
        payment_summary.reasonId = this.selected_capital.value;
        payment_summary.reason_name = this.selected_capital.label;
      }

      payment.payment = JSON.stringify(payment_details);
      payment.payment_summary = JSON.stringify(payment_summary);

      PaymentService2.savePayment(payment)
        .then((response) => {
          console.log(response);
          if (mode === "DRAFT") {
            this.success("Payment draft has been created");
          } else if (mode === "APPROVAL_REQUIRED") {
            this.success("Payment sent for approval");
          }
          this.resetPayment();
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
  },
};
</script>
