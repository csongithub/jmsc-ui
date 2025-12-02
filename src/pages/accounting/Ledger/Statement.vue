<template>
  <q-layout>
    {{ subtitle }}
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
      </q-table>
    </div>
  </q-layout>
</template>

<script>
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import { fasFilePdf } from "@quasar/extras/fontawesome-v5";
import { date } from "quasar";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
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
  mounted() {},
  beforeUnmount() {},
  components: {},
  watch: {
    creditorId(val) {},
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
      ],
      allColumns: [
        { name: "date", align: "left", label: "Date", field: "date" },
        {
          name: "item",
          align: "left",
          label: "Description",
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
          name: "narration",
          align: "left",
          label: "Receipt-Vehicle",
          field: "narration",
        },
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
    };
  },
  methods: {
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
      this.generatePDF(name, title, address, period);
    },
    generatePDF(name, title, address, period) {
      pdfMake.vfs = pdfFonts.vfs;

      // Convert rows to table body
      const body = [];

      // Add table headers
      body.push(
        this.columns.map((col) => ({ text: col.label, style: "tableHeader" }))
      );

      // Add table rows
      this.entries.forEach((row) => {
        body.push(
          this.columns.map((col) => ({
            text:
              row[col.name] !== null && row[col.name] !== 0
                ? col.name !== "quantity"
                  ? row[col.name]
                  : row[col.name] + " " + row["unit"]
                : "",
            style: "table_body",
          }))
        );
      });
      body.push(this.columns.map((col) => ({ text: "" })));

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [20, 20, 20, 20], // left, top, right, bottom
        content: [
          { text: title, style: "title" },
          { text: "Address: " + address, style: "address" },
          { text: "Statement From: " + period, style: "period" },
          {
            table: {
              headerRows: 1,

              widths: this.columns.map(() => "auto"), // Distribute widths evenly
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

    //   const tableElement = this.$refs.myTable.$el; // Get the QTable's root element
    //   const canvas = await html2canvas(tableElement);
    //   const imgData = canvas.toDataURL("image/png");

    //   const pdf = new jsPDF("p", "mm", "a4");
    //   const imgWidth = 210; // A4 width in mm
    //   const pageHeight = 297; // A4 height in mm
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight;

    //   let position = 0;

    //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;

    //   while (heightLeft >= 0) {
    //     position = heightLeft - imgHeight;
    //     pdf.addPage();
    //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //   }

    //   pdf.save("quasar_table.pdf");
    // },
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
