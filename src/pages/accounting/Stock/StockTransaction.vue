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
        <q-select
          style="max-width: 300px"
          filled
          class="q-ml-sm custom-small-select"
          dense
          outlined
          hide-bottom-space
          :options="stockOptions"
          v-model="stockId"
          option-disable="inactive"
          emit-value
          map-options
          use-input
          input-debounce="0"
          @filter="filterStock"
          :placeholder="stockId === null ? 'select stock' : ''"
        >
          <template #label
            ><span class="text-subtitle2">Select Stock</span></template
          >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-red">
                No Stock Matched
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
          @click="getTransactions()"
        ></q-btn>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="date" :props="props">
            {{ props.row.date }}
          </q-td>
          <q-td key="note" :props="props">
            {{ props.row.note }}
          </q-td>
          <q-td key="credit" :props="props">{{
            props.row !== null && props.row.credit !== 0
              ? props.row.credit.toLocaleString("en-IN")
              : ""
          }}</q-td>
          <q-td key="debit" :props="props"
            >{{
              props.row !== null && props.row.debit !== 0
                ? props.row.debit.toLocaleString("en-IN")
                : ""
            }}
          </q-td>
          <q-td key="amount" :props="props"
            >{{
              props.row !== null &&
              props.row.amount !== null &&
              props.row.amount !== 0
                ? props.row.amount.toLocaleString("en-IN")
                : ""
            }}
          </q-td>
          <q-td key="balance" :props="props">{{
            props.row !== null && props.row.balance !== 0
              ? props.row.balance.toLocaleString("en-IN")
              : ""
          }}</q-td>
          <q-td key="project" :props="props">{{ props.row.project }}</q-td>
          <q-td key="creditor" :props="props">{{ props.row.creditor }}</q-td>
          <q-td key="ledger" :props="props">{{ props.row.ledger }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-layout>
</template>

<script>
import AccountingService from "src/services/accounting/AccountingService";
import { commonMixin } from "../../../mixin/common";
import { ref } from "vue";
import { filter } from "../Utils/filterUtils";
import { stockStore } from "src/pinia_stores/StockStore";
import { creditorStore } from "src/pinia_stores/CreditorStore";
import { projectStore } from "src/pinia_stores/ProjectStore";
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
          label: "Note",
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
          name: "amount",
          align: "left",
          label: "Amount",
          field: "amount",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance",
          field: "balance",
        },
        {
          name: "project",
          align: "left",
          label: "Project",
          field: "project",
        },
        {
          name: "creditor",
          align: "left",
          label: "Creditor",
          field: "creditor",
        },
        {
          name: "ledger",
          align: "left",
          label: "Ledger",
          field: "ledger",
        },
      ],
    };
  },
  components: {},
  created() {},
  async mounted() {
    await this.loadStocks();
  },

  beforeUnmount() {},
  data() {
    return {
      clientId: this.getClientId(),
      pagination: { rowsPerPage: 100 },
      loading: false,
      stocks: [],
      stockOptions: [],
      stockId: null,
      fromDate: null,
      toDate: null,
      records: [],
    };
  },
  methods: {
    async loadStocks() {
      this.stocks = await stockStore().loadStocks(this.clientId, false);
    },
    filterStock(input, update, abort) {
      this.stockOptions = filter(input, update, this.stocks);
    },
    getTransactions() {
      this.loading = true;
      let request = {
        clientId: this.getClientId(),
        stockId: this.stockId,
        entryType: "ALL",
        from: this.fromDate,
        to: this.toDate,
      };
      AccountingService.stockTransactions(request)
        .then(async (response) => {
          if (response.length > 0) {
            for (let trans of response) {
              if (trans.creditorId !== null) {
                trans["creditor"] = await creditorStore().getCreditorName(
                  this.clientId,
                  Number(trans.creditorId),
                  false,
                );
              }
              if (trans.ledgerId !== null) {
                trans["ledger"] = await creditorStore().getLedgerName(
                  this.clientId,
                  Number(trans.creditorId),
                  Number(trans.ledgerId),
                  false,
                );
              }
              if (trans.projectId !== null) {
                trans["project"] = await projectStore().getProjectName(
                  this.clientId,
                  trans.projectId,
                  false,
                );
              }
            }
            this.records = response;
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
