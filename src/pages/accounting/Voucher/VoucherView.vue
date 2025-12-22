<template>
  <div>
    <q-dialog
      v-model="openView"
      persistent
      ref="voucherViewRef"
      position="right"
    >
      <q-card style="width: 600px; max-width: 80vw">
        <q-bar class="bg-secondary text-white text-weight-light text-subtitle2">
          {{ "Voucher Details" }}
          <q-space />
          <q-btn dense flat icon="close" @click="closeView">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section v-if="voucher !== null">
          <div class="row">
            <div class="col-3 tetx-title2 text-bold">Voucher No.</div>
            <div class="col-2">{{ ":" + voucher.voucherNo }}</div>
            <div class="col-3 tetx-title2 text-bold">Voucher Date</div>
            <div class="col-2">{{ ":" + voucher.date }}</div>
          </div>

          <div class="row">
            <div class="col-3 tetx-title2 text-bold">Voucher Amount</div>
            <div class="col-2">
              {{ ":" + voucher.amount.toLocaleString("en-IN") }}
            </div>
            <div class="col-3 tetx-title2 text-bold">Creator</div>
            <div class="col-2">{{ ":" + voucher.creator }}</div>
          </div>
          <div class="row">
            <div class="col-3 tetx-title2 text-bold">Openeing Balance</div>
            <div class="col-2">
              {{ ":" + voucher.openingBalance.toLocaleString("en-IN") }}
            </div>
            <div class="col-3 tetx-title2 text-bold">Closing Balance</div>
            <div class="col-2">
              {{ ":" + voucher.closingBalance.toLocaleString("en-IN") }}
            </div>
          </div>
        </q-card-section>
        <q-card-section
          v-if="
            voucher !== null && voucher.list !== null && voucher.list.length > 0
          "
        >
          <!-- <div class="row">
            <div class="col">Item</div>
            <div class="col">Amount</div>
            <div class="col">Creditor</div>
            <div class="col">Ledger</div>
          </div>
          <div class="row" v-for="(item, index) in voucher.list" :key="index">
            <div class="col">{{ item.item }}</div>
            <div class="col">{{ item.amount }}</div>
            <div class="col">{{ item.creditorId }}</div>
            <div class="col">{{ item.ledgerId }}</div>
          </div> -->
          <q-table
            ref="myTable"
            flat
            dense
            bordered
            :rows="voucher.list"
            :columns="columns"
            row-key="item"
            binary-state-sort
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="item" :props="props">
                  {{ props.row.item }}
                </q-td>
                <q-td key="amount" :props="props">
                  {{ Number(props.row.amount).toLocaleString("en-IN") }}
                </q-td>
                <q-td key="creditorId" :props="props">{{
                  props.row.creditorId !== null
                    ? getCreditorNameFromStore(props.row.creditorId)
                    : ""
                }}</q-td>
                <q-td key="ledgerId" :props="props">{{
                  props.row.ledgerId
                }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { storeMixin } from "src/mixin/storeMixin";

// import AccountingService from "src/services/accounting/AccountingService";
export default {
  name: "VoucherView",
  mixins: [storeMixin],

  props: {
    voucher: {
      type: Object,
      default: null,
    },
  },
  computed: {
    open() {
      return true;
    },
  },
  watch: {
    voucher(val) {
      this.openView = val !== null ? true : false;
    },
  },
  mounted() {},
  beforeUnmount() {},
  setup() {
    return {};
  },
  computed: {},
  data() {
    return {
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
          name: "creditorId",
          align: "left",
          label: "Creditor",
          field: (row) => "chandan",
        },
        {
          name: "ledgerId",
          align: "left",
          label: "Ledger",
          field: "ledgerId",
        },
      ],
    };
  },
  methods: {
    openDialog() {},
    beforeShow() {},
    onHide() {},
    closeView() {
      this.$emit("close");
    },
    getCreditorName() {
      return "chandan-";
    },
  },
};
</script>
