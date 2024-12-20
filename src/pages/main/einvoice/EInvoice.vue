<template>
  <div class="row q-mt-sm q-mb-lg">
    <div class="col">
      <q-radio
        class="q-mr-md"
        dense
        v-model="viewMode"
        val="create"
        label="Create or Update"
      />
      <q-radio
        class="q-mr-md"
        dense
        v-model="viewMode"
        val="search_fy"
        label="Search by FY (Turn Over)"
      />
      <q-radio
        class="q-mr-md"
        dense
        v-model="viewMode"
        val="search_gst_fy"
        label="Search by GST & FY"
      />
      <q-radio
        class="q-mr-md"
        dense
        v-model="viewMode"
        val="search_fy_month"
        label="Search by FY and Month"
      />
    </div>
  </div>

  <div class="row q-mt-sm" v-if="viewMode === 'create'">
    <div class="col-3">
      <q-select
        :disable="showReset"
        label="Select GST"
        behavior="menu"
        dense
        outlined
        v-model="selectedGst"
        :options="gstList"
        option-label="displayName"
        option-value="id"
      >
      </q-select>
    </div>
    <div class="col-2 q-ml-sm">
      <q-select
        :disable="selectedGst === null || showReset"
        label="Select FY"
        behavior="menu"
        dense
        outlined
        v-model="selectedFY"
        :options="fyList"
        option-label="displayName"
        option-value="id"
      >
      </q-select>
    </div>
    <div class="col-2 q-ml-sm">
      <q-select
        :disable="selectedGst === null || selectedFY === null || showReset"
        label="Select Month"
        behavior="menu"
        dense
        outlined
        v-model="selectedMonth"
        :options="months"
        option-label="displayName"
        option-value="id"
      >
      </q-select>
    </div>
    <div class="col-2 q-ml-sm" v-if="!showReset">
      <q-btn
        :disable="
          selectedGst === null ||
          selectedFY === null ||
          selectedMonth === null ||
          showReset
        "
        class="text-capitalize text-weight-light"
        color="primary"
        label="Get E-invoice"
        @click="getEInvoice()"
      />
    </div>
    <div class="col-1 q-ml-sm" v-if="showReset">
      <q-btn
        class="text-capitalize text-weight-light"
        color="primary"
        label="Reset"
        @click="resetSelection()"
      />
    </div>
  </div>
  <div class="row q-mt-sm" v-if="viewMode === 'search_fy'">
    <div class="col-2 q-ml-sm">
      <q-select
        label="Select FY"
        behavior="menu"
        dense
        outlined
        v-model="selectedFY"
        :options="fyList"
        option-label="displayName"
        option-value="id"
      >
      </q-select>
    </div>
    <div class="col-2 q-ml-sm">
      <q-btn
        class="text-capitalize text-weight-light"
        color="primary"
        label="Get E-invoice"
        @click="getAllForFy()"
      />
    </div>
  </div>
  <div class="row q-mt-sm" v-if="viewMode === 'search_gst_fy'">
    <div class="col-3">
      <q-select
        label="Select GST"
        behavior="menu"
        dense
        outlined
        v-model="selectedGst"
        :options="gstList"
        option-label="displayName"
        option-value="id"
      >
      </q-select>
    </div>
    <div class="col-2 q-ml-sm">
      <q-select
        label="Select FY"
        behavior="menu"
        dense
        outlined
        v-model="selectedFY"
        :options="fyList"
        option-label="displayName"
        option-value="id"
      >
      </q-select>
    </div>

    <div class="col-2 q-ml-sm" v-if="!showReset">
      <q-btn
        class="text-capitalize text-weight-light"
        color="primary"
        label="Get E-invoice"
        @click="getAllForGstAndFy()"
      />
    </div>
  </div>
  <div class="row q-mt-sm" v-if="viewMode === 'search_fy_month'">
    <div class="col-2 q-ml-sm">
      <q-select
        label="Select FY"
        behavior="menu"
        dense
        outlined
        v-model="selectedFY"
        :options="fyList"
        option-label="displayName"
        option-value="id"
      >
      </q-select>
    </div>
    <div class="col-2 q-ml-sm">
      <q-select
        label="Select Month"
        behavior="menu"
        dense
        outlined
        v-model="selectedMonth"
        :options="months"
        option-label="displayName"
        option-value="id"
      >
      </q-select>
    </div>
    <div class="col-2 q-ml-sm" v-if="!showReset">
      <q-btn
        class="text-capitalize text-weight-light"
        color="primary"
        label="Get E-invoice"
        @click="getAllForFyAndMonth()"
      />
    </div>
  </div>
  <div class="q-mt-xs q-ml-sm bg-teal-1" v-if="totalGrossValue > 0">
    <div class="row">
      <div class="col text-bold">
        {{ viewMode === "search_fy" ? "Turn Over (Gross)" : "Gross Amount" }}
      </div>
      <div class="col text-bold">Cheque Amount</div>
      <div class="col text-bold">Taxable Amount</div>
      <div class="col text-bold">GST Applicable</div>
      <div class="col text-bold">GST Deducted at Source</div>
      <div class="col text-bold">Final GST Liability to Pay</div>
    </div>
    <div class="row">
      <div class="col">
        <q-icon :name="icons.rupee" />{{
          totalGrossValue.toLocaleString("en-IN")
        }}
      </div>
      <div class="col">
        <q-icon :name="icons.rupee" />{{
          totalChequeValue.toLocaleString("en-IN")
        }}
      </div>
      <div class="col">
        <q-icon :name="icons.rupee" />{{
          totalTaxableValue.toLocaleString("en-IN")
        }}
      </div>
      <div class="col">
        <q-icon :name="icons.rupee" />{{
          totalGstToPay.toLocaleString("en-IN")
        }}
      </div>
      <div class="col">
        <q-icon :name="icons.rupee" />
        {{ totalGstDeductedAtSource.toLocaleString("en-IN") }}
      </div>
      <div class="col text-red text-bold">
        <q-icon :name="icons.rupee" />{{
          totalGSTLiability.toLocaleString("en-IN")
        }}
      </div>
    </div>
  </div>
  <q-separator />
  <div>
    <q-table
      class="my-sticky-header-table"
      title="e-Invoice List"
      dense
      bordered
      flat
      :rows="einvoiceList"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      :loading="loading"
      :pagination="myPagination"
      :filter="einvoice_filter"
      wrap-cells
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
      <template v-slot:top-left>
        <q-btn
          v-if="showReset"
          class="q-mt-sm q-mr-sm text-capitalize"
          color="primary"
          label="Add"
          size="sm"
          glossy
          @click="openDialog('add', null)"
          :icon="icons.add"
        />
      </template>
      <template v-slot:top-right>
        <q-input
          class="q-mr-sm"
          borderless
          dense
          outlined
          debounce="300"
          v-model="einvoice_filter"
          placeholder="Search e-Invoice"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-select
          v-model="visibleColumns"
          multiple
          outlined
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 150px"
        />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              color="primary"
              outline
              round
              dense
              flat
              @click="props.expand = !props.expand"
              :icon="props.expand ? icons.collaps : icons.expand"
            >
            </q-btn>
          </q-td>

          <q-td key="bill_date" :props="props">{{ props.row.billDate }}</q-td>
          <q-td key="payment_date" :props="props">{{
            props.row.paymentDate
          }}</q-td>
          <q-td key="cheque_amount" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.chequeAmount.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="gross_amount" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.grossAmount.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="gst_rate" :props="props">{{
            props.row.gstRate + "%"
          }}</q-td>
          <q-td key="taxable_amount" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.taxableAmount.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="cgst" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.cgst.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="sgst" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.sgst.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="total_gst_to_pay" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.totalGstToPay.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="gst_deducted_at_source" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.gstDeductedAtSource.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td class="text-red" key="final_gst_to_pay" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.finalGstToPay.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="source_division_name" :props="props">{{
            props.row.sourceDivisionName
          }}</q-td>
          <q-td key="project_name" :props="props">{{
            props.row.projectName
          }}</q-td>
          <q-td key="description" :props="props">{{
            props.row.description
          }}</q-td>
          <q-td key="actions">
            <q-icon
              v-if="admin"
              class="q-ma-sm q-pa-none pointer"
              color="red"
              :name="icons.delete"
              @click="deleteEInvoice(props.row)"
            />
            <q-icon
              class="q-ma-none q-pa-none pointer"
              :name="icons.edit"
              @click="openDialog('edit', props.row)"
            />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="row" v-if="!props.row.invoiceAttached">
              <div class="col-2">Upload e-Invoice</div>
              <div class="col-3">
                <q-input
                  @update:model-value="
                    (val) => {
                      props.row.invoiceFile = val[0];
                    }
                  "
                  dense
                  type="file"
                />
              </div>
              <div class="col-2 q-ml-md">
                <q-btn
                  size="sm"
                  class="text-capitalize"
                  dense
                  :loading="props.row.uploadingInvoice"
                  color="primary"
                  text-color="white"
                  @click="uploadInvoice(props.row, 'EINVOICE')"
                  icon="cloud_upload"
                  label="upload"
                />
              </div>
            </div>
            <div class="row" v-else>
              <div class="col q-ml-lg">
                <span class="text-bold">{{ "e-Invoice: " }}</span>
                <span
                  class="text-blue"
                  style="cursor: pointer"
                  @click="downloadInvoice(props.row, 'EINVOICE')"
                  >{{ props.row.invoiceFileName }}</span
                >

                <q-btn
                  class="q-ml-sm"
                  dense
                  flat
                  size="sm"
                  color="primary"
                  @click="downloadInvoice(props.row, 'EINVOICE')"
                  icon="cloud_download"
                >
                  <q-tooltip delay="100">Download e-Invoice</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="row" v-if="!props.row.memoAttached">
              <div class="col-2">Upload Memo Bill</div>
              <div class="col-3">
                <q-input
                  @update:model-value="
                    (val) => {
                      props.row.invoiceMemo = val[0];
                    }
                  "
                  dense
                  type="file"
                />
              </div>
              <div class="col-2 q-ml-md">
                <q-btn
                  size="sm"
                  class="text-capitalize"
                  dense
                  :loading="props.row.uploadingMemo"
                  color="primary"
                  text-color="white"
                  @click="uploadInvoice(props.row, 'EINVOICE_MEMO')"
                  icon="cloud_upload"
                  label="upload"
                />
              </div>
            </div>
            <div class="row" v-else>
              <div class="col q-ml-lg">
                <span class="text-bold">{{ "Memo Bill: " }}</span>
                <span
                  class="text-blue"
                  style="cursor: pointer"
                  @click="downloadInvoice(props.row, 'EINVOICE_MEMO')"
                  >{{ props.row.memoFileName }}</span
                >

                <q-btn
                  class="q-ml-sm"
                  dense
                  flat
                  size="sm"
                  color="primary"
                  @click="downloadInvoice(props.row, 'EINVOICE_MEMO')"
                  icon="cloud_download"
                >
                  <q-tooltip delay="100">Download Payment Memo</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div v-if="einvoiceList.length === 0 && showReset" class="text-red q-mt-lg">
      No e-Invoice found for selected GST, FY, and Month
    </div>
    <q-dialog
      position="right"
      v-model="open"
      persistent
      @before-show="beforeShow"
      @hide="onHide"
      ref="neweInvocieRef"
      size="sm"
    >
      <q-card style="width: 250px; max-width: 40vw">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ "New eInvoice" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form
            @submit="createInvoice"
            @reset="resetInvocie"
            class="q-gutter-md"
          >
            <div class="row">
              <div class="col">
                <q-select
                  :disable="invoice.gstRate !== null"
                  dense
                  outlined
                  v-model="invoice.gstRate"
                  :options="gstRates"
                  label="GST Rate (%)"
                  lazy-rules
                  :rules="[(val) => (val && val > 0) || 'Enter GST Rate']"
                >
                </q-select>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  :disable="invoice.gstRate === null"
                  dense
                  outlined
                  v-model="invoice.billDate"
                  :rules="['DD-MM-YYYY']"
                  label="Bill Date"
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
                          v-model="invoice.billDate"
                          mask="DD-MM-YYYY"
                          minimal
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  :disable="invoice.gstRate === null"
                  dense
                  outlined
                  v-model="invoice.paymentDate"
                  :rules="['DD-MM-YYYY']"
                  label="Payment Date"
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
                          v-model="invoice.paymentDate"
                          mask="DD-MM-YYYY"
                          minimal
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  :disable="invoice.gstRate === null"
                  type="number"
                  dense
                  outlined
                  v-model="invoice.chequeAmount"
                  label="Cheque Amount"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val > 0) || 'Enter Cheque Amount']"
                >
                  <template v-slot:prepend>
                    <q-icon :name="icons.rupee" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  :disable="invoice.gstRate === null"
                  @keydown.tab.prevent="calculate($event.target.value)"
                  @keydown.enter.prevent="calculate($event.target.value)"
                  @blur="calculate($event.target.value)"
                  type="number"
                  dense
                  outlined
                  v-model="invoice.grossAmount"
                  label="Gross Amount"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val > 0) || 'Enter Gross Amount']"
                >
                  <template v-slot:prepend>
                    <q-icon :name="icons.rupee" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  :disable="true"
                  type="number"
                  dense
                  outlined
                  v-model="invoice.taxableAmount"
                  label="Taxable Amount"
                >
                  <template v-slot:prepend>
                    <q-icon :name="icons.rupee" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  :disable="true"
                  type="number"
                  dense
                  outlined
                  v-model="invoice.totalGstToPay"
                  label="Total GST to Pay"
                  full-width
                >
                  <template v-slot:prepend>
                    <q-icon :name="icons.rupee" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input
                  :disable="true"
                  type="number"
                  dense
                  outlined
                  v-model="invoice.gstDeductedAtSource"
                  label="GST Deducted at Source"
                  full-width
                >
                  <template v-slot:prepend>
                    <q-icon :name="icons.rupee" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  :disable="true"
                  type="number"
                  dense
                  outlined
                  v-model="invoice.finalGstToPay"
                  label="Final GST to Pay"
                  full-width
                >
                  <template v-slot:prepend>
                    <q-icon :name="icons.rupee" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="col">
                  <q-select
                    dense
                    outlined
                    v-model="invoice.sourceDivisionName"
                    :options="divisions"
                    label="Select Division"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please Division Name',
                    ]"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-select
                  dense
                  outlined
                  v-model="invoice.projectName"
                  :options="projects"
                  label="Select Project"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please Project Name',
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="invoice.description"
                  label="Remark"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Enter Remark']"
                />
              </div>
            </div>
            <div>
              <q-space />
              <q-btn
                dense
                glossy
                size="sm"
                :label="mode === 'add' ? 'Create' : 'Update'"
                type="submit"
                color="primary"
                class="text-capitalize q-px-md"
              />

              <q-btn
                v-if="mode === 'add'"
                dense
                glossy
                size="sm"
                label="Reset"
                type="reset"
                class="text-capitalize q-px-md q-mx-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- {{ JSON.stringify(invoice) }} -->
  </div>
