<template>
  <q-layout>
    <q-table
      flat
      dense
      bordered
      :rows="entries"
      :columns="columns"
      row-key="name"
      binary-state-sort
      :pagination="credits_pagination"
      :visible-columns="visibleColumns"
    >
      <template v-slot:top=""> </template>
      <template v-slot:top-left> </template>
      <template v-slot:bottom>
        <q-btn
          class="text-secondary"
          label="add (Alt + a)"
          @click="addNewEntry"
          size="10px"
        /><q-btn
          class="text-secondary dense q-ml-sm"
          label="duplicate (Alt + c)"
          @click="addDuplicateNewEntry"
          size="10px"
        />
        <q-space />
        <q-btn
          color="secondary"
          class="text-secondary q-ml-md float-right"
          label="Post (Alt + s)"
          size="10px"
        />
      </template>
      <template v-slot:loading>
        <!-- <q-inner-loading
          class="text-red"
          v-if="creditorId === null || ledgerId === null"
          showing
          color="primary"
          label="Select a Creditor and a Ledger"
          size="sm"
          transition-show
        /> -->
      </template>
      <template v-slot:top-right> </template>
      <template v-slot:body="props" v-if="items !== null">
        <q-tr :props="props" :ref="'itemRow-' + props.rowIndex">
          <q-td key="receipt" :props="props">
            <q-input
              :disable="disable"
              class="custom-small-input"
              style="max-width: 100px"
              v-model="props.row.receipt"
              dense
              outlined
              :placeholder="'challan'"
            />
          </q-td>
          <q-td key="date" :props="props">
            <q-input
              :disable="disable"
              class="custom-small-input"
              style="max-width: 150px"
              hide-bottom-space
              dense
              outlined
              v-model="props.row.date"
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
                    <q-date
                      v-model="props.row.date"
                      mask="DD-MM-YYYY"
                      minimal
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-td>
          <q-td key="item">
            <q-select
              :disable="disable"
              class="custom-small-select"
              style="max-width: 150px"
              dense
              outlined
              option-label="name"
              option-value="name"
              :options="itemOptions"
              v-model="props.row.name"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              @filter="filterItem"
              @update:model-value="setRow(props.row)"
              hide-dropdown-icon
            >
            </q-select>
          </q-td>

          <q-td key="quantity" :props="props">
            <q-input
              :disable="disable"
              class="custom-small-input"
              type="number"
              style="max-width: 100px"
              v-model="props.row.quantity"
              dense
              outlined
              placeholder="qty"
              @update:model-value="setTotal(props.row)"
            >
              <template v-slot:append>
                <q-avatar>
                  {{ props.row.unit }}
                </q-avatar>
              </template>
            </q-input>
          </q-td>
          <q-td key="rate" :props="props">
            <q-input
              :disable="disable"
              class="custom-small-input"
              type="number"
              style="max-width: 100px"
              v-model="props.row.rate"
              dense
              outlined
              placeholder="rate"
              @update:model-value="setTotal(props.row)"
            />
          </q-td>
          <q-td key="vehicle" :props="props">
            <q-input
              :disable="disable"
              class="custom-small-input"
              style="max-width: 100px"
              v-model="props.row.vehicle"
              dense
              outlined
              placeholder="vehicle"
            />
          </q-td>
          <q-td key="remark" :props="props">
            <q-input
              :disable="disable"
              class="custom-small-input"
              style="max-width: 100px"
              v-model="props.row.remark"
              dense
              outlined
              placeholder="remark"
            />
          </q-td>
          <q-td
            class="text-bold text-red"
            key="total"
            :props="props"
            style="width: 150px; max-width: 200px"
          >
            {{ props.row.total.toLocaleString("en-IN") + ".00" }}
          </q-td>
          <q-td style="max-width: 20px">
            <q-icon
              color="red"
              class="q-mr-sm pointer"
              :name="icons.delete"
              @click="removeEntry(props.rowIndex)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-layout>
</template>

