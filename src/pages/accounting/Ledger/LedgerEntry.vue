<template>
  <q-layout>
    <div>
      <div v-if="!updatePayments">
        <q-table
          flat
          dense
          bordered
          :rows="entries"
          :columns="columns"
          row-key="name"
          binary-state-sort
          :pagination="credit_pagination"
        >
          <template v-slot:top="">
            <q-input
              bg-color="secondary"
              filled
              class="custom-small-input"
              style="max-width: 150px"
              hide-bottom-space
              dense
              outlined
              v-model="creditEntryDate"
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
                      v-model="creditEntryDate"
                      mask="DD-MM-YYYY"
                      minimal
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select
              bg-color="secondary"
              filled
              class="q-ml-sm custom-small-select"
              dense
              outlined
              hide-bottom-space
              label-color="secondary"
              :options="projectOptions"
              v-model="selectedProjectId"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterProject"
              :placeholder="selectedProjectId === null ? 'select project' : ''"
            >
              <template #label
                ><span class="text-subtitle2">Select Project</span></template
              >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-red">
                    No Creditor Matched
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-space />
            <q-btn
              class="text-capitalize"
              text-color="primary"
              label="Switch to Payment"
              size="10px"
              @click="switchEntryMode"
            />
          </template>
          <template v-slot:top-left> </template>
          <template v-slot:bottom>
            <q-btn
              :disable="disable"
              class="text-secondary"
              label="add (Alt + a)"
              @click="addNewEntry()"
              size="10px"
            /><q-btn
              :disable="disable"
              class="text-secondary dense q-ml-sm"
              label="duplicate (Alt + c)"
              @click="addDuplicateNewEntry"
              size="10px"
            />
            <q-space />
            <q-btn
              :disable="disable"
              color="secondary"
              class="text-secondary q-ml-md float-right"
              label="Post"
              size="10px"
              @click="postEntries(entries)"
            />
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
                  @blur="
                    validateChallan($event.target.value, props, props.rowIndex)
                  "
                />
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
                  v-model="props.row.item"
                  option-disable="inactive"
                  emit-value
                  map-options
                  use-input
                  input-debounce="0"
                  @filter="filterItem"
                  @update:model-value="setRow(props.row)"
                  hide-dropdown-icon
                  :placeholder="props.row.item === null ? 'item' : ''"
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
                key="credit"
                :props="props"
                style="width: 150px; max-width: 200px"
              >
                {{ props.row.credit.toLocaleString("en-IN") + ".00" }}
              </q-td>
              <q-td style="max-width: 20px">
                <q-icon
                  color="red"
                  size="10px"
                  class="q-mr-sm pointer"
                  :name="icons.delete"
                  @click="removeEntry(props.rowIndex)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div v-if="updatePayments">
        <q-table
          flat
          dense
          bordered
          :rows="debitEntries"
          :columns="paymentColumns"
          row-key="name"
          binary-state-sort
        >
          <template v-slot:top="">
            <q-input
              bg-color="secondary"
              filled
              class="custom-small-input"
              style="max-width: 150px"
              hide-bottom-space
              dense
              outlined
              v-model="creditEntryDate"
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
                      v-model="creditEntryDate"
                      mask="DD-MM-YYYY"
                      minimal
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select
              bg-color="secondary"
              filled
              class="q-ml-sm custom-small-select"
              dense
              outlined
              hide-bottom-space
              label-color="secondary"
              :options="projectOptions"
              v-model="selectedProjectId"
              option-disable="inactive"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterProject"
              :placeholder="
                selectedProjectId === null ? 'select project (optional)' : ''
              "
            >
              <template #label
                ><span class="text-subtitle2">Select Project</span></template
              >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-red">
                    No Project Matched
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-space />
            <q-btn
              @click="switchEntryMode"
              class="text-capitalize"
              text-color="primary"
              label="Switch to Purchase"
              size="10px"
            />
          </template>
          <template v-slot:top-left> </template>
          <template v-slot:bottom>
            <q-btn
              :disable="creditEntryDate === null"
              class="text-secondary"
              label="add (Alt + a)"
              @click="addNewEntry"
              size="10px"
            />
            <q-space />
            <q-btn
              :disable="creditEntryDate === null"
              color="secondary"
              class="text-secondary q-ml-md float-right"
              label="Post"
              size="10px"
              @click="postEntries(debitEntries)"
            />
          </template>

          <template v-slot:top-right> </template>
          <template v-slot:body="props" v-if="items !== null">
            <q-tr :props="props" :ref="'itemRow-' + props.rowIndex">
              <q-td key="debit" :props="props">
                <q-input
                  type="number"
                  :disable="creditEntryDate === null"
                  class="custom-small-input"
                  style="max-width: 150px"
                  v-model="props.row.debit"
                  dense
                  outlined
                  :placeholder="'amount'"
                />
              </q-td>
              <q-td key="paymentMode">
                <q-select
                  :disable="creditEntryDate === null"
                  class="custom-small-select"
                  dense
                  outlined
                  :options="['Cheque', 'Online', 'UPI', 'Cash']"
                  v-model="props.row.paymentMode"
                  :placeholder="
                    props.row.paymentMode === null ? 'payment mode' : ''
                  "
                >
                </q-select>
              </q-td>

              <q-td key="paymentRefNo" :props="props">
                <q-input
                  :disable="creditEntryDate === null"
                  class="custom-small-input"
                  style="max-width: 200px"
                  v-model="props.row.paymentRefNo"
                  dense
                  outlined
                  placeholder="cheque no, utr, tras. ref no"
                />
              </q-td>

              <q-td key="remark" :props="props">
                <q-input
                  :disable="creditEntryDate === null"
                  class="custom-small-input"
                  style="max-width: 300px"
                  v-model="props.row.remark"
                  dense
                  outlined
                  placeholder="remark"
                />
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
      </div>

      <q-inner-loading :showing="enableScreen">
        <div class="text-red text-bold bg-white q-pa-xl">
          Please select creditor and ledger
        </div>
      </q-inner-loading>
    </div>
  </q-layout>
