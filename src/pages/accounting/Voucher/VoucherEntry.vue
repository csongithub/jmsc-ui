<template>
  <q-layout>
    <q-table
      ref="myTable"
      flat
      dense
      bordered
      :rows="items"
      :columns="columns"
      row-key="name"
      binary-state-sort
      :pagination="pagination"
    >
      <template v-slot:top="">
        <q-input
          class="custom-small-input"
          label="Voucher No"
          style="max-width: 200px"
          v-model="voucher.voucherNo"
          dense
          outlined
          placeholder="voucher no"
        />
        <q-input
          filled
          class="custom-small-input q-ml-sm"
          style="max-width: 150px"
          hide-bottom-space
          dense
          outlined
          label="Voucher Date"
          v-model="voucher.date"
          :rules="['DD-MM-YYYY']"
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
                <q-date v-model="voucher.date" mask="DD-MM-YYYY" minimal />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          label="Project"
          filled
          class="q-ml-sm custom-small-select"
          dense
          outlined
          hide-bottom-space
          :options="projectOptions"
          v-model="voucher.projectId"
          option-disable="inactive"
          emit-value
          map-options
          use-input
          input-debounce="0"
          @filter="filterProject"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-red">
                No Project Matched
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          label="Capital"
          filled
          class="q-ml-sm custom-small-select"
          dense
          outlined
          hide-bottom-space
          :options="capitalOptions"
          v-model="voucher.capitalAccountId"
          option-disable="inactive"
          emit-value
          map-options
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
      </template>
      <template v-slot:bottom>
        <q-btn
          class="text-secondary"
          label="add"
          @click="addItem"
          size="10px"
        />
        <q-space />
        <q-btn
          color="secondary"
          class="text-secondary q-ml-md float-right"
          label="Save"
          size="10px"
          @click="saveVoucher"
        />
      </template>
    </q-table>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import { filter } from "../Utils/filterUtils";
import { projectStore } from "../../../pinia_stores/ProjectStore";
import { capitalAccountStore } from "src/pinia_stores/CapitalAccountStore";

export default {
  name: "VoucherEntry",
  mixins: [commonMixin],
  components: {},
  async mounted() {
    this.initiateData();
  },
  beforeUnmount() {},
  computed: {},
  setup() {
    return {
      tab: ref("entry"),
      columns: [
        { name: "item", align: "left", label: "Description", field: "item" },
        {
          name: "amount",
          align: "left",
          label: "Amount",
          field: "amount",
          format: (val) => `${val.toLocaleString("en-IN")}`,
        },
        {
          name: "creditorId",
          align: "left",
          label: "Creditor",
          field: "creditorId",
        },
        {
          name: "ledgerId",
          align: "left",
          label: "Ledger",
          field: "ledgerId",
        },
        {
          name: "group",
          align: "left",
          label: "Category",
          field: "group",
        },
      ],
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
      pagination: { rowsPerPage: 100 },
      voucherDate: null,
      voucherProject: null,
      voucher: {
        clientId: this.getClientId(),
        id: null,
        voucherNo: null,
        date: null,
        amount: null,
        capitalAccountId: null,
        projectId: null,
        items: null,
      },
      items: [
        {
          item: null,
          amount: 0,
          group: null,
          creditorId: null,
          ledgerId: null,
        },
      ],
      projects: [],
      capitals: [],
      projectOptions: [],
      capitalOptions: [],
    };
  },
  methods: {
    async initiateData() {
      this.projects = await projectStore().loadProjects(
        this.getClientId(),
        false
      );

      this.capitals = await capitalAccountStore().loadCapitalAccounts(
        this.getClientId(),
        false
      );
    },

    filterProject(input, update, abort) {
      this.projectOptions = filter(input, update, this.projects);
    },
    filterCapital(input, update, abort) {
      this.capitalOptions = filter(input, update, this.capitals);
    },
    newitem() {
      return {
        item: null,
        amount: 0,
        group: null,
        creditorId: null,
        ledgerId: null,
      };
    },
    addItem() {
      this.items.push(this.newitem());
    },
  },
};
</script>