<script>
import { fasPlus, fasTrash } from "@quasar/extras/fontawesome-v5";
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
AccountingService;
export default {
  name: "Credit",
  mixins: [commonMixin],
  props: {
    creditorId: {
      type: Number,
      default: null,
    },
    ledgerId: {
      type: Number,
      default: null,
    },
  },
  mounted() {
    window.addEventListener("keydown", this.keyDownHandlerForEntry);
  },
  beforeUnmount() {
    // Remove event listener before the component is unmounted to prevent memory leaks
    window.removeEventListener("keydown", this.keyDownHandlerForEntry);
  },
  components: {},
  watch: {
    creditorId(val) {
      this.getItems();
      this.disable = val === null || this.ledgerId === null;
    },
    ledgerId(val) {
      this.disable = val === null || this.creditorId === null;
    },
  },
  setup() {
    return {
      icons: {
        add: fasPlus,
        delete: fasTrash,
      },
      columns: [
        {
          name: "receipt",
          align: "left",
          label: "Challan/Receipt",
          field: "receipt",
        },
        ,
        {
          name: "date",
          required: true,
          label: "Date",
          align: "left",
          sortable: true,
        },
        {
          name: "item",
          align: "left",
          label: "item",
          field: "item",
          sortable: true,
        },

        { name: "quantity", align: "left", label: "Qty", field: "unit" },
        { name: "rate", align: "left", label: "Rate", field: "rate" },
        { name: "vehicle", align: "left", label: "Vehicle", field: "vehicle" },
        { name: "remark", align: "left", label: "Remark", field: "remark" },
        { name: "total", align: "left", label: "Total", field: "total" },
      ],
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
      entries: [
        {
          receipt: null,
          date: null,
          item: null,
          rate: null,
          quantity: null,
          unit: null,
          vehicle: null,
          remark: null,
          total: 0.0,
        },
      ],
      selectedItem: null,
      itemOptions: [],
      items: [],
      keysPressed: null,
      disable: true,
    };
  },
  methods: {
    keyDownHandlerForEntry(event) {
      console.log(" keydown:", event.key);
      if (this.keysPressed !== "Alt") this.keysPressed = event.key;
      if (this.keysPressed === "Alt" && event.key === "a") {
        this.keysPressed = null;
        this.addNewEntry();
      } else if (this.keysPressed === "Alt" && event.key === "c") {
        this.keysPressed = null;
        this.addDuplicateNewEntry();
      }
    },
    removeEntry(rowIndex) {
      if (this.entries.length === 1) {
        return;
      }
      this.entries.splice(rowIndex, 1);
    },
    addDuplicateNewEntry() {
      if (this.creditorId === null || this.ledgerId === null) {
        window.alert("please select creditor & ledger");
        return;
      }
      const lastEntry = this.entries[this.entries.length - 1];
      const duplicate = JSON.parse(JSON.stringify(lastEntry));
      this.entries.push(duplicate);
    },
    addNewEntry() {
      if (this.creditorId === null || this.ledgerId === null) {
        window.alert("please select creditor & ledger");
        return;
      }
      this.entries.push({
        receipt: null,
        date: null,
        item: null,
        rate: null,
        quantity: null,
        unit: null,
        vehicle: null,
        remark: null,
        total: 0.0,
      });
    },
    filterItem(input, update, abort) {
      update(() => {
        const value = input.toLowerCase();
        this.itemOptions = this.items.filter((item) => {
          return item.name.toLowerCase().indexOf(value) > -1;
        });
      });
    },
    getItems() {
      AccountingService.getMaterials(this.clientId, this.creditorId)
        .then((response) => {
          this.itemOptions.splice(0, this.itemOptions.length);
          this.items.splice(0, this.items.length);
          this.itemOptions = JSON.parse(response);
          this.items = JSON.parse(response);
        })
        .catch((err) => {});
    },
    setRow(row) {
      let item = this.items.find((item) => item.name === row.name);
      row.rate = item.rate;
      row.unit = item.unit;
    },
    setTotal(row) {
      row.total = row.rate * row.quantity;
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-small-input,
.custom-small-select {
  // Target the control and marginal areas for height adjustment
  :deep(.q-field__control),
  :deep(.q-field__marginal) {
    height: 32px !important; // Adjust height as needed
    min-height: 32px !important; // Ensure minimum height
  }
  // Adjust padding for the native input element
  :deep(.q-field__control),
  :deep(.q-field__native) {
    padding: 0 4px; // Adjust padding as needed
  }
  // Adjust font size for the native input text
  :deep(.q-field__native) {
    font-size: 12px; // Adjust font size as needed
    min-height: 32px !important; // Ensure minimum height for native element
  }
  // Adjust label position for smaller inputs
  :deep(.q-field__label) {
    top: 6px !important; // Adjust label position
  }
}
</style>
