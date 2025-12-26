<template>
  <div>
    <q-dialog
      v-model="openView"
      persistent
      ref="voucherViewRef"
      position="right"
    >
      <q-card style="width: 700px; max-width: 80vw">
        <q-bar class="bg-secondary text-white text-weight-light text-subtitle2">
          {{ "Voucher Details" }}
          <q-space />
          <q-btn dense flat icon="close" @click="closeView">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section v-if="voucher !== null">
          <div class="row q-mb-sm">
            <div class="col-3 tetx-title2 text-bold">Project</div>
            <div class="col-3">{{ ":" + project }}</div>
            <div class="col-3 tetx-title2 text-bold">Account</div>
            <div class="col-3">{{ ":" + account }}</div>
          </div>
          <div class="row">
            <div class="col-3 tetx-title2 text-bold">Voucher No.</div>
            <div class="col-3">{{ ":" + voucher.voucherNo }}</div>
            <div class="col-3 tetx-title2 text-bold">Voucher Date</div>
            <div class="col-3">{{ ":" + voucher.date }}</div>
          </div>

          <div class="row q-mb-sm">
            <div class="col-3 tetx-title2 text-bold">Voucher Amount</div>
            <div class="col-3">
              {{ ":" + voucher.amount.toLocaleString("en-IN") }}
            </div>
            <div class="col-3 tetx-title2 text-bold">Creator</div>
            <div class="col-3">{{ ":" + voucher.creator }}</div>
          </div>
          <div class="row">
            <div class="col-3 tetx-title2 text-bold">Openeing Balance</div>
            <div class="col-3">
              {{ ":" + voucher.openingBalance.toLocaleString("en-IN") }}
            </div>
            <div class="col-3 tetx-title2 text-bold">Closing Balance</div>
            <div class="col-3">
              {{ ":" + voucher.closingBalance.toLocaleString("en-IN") }}
            </div>
          </div>
        </q-card-section>
        <q-card-section
          v-if="
            voucher !== null && voucher.list !== null && voucher.list.length > 0
          "
        >
          <q-table
            ref="myTable"
            flat
            dense
            bordered
            :rows="voucher.list"
            :columns="columns"
            row-key="item"
            binary-state-sort
            :pagination="pagination"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="item" :props="props">
                  {{ props.row.item }}
                </q-td>
                <q-td key="amount" :props="props">
                  {{ Number(props.row.amount).toLocaleString("en-IN") }}
                </q-td>
                <q-td key="creditor" :props="props">{{
                  props.row.creditor
                }}</q-td>
                <q-td key="ledger" :props="props">{{ props.row.ledger }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { creditorStore } from "src/pinia_stores/CreditorStore";
import { LocalStorage } from "quasar";
import { projectStore } from "src/pinia_stores/ProjectStore";
import { capitalAccountStore } from "src/pinia_stores/CapitalAccountStore";
export default {
  name: "VoucherView",
  mixins: [],

  props: {
    voucher: {
      type: Object,
      default: null,
    },
  },
  computed: {},
  watch: {
    async voucher(val) {
      if (val !== null) {
        await this.updateData();
      }
    },
  },
  mounted() {
    // this.ledgers = creditorStore().ledgersCache;
  },
  beforeUnmount() {},
  setup() {
    return {};
  },
  computed: {},
  data() {
    return {
      clientId: LocalStorage.getItem("auth").client.id,
      pagination: { rowsPerPage: 50 },
      openView: false,
      columns: [
        {
          name: "item",
          align: "left",
          label: "Item/Narration",
          field: "item",
        },

        {
          name: "amount",
          align: "left",
          label: "Amount",
          field: "amount",
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
      data: null,
      project: null,
      account: null,
    };
  },
  methods: {
    async updateData() {
      this.project = await projectStore().getProjectName(
        this.clientId,
        this.voucher.projectId,
        false
      );

      this.account = await capitalAccountStore().getAccountName(
        this.clientId,
        this.voucher.capitalAccountId,
        false
      );

      for (let item of this.voucher.list) {
        if (item.creditorId !== null) {
          item["creditor"] = await creditorStore().getCreditorName(
            this.clientId,
            Number(item.creditorId),
            false
          );
        }
        if (item.ledgerId !== null) {
          item["ledger"] = await creditorStore().getLedgerName(
            this.clientId,
            Number(item.creditorId),
            Number(item.ledgerId),
            false
          );
        }
        this.data = this.voucher;
        this.openView = true;
      }
    },
    openDialog() {},
    beforeShow() {},
    onHide() {},
    closeView() {
      this.openView = false;
      this.data = null;
      this.$emit("close");
    },
  },
};
</script>