</template>

<script>
import { fasPlus, fasTrash } from "@quasar/extras/fontawesome-v5";
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import ProjectService from "src/services/ProjectService";
import { date } from "quasar";
import { ref } from "vue";
import { projectStore } from "src/pinia_stores/ProjectStore";
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
    startDate: {
      type: Date,
      default: null,
    },
    updatePayments: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    enableScreen() {
      return (
        this.isNullOrUndefined(this.creditorId) ||
        this.isNullOrUndefined(this.ledgerId)
      );
    },
    disable() {
      return (
        this.isNullOrUndefined(this.creditEntryDate) ||
        this.isNullOrUndefined(this.selectedProjectId)
      );
    },
  },
  mounted() {
    // this.$emit("ledger-entry-init");
    this.disable = !(this.creditorId !== null && this.ledgerId !== null);
    this.getProjects();
    // this.getItems();
    window.addEventListener("keydown", this.keyDownHandlerForEntry);
    // this.$q.loading.show({
    //   message: "Some important process  is in progress. Hang on...",
    // });
  },
  beforeUnmount() {
    // Remove event listener before the component is unmounted to prevent memory leaks
    window.removeEventListener("keydown", this.keyDownHandlerForEntry);
  },
  components: {},
  watch: {
    creditorId(val) {
      this.getItems();
      this.disable = this.creditorId === null || this.ledgerId === null;
    },
    ledgerId(val) {
      this.disable = this.ledgerId === null || this.creditorId === null;
    },
    creditEntryDate(val) {
      const startDate = date.extractDate(this.startDate, "DD-MM-YYYY");
      const entryDate = date.extractDate(val, "DD-MM-YYYY");
      if (startDate > entryDate) {
        this.creditEntryDate = null;
        this.$q.notify({
          message: "Invalid Date",
          caption: "Entry date can not be before ledger opening date",
        });
      }
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
          selected: false,
          name: "receipt",
          align: "left",
          label: "Challan/Receipt",
          field: "receipt",
        },
        {
          selected: true,
          name: "item",
          align: "left",
          label: "item",
          field: "item",
        },
        {
          selected: true,
          name: "quantity",
          align: "left",
          label: "Qty",
          field: "quantity",
        },
        {
          selected: true,
          name: "rate",
          align: "left",
          label: "Rate",
          field: "rate",
        },
        {
          selected: false,
          name: "vehicle",
          align: "left",
          label: "Vehicle",
          field: "vehicle",
        },
        {
          selected: false,
          name: "remark",
          align: "left",
          label: "Note",
          field: "remark",
        },
        {
          selected: false,
          name: "credit",
          align: "left",
          label: "Total",
          field: "credit",
        },
      ],
      paymentColumns: [
        {
          name: "debit",
          align: "left",
          label: "Amount",
          field: "debit",
        },

        {
          name: "paymentMode",
          align: "left",
          label: "Mode",
          field: "paymentMode",
        },
        {
          name: "paymentRefNo",
          align: "left",
          label: "Trans.Ref.No/UTR/ChequeNo",
          field: "paymentRefNo",
        },
        { name: "remark", align: "left", label: "Note", field: "remark" },
      ],
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
      user: this.isAdmin()
        ? "admin"
        : this.getUser().name.split(" ")[0].toLowerCase(),
      credit_pagination: { rowsPerPage: 100 },
      projects: [],
      projectOptions: [],
      selectedProjectId: null,
      creditEntryDate: null,
      entries: this.initiate(),
      selectedItem: null,
      itemOptions: [],
      items: [],
      keysPressed: null,
      debitEntries: this.initiate(),
    };
  },
  methods: {
    switchEntryMode() {
      this.$emit("changeMode");
    },
    initiate() {
      let list = [];
      list.push(this.newEntry());
      return list;
    },
    newEntry() {
      return {
        id: null,
        clientId: null,
        creditorId: null,
        ledgerId: null,
        projectId: null,
        receipt: null,
        date: null,
        item: null,
        rate: null,
        quantity: null,
        unit: null,
        vehicle: null,
        remark: null,
        credit: 0.0,
        entryType: null,
        debit: 0.0,
        narration: null,
        paymentMode: null,
        paymentId: null,
        user: null,
      };
    },
    postEntries(entries) {
      entries.forEach((entry) => {
        entry.clientId = this.clientId;
        entry.creditorId = this.creditorId;
        entry.ledgerId = this.ledgerId;
        entry.projectId = this.selectedProjectId;
        entry.date = this.creditEntryDate;
        entry.user = this.user;
        if (this.updatePayments) {
          entry.entryType = "DEBIT";
        } else {
          entry.entryType = "CREDIT";
        }
      });
      var message = "All entries Updated Successfully !";
      AccountingService.postEntries(entries)
        .then((status) => {
          if (status) {
            if (this.updatePayments) {
              this.debitEntries = [];
              this.debitEntries.push(this.newEntry());
              message = "All Payments Updated Successfully !";
            } else {
              this.entries = [];
              this.entries.push(this.newEntry());
            }
            this.$q.notify({
              message: message,
              color: "green",
              position: "center",
              timeout: 0,
              actions: [
                {
                  icon: "close",
                  color: "white",
                  round: true,
                  handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    async getProjects() {
      this.projects = await projectStore().loadProjects(this.clientId, false);
    },
    keyDownHandlerForEntry(event) {
      // console.log(" keydown:", event.key);
      if (this.keysPressed !== "Alt") this.keysPressed = event.key;
      if (this.keysPressed === "Alt" && event.key === "a") {
        this.keysPressed = null;
        this.addNewEntry();
      } else if (
        this.keysPressed === "Alt" &&
        event.key === "c" &&
        !this.updatePayments
      ) {
        this.keysPressed = null;
        this.addDuplicateNewEntry();
      }
    },
    removeEntry(rowIndex) {
      if (this.updatePayments) {
        if (this.debitEntries.length === 1) {
          return;
        }
        this.debitEntries.splice(rowIndex, 1);
      } else {
        if (this.entries.length === 1) {
          return;
        }
        this.entries.splice(rowIndex, 1);
      }
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
      if (!this.updatePayments) this.entries.push(this.newEntry());
      else this.debitEntries.push(this.newEntry());
    },
    filterProject(input, update, abort) {
      update(() => {
        const value = input.toLowerCase();
        this.projectOptions = this.projects.filter((project) => {
          return project.label.toLowerCase().indexOf(value) > -1;
        });
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
      let item = this.items.find(
        (item) => item.name.toLowerCase() === row.item.toLowerCase()
      );

      row.rate = Number(item.rate);
      row.unit = item.unit;
    },
    setTotal(row) {
      row.credit = Number(row.rate) * Number(row.quantity);
    },
    validateChallan(val, props, rowIndex) {
      for (let index = 0; index < this.entries.length; index++) {
        if (rowIndex === index) {
          continue;
        }

        if (
          this.entries[index].receipt !== null &&
          this.entries[index].receipt.trim().toLowerCase() ===
            val.trim().toLowerCase()
        ) {
          props.row.receipt = null;
          console.log(JSON.stringify(props));
          this.$q.notify({
            message: "Duplicate Receipt",
            caption: "Challan/Receipt: " + this.entries[index].receipt,
            color: "red",
            timeout: 0,

            actions: [
              {
                icon: "close",
                color: "white",
                round: true,
                handler: () => {
                  /* ... */
                },
              },
            ],
          });
          return;
        }
      }

      let req = {
        clientId: this.clientId,
        creditorId: this.creditorId,
        date: this.creditEntryDate,
        receipt: val,
      };
      AccountingService.findEntryByDateAndChallan(req)
        .then((response) => {
          if (response.id !== null) {
            this.$q.notify({
              type: "warning",
              message: "Duplicate Entry Found For Receipt: " + response.receipt,
              timeout: 0,
              caption:
                "Date: " +
                response.date +
                ", Item: " +
                response.item +
                ", Qty: " +
                response.quantity,
              actions: [
                {
                  icon: "close",
                  color: "white",
                  round: true,
                  handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          }
        })
        .catch((err) => {});
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
