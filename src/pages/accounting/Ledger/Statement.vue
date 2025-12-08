<template>
  <q-layout>
    <div>
      <q-table
        ref="myTable"
        flat
        dense
        bordered
        :rows="entries"
        :columns="columns"
        row-key="name"
        binary-state-sort
        :pagination="pagination"
      >
        <template v-slot:top="">
          <span class="q-mr-sm">From Date:</span>
          <q-input
            filled
            class="custom-small-input"
            style="max-width: 150px"
            hide-bottom-space
            dense
            outlined
            v-model="fromDate"
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
                  <q-date v-model="fromDate" mask="DD-MM-YYYY" minimal />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <span class="q-mr-sm q-ml-md">To Date:</span>
          <q-input
            filled
            class="custom-small-input"
            style="max-width: 150px"
            hide-bottom-space
            dense
            outlined
            v-model="toDate"
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
                  <q-date v-model="toDate" mask="DD-MM-YYYY" minimal />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <span class="q-mr-sm q-ml-md">Record Type:</span>
          <q-select
            class="q-ml-sm custom-small-select"
            transition-show="flip-up"
            transition-hide="flip-down"
            filled
            v-model="entryType"
            :options="['CREDIT', 'DEBIT', 'ALL']"
            style="width: 150px"
          />
          <q-btn
            class="text-secondary float-right q-ml-lg"
            label="Get Records"
            @click="getEntries"
            size="10px"
          />

          <q-btn
            v-if="entries.length > 0"
            class="text-secondary q-pa-xs q-ml-xs text-capitalize"
            size="10px"
            :icon="icons.pdf"
            @click="prepAndGenerate"
          >
            <q-tooltip>Generate PDF</q-tooltip>
          </q-btn>
        </template>
        <template
          v-slot:body-cell-quantity="props"
          v-if="entryType === 'CREDIT' || entryType === 'ALL'"
        >
          <q-td :props="props">
            {{
              props.row.quantity !== 0
                ? props.row.quantity + " " + props.row.unit
                : ""
            }}
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-icon
            color="grey"
            class="q-mr-sm pointer"
            :name="icons.edit"
            size="10px"
            @click="editEntry(props.row)"
          />

          <q-icon
            color="red"
            class="pointer"
            :name="icons.delete"
            size="10px"
            @click="confirmAndDelete(props.row.id)"
          />
        </template>
      </q-table>
    </div>
    <div>
      <q-dialog
        v-model="showEditEntryModal"
        @hide="cancelUpdate"
        persistent
        ref="editEntryModalRef"
      >
        <q-card style="width: fit-content; max-width: 80vw">
          <q-bar
            class="bg-secondary text-white text-weight-light text-subtitle2"
          >
            {{ "Update Entry" }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="row">
              <div class="col-3 q-mr-sm">Date</div>
              <div class="col-3">Project</div>
            </div>
            <div class="row">
              <div class="col-3 q-mr-sm">
                <q-input
                  class="custom-small-input"
                  hide-bottom-space
                  dense
                  outlined
                  v-model="entry.date"
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
                          v-model="entry.date"
                          mask="DD-MM-YYYY"
                          minimal
                          :options="disableFutureDates"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-6">
                <q-select
                  :disable="disable"
                  class="custom-small-select"
                  dense
                  outlined
                  hide-bottom-space
                  label-color="secondary"
                  :options="projectOptions"
                  v-model="entry.projectId"
                  option-disable="inactive"
                  emit-value
                  map-options
                  use-input
                  input-debounce="0"
                  @filter="filterProject"
                  :placeholder="
                    entry.projectId === null ? 'select project' : ''
                  "
                >
                  <template #label
                    ><span class="text-subtitle2"
                      >Select Project</span
                    ></template
                  >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        No Creditor Matched
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="entry.entryType === 'CREDIT'">
            <div class="row">
              <div class="col q-mr-sm">Receipt</div>
              <div class="col q-mr-sm">Item</div>
              <div class="col q-mr-sm">Qty.</div>
              <div class="col q-mr-sm">Rate</div>
              <div class="col q-mr-sm">Vehicle</div>
              <div class="col q-mr-sm">Note</div>
              <div class="col q-mr-sm">Total</div>
            </div>
            <div class="row q-mt-sm">
              <div class="col q-mr-sm">
                <q-input
                  class="custom-small-input"
                  style="max-width: 100px"
                  v-model="entry.receipt"
                  dense
                  outlined
                  :placeholder="'challan'"
                  @blur="validateChallan($event.target.value)"
                />
              </div>
              <div class="col q-mr-sm">
                <q-select
                  class="custom-small-select"
                  style="max-width: 150px"
                  dense
                  outlined
                  option-label="name"
                  option-value="name"
                  :options="itemOptions"
                  v-model="entry.item"
                  option-disable="inactive"
                  emit-value
                  map-options
                  use-input
                  input-debounce="0"
                  @filter="filterItem"
                  @update:model-value="setRow(entry)"
                  hide-dropdown-icon
                >
                </q-select>
              </div>
              <div class="col q-mr-sm">
                <q-input
                  class="custom-small-input"
                  type="number"
                  style="max-width: 100px"
                  v-model="entry.quantity"
                  dense
                  outlined
                  placeholder="qty"
                  @update:model-value="
                    entry.credit = entry.rate * entry.quantity
                  "
                >
                  <template v-slot:append>
                    <q-avatar>
                      {{ entry.unit }}
                    </q-avatar>
                  </template>
                </q-input>
              </div>
              <div class="col q-mr-sm">
                <q-input
                  class="custom-small-input"
                  type="number"
                  style="max-width: 100px"
                  v-model="entry.rate"
                  dense
                  outlined
                  placeholder="rate"
                  @update:model-value="
                    entry.credit = entry.rate * entry.quantity
                  "
                />
              </div>
              <div class="col q-mr-sm">
                <q-input
                  class="custom-small-input"
                  style="max-width: 100px"
                  v-model="entry.vehicle"
                  dense
                  outlined
                  placeholder="vehicle"
                />
              </div>
              <div class="col q-mr-sm">
                <q-input
                  class="custom-small-input"
                  style="max-width: 100px"
                  v-model="entry.remark"
                  dense
                  outlined
                  placeholder="remark"
                />
              </div>
              <div class="col text-bold">
                {{
                  (entry.quantity * entry.rate).toLocaleString("en-IN") + ".00"
                }}
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="entry.entryType === 'DEBIT'">
            <div class="row">
              <div class="col q-mr-sm">Amount</div>
              <div class="col q-mr-sm">Mode</div>
              <div class="col q-mr-sm">Trans.Ref.No/UTR/ChequeNo</div>
              <div class="col q-mr-sm">Note</div>
            </div>
            <div class="row">
              <div class="col q-mr-sm">
                <q-input
                  type="number"
                  class="custom-small-input"
                  style="max-width: 150px"
                  v-model="entry.debit"
                  dense
                  outlined
                  :placeholder="'amount'"
                />
              </div>
              <div class="col q-mr-sm">
                <q-select
                  class="custom-small-select"
                  dense
                  outlined
                  :options="['Cheque', 'Online', 'UPI', 'Cash']"
                  v-model="entry.paymentMode"
                  :placeholder="
                    entry.paymentMode === null ? 'payment mode' : ''
                  "
                >
                </q-select>
              </div>
              <div class="col q-mr-sm">
                <q-input
                  class="custom-small-input"
                  style="max-width: 200px"
                  v-model="entry.paymentRefNo"
                  dense
                  outlined
                  placeholder="cheque no, utr, tras. ref no"
                />
              </div>
              <div class="col q-mr-sm">
                <q-input
                  class="custom-small-input"
                  style="max-width: 300px"
                  v-model="entry.remark"
                  dense
                  outlined
                  placeholder="note"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-actions
            ><q-btn
              color="secondary"
              class="text-secondary q-ml-md float-right"
              label="Save"
              size="10px"
              @click="postEntries" />
            <q-btn
              class="text-secondary q-ml-md float-right"
              label="Cancel"
              size="10px"
              @click="cancelUpdate"
          /></q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-layout>
</template>

<script>
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import ProjectService from "src/services/ProjectService";
import {
  fasCopy,
  fasEdit,
  fasFilePdf,
  fasTrash,
} from "@quasar/extras/fontawesome-v5";
import { date } from "quasar";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export default {
  name: "Statement",
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
  },
  mounted() {
    this.getProjects();
    this.getItems();
  },

  beforeUnmount() {},
  components: {},
  watch: {
    creditorId(val) {
      this.getItems();
    },
    ledgerId(val) {},
    entryType(val) {
      this.columns = [];
      this.entries = [];
    },
    fromDate(val) {
      const startDate = date.extractDate(this.startDate, "DD-MM-YYYY");
      const statementFromDate = date.extractDate(val, "DD-MM-YYYY");
      if (startDate > statementFromDate) {
        this.fromDate = null;
        this.$q.notify({
          message: "Invalid Date",
          caption: "From date can not be before ledger opening date",
        });
      }
    },
  },
  setup() {
    return {
      icons: {
        pdf: fasFilePdf,
        delete: fasTrash,
        copy: fasCopy,
        edit: fasEdit,
      },
      creditColumns: [
        { name: "date", align: "left", label: "Date", field: "date" },
        { name: "item", align: "left", label: "Item", field: "item" },
        { name: "quantity", align: "left", label: "Qty.", field: "quantity" },
        { name: "rate", align: "left", label: "Rate", field: "rate" },
        {
          name: "credit",
          align: "left",
          label: "Amount",
          field: "credit",
          format: (val) => `${val.toLocaleString("en-IN") + ".00"}`,
        },
        {
          name: "total",
          align: "left",
          label: "Total",
          field: "total",
          format: (val) => `${val.toLocaleString("en-IN") + ".00"}`,
        },
        { name: "receipt", align: "left", label: "Receipt", field: "receipt" },
        { name: "vehicle", align: "left", label: "Vehicle", field: "vehicle" },
        { name: "action", align: "left", label: "", field: "action" },
      ],
      debitColumns: [
        { name: "date", align: "left", label: "Date", field: "date" },

        {
          name: "paymentMode",
          align: "left",
          label: "Mode",
          field: "paymentMode",
        },
        {
          name: "paymentRefNo",
          align: "left",
          label: "UTR/Transaction Ref No/Cheque No",
          field: "paymentRefNo",
        },
        {
          name: "remark",
          align: "left",
          label: "Remark",
          field: "remark",
        },
        {
          name: "debit",
          align: "left",
          label: "Amount",
          field: "debit",
          format: (val) => `${val.toLocaleString("en-IN") + ".00"}`,
        },
        {
          name: "total",
          align: "left",
          label: "Total",
          field: "total",
          format: (val) => `${val.toLocaleString("en-IN") + ".00"}`,
        },
        { name: "action", align: "left", label: "", field: "action" },
      ],
      allColumns: [
        { name: "date", align: "left", label: "Date", field: "date" },
        {
          name: "narration",
          align: "left",
          label: "Receipt-Vehicle",
          field: "narration",
        },
        {
          name: "item",
          align: "left",
          label: "Item/Payment",
          field: "item",
        },
        {
          name: "quantity",
          align: "left",
          label: "Qty.",
          field: "quantity",
          format: (val) => `${val === 0 || val === null ? "" : val}`,
        },
        {
          name: "rate",
          align: "left",
          label: "Rate",
          field: "rate",
          format: (val) => `${val === 0 || val === null ? "" : val}`,
        },
        {
          name: "debit",
          align: "left",
          label: "Debit",
          field: "debit",
          format: (val) =>
            `${
              val === 0 || val === null
                ? ""
                : val.toLocaleString("en-IN") + ".00"
            }`,
        },
        {
          name: "credit",
          align: "left",
          label: "Credit",
          field: "credit",
          format: (val) =>
            `${
              val === 0 || val === null
                ? ""
                : val.toLocaleString("en-IN") + ".00"
            }`,
        },
        {
          name: "total",
          align: "left",
          label: "Total",
          field: "total",
          format: (val) => `${val.toLocaleString("en-IN") + ".00"}`,
        },
        { name: "action", align: "left", label: "", field: "action" },
      ],
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
      pagination: { rowsPerPage: 50 },
      columns: [],
      entries: [],
      entryType: null,
      fromDate: null,
      toDate: null,
      subtitle: null,
      creditor: null,
      openingBalance: null,
      entry: null,
      itemOptions: [],
      items: [],
      projects: [],
      projectOptions: [],
      showEditEntryModal: false,
    };
  },
  methods: {
    disableFutureDates(dateString) {
      const today = new Date();
      const inputDate = new Date(dateString); // QDate passes 'YYYY/MM/DD'

      // Compare the input date with today's date
      // Return true if the input date is today or in the past, false otherwise.
      return (
        date.isSameDate(inputDate, today, "day") ||
        date.isBefore(inputDate, today, "day")
      );
    },
    postEntries() {
      let entries = [this.entry];
      AccountingService.postEntries(entries)
        .then((status) => {
          if (status) {
            this.getEntries();
            this.showEditEntryModal = false;
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    validateChallan(val) {
      let req = {
        clientId: this.clientId,
        creditorId: this.creditorId,
        date: this.entry.date,
        receipt: val,
      };
      AccountingService.findEntryByDateAndChallan(req)
        .then((response) => {
          if (response.id !== null && response.id !== this.entry.id) {
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
    filterProject(input, update, abort) {
      update(() => {
        const value = input.toLowerCase();
        this.projectOptions = this.projects.filter((project) => {
          return project.label.toLowerCase().indexOf(value) > -1;
        });
      });
    },
    getProjects() {
      ProjectService.getProjectList(this.clientId)
        .then((response) => {
          this.projects.splice(0, this.projects.length);
          this.projectOptions.splice(0, this.projectOptions.length);
          this.projects = response.list;
          this.projectOptions = response.list;
        })
        .catch((err) => {});
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

    cancelUpdate() {
      this.showEditEntryModal = false;
      this.entry = null;
    },
    editEntry(row) {
      this.entry = JSON.parse(JSON.stringify(row));

      this.showEditEntryModal = true;
    },
    confirmAndDelete(id) {
      this.$q
        .dialog({
          title: "Are You Sure?",
          cardClasses: "q-pa-xs text-small",
          message: "",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          AccountingService.deleteEntry(
            this.clientId,
            this.creditorId,
            this.ledgerId,
            id
          )
            .then((response) => {
              if (response) {
                this.getEntries();
              }
            })
            .catch((err) => {});
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    getCreditor() {
      AccountingService.getCreditor(this.clientId, this.creditorId)
        .then((response) => {
          this.creditor = response;
        })
        .catch((err) => {});
    },
    prepAndGenerate() {
      let name = "Statement-" + this.creditor.name + ".pdf";
      let title = this.creditor.name;
      let address = this.creditor.address;
      let period = this.fromDate + " To: " + this.toDate;
      let pdfColumns = this.columns.filter((col) => col.name !== "action");
      this.generatePDF(name, title, address, period, pdfColumns);
    },
    generatePDF(name, title, address, period, columns) {
      console.log(JSON.stringify(columns));
      pdfMake.vfs = pdfFonts.vfs;

      // Convert rows to table body
      const body = [];

      // Add table headers
      body.push(
        columns.map((col) => ({ text: col.label, style: "tableHeader" }))
      );

      // Add table rows
      this.entries.forEach((row) => {
        body.push(
          columns.map((col) => ({
            text:
              row[col.name] === null || Number(row[col.name]) === 0.0
                ? ""
                : col.name === "quantity"
                ? row[col.name] + " " + row["unit"]
                : col.name === "total" && Number(row[col.name]) > 0
                ? Number(row[col.name]).toLocaleString("en-IN") + ".00" + " Cr"
                : col.name === "total" && Number(row[col.name]) < 0
                ? Number(row[col.name]).toLocaleString("en-IN") + ".00" + " Dr"
                : row[col.name],
            style: "table_body",
          }))
        );
      });
      body.push(columns.map((col) => ({ text: "" })));

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [20, 20, 20, 20], // left, top, right, bottom
        content: [
          { text: title, style: "title" },
          { text: "Address: " + address, style: "address" },
          {
            text: "Statement From: " + period,
            style: this.entryType === "ALL" ? "period" : "ob",
          },
          this.entryType === "ALL"
            ? {
                text:
                  "Opengin Balance: " +
                  this.openingBalance.toLocaleString("en-IN") +
                  ".00",
                style: "ob",
              }
            : null,
          {
            table: {
              headerRows: 1,

              widths: columns.map(() => "auto"), // Distribute widths evenly
              body: body,
            },
            layout: "lightHorizontalLines", // Optional: adds styling
            // layout: centeredLayout,
          },
          {
            text: "Verified By:______________________ Date: ______________",
            style: "verify",
          },
        ],
        styles: {
          title: {
            fontSize: 12,
            bold: true,
            margin: [0, 0, 0, 0],
            alignment: "left",
          },
          address: {
            fontSize: 10,
            bold: false,
            margin: [0, 0, 0, 5],
            alignment: "left",
          },
          period: {
            fontSize: 8,
            bold: true,
            margin: [0, 0, 0, 1],
            alignment: "left",
            lineHeight: 1.5,
          },
          ob: {
            fontSize: 8,
            bold: true,
            margin: [0, 0, 0, 15],
            alignment: "left",
            lineHeight: 1.5,
          },
          table: {
            alignment: "center",
          },
          tableHeader: {
            fontSize: 9,
            alignment: "left",
            bold: true,
          },
          table_body: {
            fontSize: 9,
            alignment: "left",
          },
          verify: {
            fontSize: 8,
            bold: true,
            margin: [0, 15, 0, 0],
            alignment: "left",
            lineHeight: 1.5,
          },
        },
      };

      // Generate and download the PDF
      pdfMake.createPdf(docDefinition).download(name);
    },

    getEntries() {
      this.getCreditor();
      let request = {
        clientId: this.clientId,
        creditorId: this.creditorId,
        ledgerId: this.ledgerId,
        entryType: this.entryType,
        from: this.fromDate,
        to: this.toDate,
      };
      AccountingService.getEntries(request)
        .then((response) => {
          if (this.entryType === "CREDIT") {
            this.columns = [];
            this.columns = this.creditColumns;
          } else if (this.entryType === "DEBIT") {
            this.columns = [];
            this.columns = this.debitColumns;
          } else if (this.entryType === "ALL") {
            this.columns = [];
            this.columns = this.allColumns;
          }
          this.entries = response;
          if (this.entries.length > 0 && this.entryType === "ALL") {
            this.openingBalance =
              this.entries[0].total +
              this.entries[0].debit -
              this.entries[0].credit;
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
