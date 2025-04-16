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
        <q-inner-loading
          v-if="loading"
          showing
          color="primary"
          label="Loading..."
          size="sm"
        />
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
        <div class="row" v-if="!filterSubmit">
          <q-select
            dense
            outlined
            v-model="selectedFY"
            :options="financialYearList"
            label="Select FY"
          />
          <q-btn
            color="primary"
            flat
            :icon="icons.filter"
            @click="openFilterPanel()"
          >
            <q-tooltip :delay="500">Apply Filters</q-tooltip>
          </q-btn>
        </div>
        <div class="row" v-if="filterSubmit">
          <label>
            <q-chip
              removable
              size="sm"
              v-for="(chip, index) in chipsLabels"
              :key="index"
              color="primary"
              text-color="white"
              @remove="removeSelectedFilter(chip)"
            >
              {{ chip }}</q-chip
            >
          </label>
          <q-btn
            color="red"
            label="X"
            size="sm"
            dense
            round
            flat
            class="text-capitalize"
            @click="removeFilterAndGetDefaultResults"
          >
            <q-tooltip :delay="500">Clear all filters</q-tooltip></q-btn
          >
          <q-btn
            color="primary"
            size="sm"
            flat
            dense
            :icon="icons.filter"
            @click="openFilterPanel()"
          >
            <q-tooltip :delay="500">Add more filters</q-tooltip>
          </q-btn>
        </div>
      </template>
      <template v-slot:top-right>
        <q-btn
          dense
          flat
          class="q-mr-sm"
          v-if="drafts.length > 0"
          color="primary"
          icon-right="archive"
          no-caps
          @click="exportAsFile"
        >
          <q-tooltip>Export</q-tooltip>
        </q-btn>
        <q-input
          class="q-mr-sm"
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
              <q-tooltip v-if="!props.expand" :delay="1000"
                >Open payment details</q-tooltip
              >
              <q-tooltip v-if="props.expand" :delay="1000"
                >Hide payment details</q-tooltip
              >
            </q-btn>
          </q-td>
          <q-td key="payment_id" :props="props">{{
            props.row.payment_id
          }}</q-td>
          <q-td key="party_nick_name" :props="props">{{
            props.row.party_nick_name
          }}</q-td>
          <q-td key="party_name" :props="props">{{
            props.row.party_nick_name
          }}</q-td>
          <q-td key="account_holder" :props="props">{{
            props.row.account_holder
          }}</q-td>
          <q-td key="account_number" :props="props">{{
            props.row.account_number
          }}</q-td>
          <q-td key="amount" :props="props">
            <q-icon :name="icons.rupee" />
            {{ props.row.amount.toLocaleString("en-IN") + ".00" }}
          </q-td>
          <q-td key="reason" :props="props">{{ props.row.reason }}</q-td>
          <q-td key="reason_name" :props="props">{{
            props.row.reason_name
          }}</q-td>
          <q-td key="mode" :props="props">{{ props.row.mode }}</q-td>
          <q-td key="transaction_ref" :props="props">{{
            props.row.transaction_ref
          }}</q-td>
          <q-td key="payment_date" :props="props">{{
            props.row.payment_date
          }}</q-td>
          <q-td key="actions" v-if="admin">
            <q-icon
              class="q-ma-sm q-pa-none pointer"
              color="red"
              :name="icons.delete"
              @click="deleteDraft(props.row)"
            />
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
    <div>
      <q-dialog
        v-model="drawFilterPanel"
        persistent
        ref="filterPanelRef"
        position="right"
        size="lg"
      >
        <q-card flat bordered style="min-width: 30vw">
          <q-bar
            class="bg-primary glossy text-white text-weight-light text-subtitle2"
          >
            {{ "Apply Filters" }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row">
              <div class="col">
                <q-radio
                  class="q-mr-md"
                  dense
                  v-model="filetrOption"
                  val="general"
                  label="General"
                />
              </div>
              <div class="col">
                <q-radio
                  class="q-mr-md"
                  dense
                  v-model="filetrOption"
                  val="date"
                  label="By Date or Range"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="filetrOption === 'general'">
            <div class="row q-mb-sm">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="filter_criteria.from_account"
                  label="From Acccount"
                  placeholder="Enter from account number"
                  full-width
                />
              </div>
            </div>
            <div class="row q-mb-sm">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="filter_criteria.to_account"
                  label="To Acccount"
                  placeholder="Enter to account number"
                  full-width
                />
              </div>
            </div>
            <div class="row q-mb-sm">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="filter_criteria.party_name"
                  label="Party Name / Nick Name"
                  placeholder="Enter party name or nick name"
                  full-width
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-else>
            <q-date v-model="range" range landscape />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize"
              color="primary"
              flat
              label="Clear"
              @click="clearAllFilters"
            />
            <q-btn
              class="text-capitalize"
              color="primary"
              flat
              label="Apply Filter"
              @click="getFilterResults"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <ExportTable
      :header="'Export Payments'"
      :open="openExport"
      :rows="columns"
      :content="drafts"
      :fileName="exportFileName"
      :fileType="fileType"
      @close="openExport = false"
    />
  </div>
</template>

<script>
import { commonMixin } from "../../../mixin/common";
import Payment from "../payment/Payment.vue";
import PaymentService2 from "../../../services/PaymentService2";
import BankAccountService from "../../../services/BankAccountService";
import PartyAccountService from "../../../services/PartyAccountService";
import ExportTable from "src/components/ExportTable.vue";
import {
  matCurrencyRupee,
  matExpandMore,
  matExpandLess,
  matDateRange,
  matFilterAlt,
  matDelete,
} from "@quasar/extras/material-icons";
import { ref } from "vue";
export default {
  name: "PaymentDraft",
  mixins: [commonMixin],
  setup() {
    return {
      show_payment_id: ref(false),
      show_reason: ref(true),
      show_payment_for: ref(true),
      selected_draft: ref([]),
      step: ref(1),
      icons: {
        rupee: matCurrencyRupee,
        expendMore: matExpandMore,
        expendLess: matExpandLess,
        range: matDateRange,
        filter: matFilterAlt,
        delete: matDelete,
      },
      visibleColumns: ref([
        "party_nick_name",
        "account_holder",
        "amount",
        "mode",
        "transaction_ref",
        "payment_date",
      ]),
    };
  },
  components: {
    Payment,
    ExportTable,
  },
  watch: {},
  created() {},
  mounted() {
    this.prepareFYList();
  },
  watch: {
    selectedFY(fy) {
      this.setFY(fy);
      this.getAllDrafts(fy);
    },
  },
  data() {
    return {
      client_id: this.getClientId(),
      admin: this.isAdmin(),
      draft_pagination: { rowsPerPage: 50 },
      columns: [
        {
          name: "payment_id",
          align: "left",
          label: "ID",
          field: "payment_id",
          sortable: true,
        },
        {
          name: "party_nick_name",
          required: true,
          label: "Party",
          align: "left",
          field: (row) => this.getPartyNames(row.party_id, "nick_name"),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "party_name",
          align: "left",
          label: "Party Legal Name",
          field: (row) => this.getPartyNames(row.party_id, "name"),
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
          label: "Date",
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
      selectRange: false,
      range: ref({ from: "", to: "" }),
      showLabel: false,
      filter_window: false,
      filter_criteria: this.newFiletr(),
      selectedFY: null,
      financialYearList: [],
      drawFilterPanel: false,
      filetrOption: "general",
      filterSubmit: false,
      chipsLabels: [],
      openExport: false,
      fileType: "text/csv",
      exportFileName: "payment_history.csv",
    };
  },
  methods: {
    exportAsFile() {
      this.openExport = true;
    },
    openFilterPanel() {
      this.drawFilterPanel = true;
    },
    closeFilterPanel() {
      this.drawFilterPanel = false;
    },
    getCurrentFinancialYear() {
      var fiscalyear = "";
      var today = new Date();
      if (today.getMonth() + 1 <= 3) {
        fiscalyear = today.getFullYear() - 1 + "-" + today.getFullYear();
      } else {
        fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1);
      }
      return fiscalyear;
    },
    prepareFYList() {
      let currentFY = this.getCurrentFinancialYear();

      let currentFYStart = Number(currentFY.split("-")[0]);
      let currentFYEnd = Number(currentFY.split("-")[1]);

      this.financialYearList = [];
      this.financialYearList.push(currentFY);
      for (let i = 1; i <= 5; i++) {
        var fy = currentFYStart - i + "-" + (currentFYEnd - i);
        this.financialYearList.unshift(fy);
      }
      this.selectedFY = this.getFY() != null ? this.getFY() : currentFY;
      this.setFY(this.selectedFY);
    },
    deleteDraft(draft) {
      console.log(JSON.stringify(draft));
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "This will delete the paymemt permanently.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          PaymentService2.deletePayment(
            this.client_id,
            draft.payment_id,
            "APPROVED"
          )
            .then((response) => {
              if (response === 0) {
                this.getAllDrafts(this.selectedFY);
                this.success("Payment has been deleted");
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
    clearGeneralFilters() {
      this.filter_criteria = this.newFiletr();
    },

    buildChipsLabel() {
      this.chipsLabels = [];
      if (
        !this.isNullOrUndefined(this.filter_criteria.from_account) &&
        this.filter_criteria.from_account !== ""
      ) {
        this.chipsLabels.push(
          "from account:" + this.filter_criteria.from_account
        );
      }
      if (
        !this.isNullOrUndefined(this.filter_criteria.to_account) &&
        this.filter_criteria.to_account !== ""
      ) {
        this.chipsLabels.push("to account:" + this.filter_criteria.to_account);
      }
      if (
        !this.isNullOrUndefined(this.filter_criteria.party_name) &&
        this.filter_criteria.party_name !== ""
      ) {
        this.chipsLabels.push("party name:" + this.filter_criteria.party_name);
      }
    },
    getFilterResult() {
      this.clearFilterRange();

      this.buildChipsLabel();
      PaymentService2.getPaymentByCriteria(
        this.client_id,
        "APPROVED",
        this.filter_criteria
      )
        .then((response) => {
          this.drafts.splice(0, this.drafts.length);
          this.drafts = response;
          this.filter_criteria.show = true;
        })
        .catch((err) => {});
    },
    getFilterResults() {
      this.filterSubmit = true;
      if (this.filetrOption === "general") {
        this.getFilterResult();
      } else if (this.filetrOption === "date") {
        this.getForSelectedRange();
      }
    },
    removeSelectedFilter(chip) {
      if (this.filetrOption === "date") {
        this.removeFilterAndGetDefaultResults();
      } else if (this.filetrOption === "general") {
        if (chip.startsWith("from account")) {
          this.filter_criteria.from_account = null;
        }
        if (chip.startsWith("to account")) {
          this.filter_criteria.to_account = null;
        }
        if (chip.startsWith("party name")) {
          this.filter_criteria.party_name = null;
        }
        if (
          this.filter_criteria.from_account === null &&
          this.filter_criteria.to_account === null &&
          this.filter_criteria.party_name === null
        ) {
          this.removeFilterAndGetDefaultResults();
        } else {
          this.getFilterResult();
        }
      }
    },
    removeFilterAndGetDefaultResults() {
      this.filterSubmit = false;
      this.getAllDrafts(this.selectedFY);
    },
    clearAllFilters() {
      this.clearFilterRange();
      this.clearGeneralFilters();
    },
    newFiletr() {
      return {
        show: false,
        from_account: null,
        to_account: null,
        party_name: null,
        range: {
          from: null,
          to: null,
        },
      };
    },
    openFilterWindow() {
      this.filter_criteria.show = false;
      this.filter_window = true;
    },
    hideRangeLabel() {
      this.range = { from: "", to: "" };
      // this.showLabel = false;
    },
    showDateSelector() {
      this.beforeShowDateSelector();
      this.selectRange = true;
    },
    beforeShowDateSelector() {
      this.hideRangeLabel();
    },
    clearFilterRange() {
      this.range = { from: "", to: "" };
    },
    getForSelectedRange() {
      this.clearGeneralFilters();
      this.chipsLabels = [];
      this.showLabel = true;
      let range = {};
      if (this.range.from !== undefined && this.range.to !== undefined) {
        range = {
          from: this.range.from,
          to: this.range.to,
        };
        this.chipsLabels.push(range.from + " to " + range.to);
      } else {
        range = {
          from: this.range,
          to: this.range,
        };
        this.chipsLabels.push(range.from);
      }
      let req = {
        range: range,
      };
      PaymentService2.paymentsBetweenDates(this.client_id, "APPROVED", req)
        .then((response) => {
          this.drafts.splice(0, this.drafts.length);
          this.drafts = response;
        })
        .catch((err) => {});
    },
    getAllDrafts(fy) {
      this.clearGeneralFilters();
      this.clearFilterRange();
      this.loading = true;
      this.showLabel = false;

      const yearFrom = fy.split("-")[0];
      const yearTo = fy.split("-")[1];

      let req = {
        range: {
          from: yearFrom + "/04/01",
          to: yearTo + "/03/31",
        },
      };

      PaymentService2.paymentsBetweenDates(this.client_id, "APPROVED", req)
        .then((response) => {
          this.drafts.splice(0, this.drafts.length);
          this.drafts = response;
          this.loading = false;
        })
        .catch((err) => {});
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
