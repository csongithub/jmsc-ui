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
              <q-tooltip v-if="!props.expand" :delay="1000"
                >Open payment details</q-tooltip
              >
              <q-tooltip v-if="props.expand" :delay="1000"
                >Hide payment details</q-tooltip
              >
            </q-btn>
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
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="row">
                  <div class="text-bold">Amount:</div>
                </div>
                <div class="row q-mb-md">
                  <q-icon :name="icons.rupee" />
                  <div class="col">
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
  </div>
</template>

<script>
import { commonMixin } from "../../../mixin/common";
import Payment from "../payment/PaymentNew.vue";
import PaymentService2 from "../../../services/PaymentService2";
import BankAccountService from "../../../services/BankAccountService";
import PartyAccountService from "../../../services/PartyAccountService";
import {
  matCurrencyRupee,
  matExpandMore,
  matExpandLess,
  matDateRange,
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
  },
  watch: {},
  created() {},
  mounted() {
    this.getAllDrafts();
  },
  data() {
    return {
      client_id: this.getClientId(),
      draft_pagination: { rowsPerPage: 20 },
      drafts: [],
      loading: false,
      filter_draft: "",
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
      PaymentService2.paymentsBetweenDates(this.client_id, "APPROVED", req)
        .then((response) => {
          this.drafts.splice(0, this.drafts.length);
          this.drafts = response;
          this.cancelRange();
        })
        .catch((err) => {});
    },
    getAllDrafts() {
      this.loading = true;
      PaymentService2.getAllDrafts(this.client_id, "APPROVED")
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