</template>

<script>
import { ref } from "vue";

import EnumService from "../../../services/EnumerationService";
import GeneralService from "../../../services/GeneralService";
import EInvoiceServcie from "../../../services/EInvoiceServcie";
import FileUploadDownloadService from "../../../services/FileUploadDownloadService";
import { commonMixin } from "../../../mixin/common";
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import {
  matCurrencyRupee,
  matExpandCircleDown,
  matExpandLess,
  matDelete,
} from "@quasar/extras/material-icons";
export default {
  name: "eInvoice",
  mixins: [commonMixin],
  setup() {
    return {
      visibleColumns: ref([
        "payment_date",
        "cheque_amount",
        "gross_amount",
        "taxable_amount",
        "gst_rate",
        "total_gst_to_pay",
        "gst_deducted_at_source",
        "final_gst_to_pay",
        "source_division_name",
      ]),
      columns: [
        {
          name: "bill_date",
          align: "left",
          label: "Bill Date",
          field: "billDate",
          sortable: true,
        },
        {
          name: "payment_date",
          align: "left",
          label: "Payment Date",
          field: "paymentDate",
          sortable: true,
        },
        {
          name: "cheque_amount",
          align: "left",
          label: "Cheque",
          field: "chequeAmount",
          sortable: true,
        },
        {
          name: "gross_amount",
          align: "left",
          label: "Gorss",
          field: "grossAmount",
          sortable: true,
        },
        {
          name: "gst_rate",
          align: "left",
          label: "GST Rate",
          field: "gstRate",
          sortable: true,
        },
        {
          name: "taxable_amount",
          align: "left",
          label: "Taxable",
          field: "taxableAmount",
          sortable: true,
        },

        {
          name: "cgst",
          align: "left",
          label: "CGST",
          field: "cgst",
          sortable: true,
        },
        {
          name: "sgst",
          align: "left",
          label: "SGST",
          field: "sgst",
          sortable: true,
        },
        {
          name: "total_gst_to_pay",
          align: "left",
          label: "Total GST",
          field: "totalGstToPay",
          sortable: true,
        },
        {
          name: "gst_deducted_at_source",
          align: "left",
          label: "GST Deducted at Source",
          field: "gstDeductedAtSource",
          sortable: true,
        },
        {
          name: "final_gst_to_pay",
          align: "left",
          label: "Final GST to Pay",
          field: "finalGstToPay",
          sortable: true,
        },
        {
          name: "source_division_name",
          align: "left",
          label: "Source Division",
          field: "sourceDivisionName",
          sortable: true,
        },
        {
          name: "project_name",
          align: "left",
          label: "Work Name",
          field: "projectName",
          sortable: true,
        },
        {
          name: "description",
          align: "left",
          label: "Remark",
          field: "description",
          sortable: true,
        },
      ],
      icons: {
        rupee: matCurrencyRupee,
        add: fasPlus,
        edit: fasEdit,
        expand: matExpandCircleDown,
        collaps: matExpandLess,
        delete: matDelete,
      },
    };
  },
  watch: {
    viewMode(val) {
      this.resetSelection();
      this.resetValues();
    },
  },
  created() {},
  mounted() {},
  components: {},
  data() {
    return {
      clientId: this.getClientId(),
      admin: this.isAdmin(),
      myPagination: { rowsPerPage: 10 },
      einvoiceList: [],
      einvoice_filter: "",
      loading: false,
      fyList: this.getFYList(),
      selectedFY: null,
      months: this.getMonths(),
      selectedMonth: null,
      gstList: this.getGSTList(),
      selectedGst: null,
      mode: "add",
      showReset: false,
      open: false,
      invoice: {},
      gstRates: [12, 18],
      projects: this.getProjects(),
      divisions: this.getDivisions(),
      viewMode: "create",
      totalGrossValue: 0,
      totalChequeValue: 0,
      totalTaxableValue: 0,
      totalGstToPay: 0,
      totalGstDeductedAtSource: 0,
      totalGSTLiability: 0,
    };
  },
  methods: {
    updateValue(invoices) {
      this.resetValues();
      invoices.forEach((invoice) => {
        this.totalGrossValue = this.totalGrossValue + invoice.grossAmount;
        this.totalChequeValue = this.totalChequeValue + invoice.chequeAmount;
        this.totalTaxableValue = this.totalTaxableValue + invoice.taxableAmount;
        this.totalGstToPay = this.totalGstToPay + invoice.totalGstToPay;
        this.totalGstDeductedAtSource =
          this.totalGstDeductedAtSource + invoice.gstDeductedAtSource;
        this.totalGSTLiability = this.totalGSTLiability + invoice.finalGstToPay;
      });
    },
    uploadInvoice(invoice, fileType) {
      // invoice.uploadingMemo = false;
      // invoice.uploadingInvoice = false;
      var file = null;
      if (fileType === "EINVOICE") {
        invoice.uploadingInvoice = true;
        file = invoice.invoiceFile;
      }
      if (fileType === "EINVOICE_MEMO") {
        invoice.uploadingMemo = true;
        file = invoice.invoiceMemo;
      }
      FileUploadDownloadService.uploadFile(
        file,
        this.clientId,
        fileType,
        invoice.id
      )
        .then((response) => {
          console.log(response);
          if (fileType === "EINVOICE") {
            invoice.uploadingInvoice = false;
          }
          if (fileType === "EINVOICE_MEMO") {
            invoice.uploadingMemo = false;
          }
          this.getAll();
        })
        .catch((err) => {
          this.fail(err.message);
          if (fileType === "EINVOICE") {
            invoice.uploadingInvoice = false;
          }
          if (fileType === "EINVOICE_MEMO") {
            invoice.uploadingMemo = false;
          }
        });
    },
    downloadInvoice(invoice, fileType) {
      let fileName =
        fileType === "EINVOICE_MEMO"
          ? invoice.memoFileName
          : invoice.invoiceFileName;
      FileUploadDownloadService.downloadFile(
        this.clientId,
        fileType,
        invoice.id,
        fileName
      )
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          this.fail(err.message);
        });
    },
    newInvoice() {
      return {
        clientId: this.clientId,
        id: null,
        gstState: this.selectedGst,
        fy: this.selectedFY,
        month: this.selectedMonth,
        billDate: null,
        paymentDate: null,
        chequeAmount: null,
        grossAmount: null,
        taxableAmount: null,
        gstRate: null,
        cgst: null,
        sgst: null,
        totalGstToPay: null,
        gstDeductedAtSource: null,
        finalGstToPay: null,
        sourceDivisionName: "",
        projectName: "",
        description: "",
      };
    },
    onHide() {
      this.resetInvocie();
    },
    resetInvocie() {
      this.invoice = this.newInvoice();
    },
    resetValues() {
      this.totalGrossValue = 0;
      this.totalChequeValue = 0;
      this.totalTaxableValue = 0;
      this.totalGstToPay = 0;
      this.totalGstDeductedAtSource = 0;
      this.totalGSTLiability = 0;
    },
    createInvoice() {
      EInvoiceServcie.createOrUpdate(this.invoice)
        .then((response) => {
          if (this.mode === "add") {
            this.success("e-Invoice Created Successfully");
          } else if (this.mode === "edit") {
            this.success("e-Invoice Updated Successfully");
          }
          this.getAll();
          this.open = false;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAll() {
      EInvoiceServcie.getAllForMonths(
        this.clientId,
        this.selectedGst,
        this.selectedFY,
        this.selectedMonth
      )
        .then((response) => {
          this.einvoiceList = [];
          this.einvoiceList = response;
          this.updateValue(this.einvoiceList);
          // console.log("All: " + JSON.stringify(this.einvoiceList));
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllForFy() {
      EInvoiceServcie.getAllForFy(this.clientId, this.selectedFY)
        .then((response) => {
          this.einvoiceList = [];
          this.einvoiceList = response;
          this.updateValue(this.einvoiceList);
          // console.log("All: " + JSON.stringify(this.einvoiceList));
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllForGstAndFy() {
      EInvoiceServcie.getAllForGstAndFy(
        this.clientId,
        this.selectedGst,
        this.selectedFY
      )
        .then((response) => {
          this.einvoiceList = [];
          this.einvoiceList = response;
          this.updateValue(this.einvoiceList);
          // console.log("All: " + JSON.stringify(this.einvoiceList));
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllForFyAndMonth() {
      EInvoiceServcie.getAllForFyAndMonth(
        this.clientId,
        this.selectedFY,
        this.selectedMonth
      )
        .then((response) => {
          this.einvoiceList = [];
          this.einvoiceList = response;
          this.updateValue(this.einvoiceList);
          // console.log("All: " + JSON.stringify(this.einvoiceList));
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    deleteEInvoice(row) {
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "This will delete the e-Invoice permanently.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          EInvoiceServcie.deleteEInvoice(this.clientId, row.id)
            .then((response) => {
              if (response === 0) {
                this.getAll();
                this.success("e-Invoice has been deleted");
              }
            })
            .catch((err) => {
              this.loading = false;
              this.fail(this.getErrorMessage(err));
            });
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    calculate(value) {
      var grossValue = Number(value);
      var taxable = 0;
      var gst = 0;
      if (this.invoice.gstRate === 18) {
        taxable = Number(grossValue / 1.18).toFixed(2);
        gst = Number(taxable * 0.18).toFixed(2);
      } else if (this.invoice.gstRate === 12) {
        taxable = Number(grossValue / 1.12).toFixed(2);
        gst = Number(taxable * 0.12).toFixed(2);
      }
      this.invoice.taxableAmount = taxable;
      this.invoice.cgst = Number(gst / 2).toFixed(2);
      this.invoice.sgst = Number(gst / 2).toFixed(2);
      this.invoice.totalGstToPay = gst;
      this.invoice.gstDeductedAtSource = Number(grossValue * 0.02).toFixed(2);
      this.invoice.finalGstToPay = Number(
        this.invoice.totalGstToPay - this.invoice.gstDeductedAtSource
      ).toFixed(2);
    },
    openDialog(mode, invoice) {
      this.mode = mode;
      if (mode === "add") {
        this.dialogLabel = "New e-Invocie";
        this.invoice = this.newInvoice();
      } else if (mode === "edit") {
        this.dialogLabel = "Update e-Invocie";
        this.invoice = invoice;
      }
      this.open = true;
    },
    getDivisions() {
      GeneralService.entry("DIVISIONS")
        .then((response) => {
          this.divisions = [];
          this.divisions = response;
        })
        .catch((err) => {});
    },
    getProjects() {
      GeneralService.entry("PROJECTS")
        .then((response) => {
          this.projects = [];
          this.projects = response;
        })
        .catch((err) => {});
    },
    getGSTList() {
      GeneralService.entry("GST")
        .then((response) => {
          this.gstList = [];
          this.gstList = response;
        })
        .catch((err) => {});
    },
    getFYList() {
      GeneralService.entry("EINVOICE_YEARS")
        .then((response) => {
          this.fyList = [];
          this.fyList = response;
        })
        .catch((err) => {});
    },
    getMonths() {
      EnumService.getOptions("EFyMonths")
        .then((response) => {
          this.months = [];
          this.months = response;
        })
        .catch((err) => {});
    },
    getEInvoice() {
      this.getAll();
      this.showReset = true;
    },
    resetSelection() {
      this.showReset = false;
      (this.selectedGst = null),
        (this.selectedFY = null),
        (this.selectedMonth = null);
      this.einvoiceList = [];
    },
  },
};
</script>

<style>
.jmsc-table-header {
  border-bottom: 0.2px solid rgb(0, 0, 0);
}
.jmsc-table {
  border-bottom: 0.2px solid rgb(0, 0, 0);
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
}
</style>
