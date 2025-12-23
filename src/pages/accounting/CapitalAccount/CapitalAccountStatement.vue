<template>
  <q-layout>
    <q-table
      ref="myTable"
      flat
      dense
      bordered
      :rows="records"
      :columns="columns"
      row-key="name"
      binary-state-sort
      :pagination="pagination"
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
      <template v-slot:top="">
        <!-- <span class="q-mr-sm">Select Capital:</span> -->
        <q-select
          filled
          label="Select Capital"
          dense
          outlined
          hide-bottom-space
          :options="capitalOptions"
          v-model="capitalAccountId"
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
        <!-- <span class="q-mr-sm">From Date:</span> -->
        <q-input
          class="q-ml-sm"
          filled
          label="From Date"
          style="max-width: 150px"
          hide-bottom-space
          dense
          outlined
          v-model="fromDate"
          :rules="[
            (val) => !!val || 'required',
            (val) => /^\d{2}-\d{2}-\d{4}$/.test(val) || 'Invalid date format',
          ]"
          placeholder="dd-mm-yyyy"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fromDate"
                  mask="DD-MM-YYYY"
                  minimal
                  lazy-rules
                  @update:model-value="$refs.qDateProxy.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <!-- <span class="q-mr-sm">To Date:</span> -->
        <q-input
          class="q-ml-sm"
          label="To Date"
          filled
          style="max-width: 150px"
          hide-bottom-space
          dense
          outlined
          v-model="toDate"
          :rules="[
            (val) => !!val || 'required',
            (val) => /^\d{2}-\d{2}-\d{4}$/.test(val) || 'Invalid date format',
          ]"
          placeholder="dd-mm-yyyy"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="toDate"
                  mask="DD-MM-YYYY"
                  minimal
                  lazy-rules
                  @update:model-value="$refs.qDateProxy.hide()"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn
          class="q-ml-sm text-capitalize"
          color="secondary"
          label="Submit"
          dense
          @click="getRecords()"
        ></q-btn>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="date" :props="props">
            {{ props.row.date }}
          </q-td>
          <q-td key="note" :props="props">
            <span
              v-if="props.row.entryType === 'DEBIT'"
              class="text-blue"
              style="cursor: pointer"
              @click="getVoucher(props.row)"
              >{{ props.row.note }}</span
            >
            <span v-else>{{ props.row.note }}</span>
          </q-td>
          <q-td key="credit" :props="props">{{
            props.row.credit.toLocaleString("en-IN")
          }}</q-td>
          <q-td key="debit" :props="props"
            >{{ props.row.debit.toLocaleString("en-IN") }}
          </q-td>
          <q-td key="balance" :props="props">{{
            props.row.balance.toLocaleString("en-IN")
          }}</q-td>
        </q-tr>
      </template>
    </q-table>
    <voucher-view :voucher="voucher" @close="closeVoucher"></voucher-view>
  </q-layout>
</template>

<script>
import AccountingService from "src/services/accounting/AccountingService";
import { commonMixin } from "../../../mixin/common";
import { ref } from "vue";
import { capitalAccountStore } from "src/pinia_stores/CapitalAccountStore";
import { filter } from "../Utils/filterUtils";
import VoucherView from "../Voucher/VoucherView.vue";
import { creditorStore } from "src/pinia_stores/CreditorStore";
export default {
  name: "CapitalAccountStatement",
  mixins: [commonMixin],
  setup() {
    return {
      selected: ref([]),

      columns: [
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
        },

        {
          name: "note",
          align: "left",
          label: "Voucher",
          field: "note",
          sortable: true,
        },
        {
          name: "credit",
          align: "left",
          label: "Credit",
          field: "credit",
          sortable: true,
        },
        {
          name: "debit",
          align: "left",
          label: "Debit",
          field: "debit",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance",
          field: "balance",
        },
      ],
    };
  },
  components: { VoucherView },
  created() {},
  async mounted() {
    await this.loadCapitalAccounts();
    this.ledgers = creditorStore().ledgersCache;
    this.creditors = creditorStore().creditors;
  },

  beforeUnmount() {},
  data() {
    return {
      pagination: { rowsPerPage: 100 },
      capitals: [],
      capitalOptions: [],
      fromDate: null,
      toDate: null,
      capitalAccountId: null,
      loading: false,
      records: [],
      showVoucher: false,
      voucher: null,
      ledgers: [],
      creditors: [],
    };
  },
  methods: {
    async loadCapitalAccounts() {
      this.capitals = await capitalAccountStore().loadCapitalAccounts(
        this.getClientId(),
        false
      );
    },
    filterCapital(input, update, abort) {
      this.capitalOptions = filter(input, update, this.capitals);
    },

    getRecords() {
      this.loading = true;
      let request = {
        clientId: this.getClientId(),
        accountId: this.capitalAccountId,
        entryType: "ALL",
        from: this.fromDate,
        to: this.toDate,
      };
      AccountingService.capitalAccountStatement(request)
        .then((response) => {
          this.records = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async getVoucher(transaction) {
      this.voucher = null;

      await AccountingService.getVoucher(
        transaction.clientId,
        transaction.transactionRefNo,
        transaction.accountId
      )
        .then((response) => {
          // console.log(JSON.stringify(response));
          var data = response;
          data.list = JSON.parse(data.items);

          data.openingBalance =
            Number(transaction.debit) + Number(transaction.balance);
          data.closingBalance = Number(transaction.balance);

          this.voucher = data;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        })
        .finally(() => {});
    },

    closeVoucher() {
      this.voucher = null;
    },
  },
};
</script>
