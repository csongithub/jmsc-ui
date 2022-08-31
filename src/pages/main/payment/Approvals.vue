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
              @click="expandDraft(props)"
              :icon="props.expand ? 'remove' : 'add'"
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
              <q-btn
                class="q-mt-sm q-mr-sm text-capitalize"
                color="primary"
                label="Approve"
                size="sm"
                glossy
                @click="adminApproval(props.row, 'single')"
              />
            </div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-card>
              <q-card-section
                v-if="isNotNullOrUndefined(props.row.from_account)"
              >
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
                  <div class="col-3">{{ props.row.from_account.bankName }}</div>
                  <div class="col-2 text-bold">IFSC Code</div>
                  <div class="col-2">{{ props.row.from_account.ifscCode }}</div>
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
  </div>
  <AdminAuth :options="openAuthorization" 
               :title="authTitle"
               :message="authMessage"
               :data="authData"
               @cancel="cancelAuth"
               @success="postApproval"></AdminAuth>
</template>

<script>
import AdminAuth from "../../auth/AdminAuth"
import { commonMixin } from "../../../mixin/common";
import Payment from "../payment/PaymentNew.vue";
import PaymentService2 from "../../../services/PaymentService2";
import BankAccountService from "../../../services/BankAccountService";
import PartyAccountService from "../../../services/PartyAccountService";
import {
  matCurrencyRupee,
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
          currency: true
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
          label: "Actions",
          required: true,
          align: "center",
          field: "actions",
          format: (val) => `${val}`,
        },
      ],

      icons: {
        rupee: matCurrencyRupee,
      },
    };
  },
  components: {
    Payment,
    AdminAuth
  },
  watch: {   
  },
  created() {},
  mounted() {
    this.getAllDrafts();
  },
  data() {
    return {
      openAuthorization: false,
      authTitle: '',
      authMessage: '',
      authData: null,
      approval_mode: null,
      client_id: this.getClientId(),
      draft_pagination: { rowsPerPage: 25 },
      drafts: [],
      loading: false,
      filter_draft: "",

      tempDraft: {},
      tempPayment: {},
      tempPaymentSummary: {},
    };
  },
  methods: {
    adminApproval(draft, approval_mode) {
      this.approval_mode = approval_mode
      this.openAuth('Authentication required', 
                    'Please enter the admin password',
                    true,
                    draft)
    },
    openAuth(title, message, options, data){
      this.authTitle = title,
      this.authMessage = message
      this.openAuthorization = options
      this.authData = data
    },
    cancelAuth(val) {
      this.openAuthorization = val
    },
    postApproval(draft){
      if (this.approval_mode === 'single') {
        this.approveSingle(draft)
      } else if (this.approval_mode === 'all') {
        this.approveAll()
      }
    },
    approveAll(){
        for(let payment of this.drafts) {
            PaymentService2.approvePayment(this.client_id, payment.payment_id)
            .then((response) => {
                if(response === 0) {
                    this.getAllDrafts()
                    this.success('All payments has been approved')
                }
            })
            .catch((err) => {
                this.fail(this.getErrorMessage(err));
            });
        }
    },
    approveSingle(draft) {
      console.log(JSON.stringify(draft));
      PaymentService2.approvePayment(this.client_id, draft.payment_id)
        .then((response) => {
            if(response === 0) {
                this.getAllDrafts()
                this.success('Payment has been approved')
            }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllDrafts() {
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