<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      title="Bank Guarantee"
      dense
      bordered
      flat
      :rows="bankGuarantees"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      :loading="loading"
      :pagination="myPagination"
      :filter="bg_filter"
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
          class="q-mt-sm q-mr-sm text-capitalize"
          color="primary"
          label="Add"
          size="sm"
          glossy
          @click="openDialog('add', null)"
          :icon="icons.add"
        />
        <q-btn
          class="q-mt-sm q-mr-sm text-capitalize"
          outline
          color="primary"
          icon="refresh"
          label="Refresh"
          size="sm"
          glossy
          @click="getAll()"
        />
      </template>
      <template v-slot:top-right>
        <q-input
          class="q-mr-sm"
          borderless
          dense
          outlined
          debounce="300"
          v-model="bg_filter"
          placeholder="Search Bank Guarantee"
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
          <q-td key="creation_type" :props="props">{{
            props.row.creationType
          }}</q-td>
          <q-td key="type" :props="props">{{ props.row.type }}</q-td>
          <q-td key="bg_number" :props="props">{{ props.row.bgNumber }}</q-td>
          <q-td key="bg_amount" :props="props"
            ><q-icon :name="icons.rupee" />
            {{ props.row.bgAmount.toLocaleString("en-IN") + ".00" }}</q-td
          >
          <q-td key="valid_from" :props="props">{{ props.row.validFrom }}</q-td>
          <q-td key="valid_to" :props="props"> {{ props.row.validTo }}</q-td>
          <q-td key="in_favour_of" :props="props">{{
            props.row.inFavourOf
          }}</q-td>
          <q-td key="work_name" :props="props">{{ props.row.workName }}</q-td>
          <q-td key="bank" :props="props">{{ props.row.bank }}</q-td>
          <q-td key="security" :props="props">{{ props.row.security }}</q-td>
          <q-td key="charge" :props="props">{{ props.row.charge }}</q-td>
          <q-td key="charged_on" :props="props">{{ props.row.chargedOn }}</q-td>
          <q-td key="charged_from_account" :props="props">{{
            props.row.chargedFromAccount
          }}</q-td>
          <q-td
            key="status"
            :style="
              props.row.status === 'ACTIVE' ? 'color: green' : 'color:red'
            "
            :props="props"
            >{{ props.row.status }}</q-td
          >
          <q-td key="actions" v-if="admin">
            <q-icon
              class="q-ma-sm q-pa-none pointer"
              :name="icons.edit"
              @click="openDialog('edit', props.row)"
            />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="row" v-if="!props.row.fileAttached">
              <div class="col-3">
                <q-input
                  @update:model-value="
                    (val) => {
                      props.row.file = val[0];
                    }
                  "
                  dense
                  type="file"
                />
              </div>
              <div class="col-2 q-ml-md" v-if="props.row.file !== null">
                <q-btn
                  class="text-capitalize"
                  dense
                  :loading="props.row.uploadingFile"
                  color="primary"
                  text-color="white"
                  @click="uploadBankGuarantee(props.row)"
                  icon="cloud_upload"
                  label="upload"
                />
              </div>
            </div>
            <div class="row" v-else>
              <div class="col q-ml-lg">
                <span class="text-bold">{{ "File: " }}</span>
                <span
                  class="text-blue"
                  style="cursor: pointer"
                  @click="downloadFile(props.row)"
                  >{{ props.row.fileName }}</span
                >

                <q-btn
                  class="q-ml-sm"
                  dense
                  flat
                  size="sm"
                  color="primary"
                  @click="downloadFile(props.row)"
                  icon="cloud_download"
                >
                  <q-tooltip delay="100">Download this file</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog
      v-model="open"
      persistent
      @before-show="beforeShow"
      @hide="onHide"
      ref="newBgRef"
      size="md"
    >
      <q-card style="width: 700px; max-width: 80vw">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ dialogLabel }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-form
            @submit="saveBankGuarantee"
            @reset="reset"
            class="q-gutter-md"
          >
            <div class="row">
              <div class="col q-mr-sm">
                <q-select
                  dense
                  outlined
                  v-model="bg.creationType"
                  :options="creationTypeOptions"
                  label="Create"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Please select category',
                  ]"
                />
              </div>
              <div class="col q-mr-sm">
                <q-select
                  dense
                  outlined
                  v-model="bg.type"
                  :options="typeOptions"
                  label="Select BG Type"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please select type',
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col q-mr-sm">
                <q-input
                  dense
                  outlined
                  v-model="bg.bgNumber"
                  label="BG Number"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Enter BG Number',
                  ]"
                />
              </div>
              <div class="col q-mr-sm">
                <q-input
                  type="number"
                  dense
                  outlined
                  v-model="bg.bgAmount"
                  label="BG Amount"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val > 0) || 'Enter BG Amount']"
                >
                  <template v-slot:prepend>
                    <q-icon :name="icons.rupee" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col q-mr-sm">
                <q-input
                  dense
                  outlined
                  v-model="bg.validFrom"
                  :rules="['DD-MM-YYYY']"
                  label="Valid From"
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
                          v-model="bg.validFrom"
                          mask="DD-MM-YYYY"
                          minimal
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="bg.validTo"
                  :rules="['DD-MM-YYYY']"
                  label="Valid To"
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
                          v-model="bg.validTo"
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
              <div class="col q-mr-sm">
                <q-input
                  dense
                  outlined
                  v-model="bg.inFavourOf"
                  label="In Favour of"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Enter In Favour of',
                  ]"
                />
              </div>
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="bg.workName"
                  label="Work Name"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Enter work name',
                  ]"
                />
              </div>
            </div>

            <div class="row">
              <div class="col q-mr-sm">
                <q-select
                  dense
                  outlined
                  v-model="bg.bank"
                  :options="banks"
                  label="Select Bank"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please select bank',
                  ]"
                />
              </div>
              <div class="col">
                <q-select
                  dense
                  outlined
                  v-model="bg.security"
                  :options="securityOptions"
                  label="Select Collateral Source"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Please select collateral source',
                  ]"
                />
              </div>
            </div>

            <q-separator />
            <div class="row q-mt-sm q-mb-sm">
              <span class="text-bold">Commission Debit Details</span>
            </div>
            <div class="row">
              <div class="col q-mr-sm">
                <q-input
                  type="number"
                  dense
                  outlined
                  v-model="bg.charge"
                  label="Amount"
                  full-width
                >
                  <template v-slot:prepend>
                    <q-icon :name="icons.rupee" />
                  </template>
                </q-input>
              </div>
              <div class="col q-mr-sm">
                <q-input
                  dense
                  outlined
                  v-model="bg.chargedOn"
                  :rules="['DD-MM-YYYY']"
                  label="Date"
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
                          v-model="bg.chargedOn"
                          mask="DD-MM-YYYY"
                          minimal
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="bg.chargedFromAccount"
                  label="Account"
                  full-width
                  lazy-rules
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
  </div>
</template>

<script>
import { ref } from "vue";

import EnumService from "../../../services/EnumerationService";
import GeneralService from "../../../services/GeneralService";
import BankGuaranteeService from "../../../services/BankGuaranteeService";
import FileUploadDownloadService from "../../../services/FileUploadDownloadService";
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import {
  matCurrencyRupee,
  matExpandCircleDown,
  matExpandLess,
} from "@quasar/extras/material-icons";
import { commonMixin } from "../../../mixin/common";

export default {
  name: "BankGuarantee",
  mixins: [commonMixin],
  setup() {
    return {
      file: ref(null),
      visibleColumns: ref([
        "creation_type",
        "type",
        "bg_number",
        "bg_amount",
        "valid_from",
        "valid_to",
        "in_favour_of",
        "work_name",
        "bank",
        "security",
        "status",
      ]),
      columns: [
        {
          name: "creation_type",
          required: true,
          label: "Root",
          align: "left",
          field: "creationType",
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "type",
          required: true,
          label: "Type",
          align: "left",
          field: "type",
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "bg_number",
          required: true,
          label: "BG Number",
          align: "left",
          field: (row) => row.bgNumber,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "bg_amount",
          align: "left",
          label: "Amount",
          field: "bgAmount",
          sortable: true,
        },
        {
          name: "valid_from",
          align: "left",
          label: "From Date",
          field: "validFrom",
          sortable: true,
        },
        {
          name: "valid_to",
          align: "left",
          label: "To Date",
          field: "validTo",
          sortable: true,
        },
        {
          name: "in_favour_of",
          align: "left",
          label: "InFaourOf",
          field: "inFavourOf",
          sortable: true,
        },
        {
          name: "work_name",
          align: "left",
          label: "Work Name",
          field: "workName",
          sortable: true,
        },
        {
          name: "bank",
          align: "left",
          label: "Bank",
          field: "bank",
          sortable: true,
        },
        {
          name: "security",
          align: "left",
          label: "Security",
          field: "security",
          sortable: true,
        },
        {
          name: "charge",
          align: "left",
          label: "Commission",
          field: "charge",
          sortable: true,
        },
        {
          name: "charged_on",
          align: "left",
          label: "Commission Date",
          field: "chargedOn",
          sortable: true,
        },
        {
          name: "charged_from_account",
          align: "left",
          label: "Commission Account",
          field: "chargedFromAccount",
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
          sortable: true,
        },
      ],
      icons: {
        rupee: matCurrencyRupee,
        add: fasPlus,
        edit: fasEdit,
        expand: matExpandCircleDown,
        collaps: matExpandLess,
      },
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getAllEnums();
    this.getBanks();
    this.getAll();
  },
  components: {},
  data() {
    return {
      clientId: this.getClientId(),
      admin: this.isAdmin(),
      myPagination: { rowsPerPage: 10 },
      bg_filter: "",
      loading: false,
      uploadingFile: false,
      bankGuarantees: [],
      bg: this.newGuarantee(),
      open: false,
      mode: "add",
      dialogLabel: "New Guarantee",
      creationTypeOptions: [],
      typeOptions: [],
      statusOptions: [],
      securityOptions: [],
      banks: [],
    };
  },
  methods: {
    uploadBankGuarantee(bg) {
      bg.uploadingFile = true;
      FileUploadDownloadService.uploadFile(
        bg.file,
        this.clientId,
        "BANK_GUARANTEE",
        bg.id
      )
        .then((response) => {
          console.log(response);
          bg.uploadingFile = false;
        })
        .catch((err) => {
          this.fail(err.message);
        });
    },
    downloadFile(bg) {
      FileUploadDownloadService.downloadFile(
        this.clientId,
        "BANK_GUARANTEE",
        bg.id,
        bg.fileName
      )
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          this.fail(err.message);
        });
    },
    newGuarantee() {
      return {
        clientId: this.clientId,
        id: null,
        creationType: null,
        type: null,
        bgNumber: "",
        bgAmount: null,
        validFrom: null,
        validTo: null,
        inFavourOf: "",
        workName: "",
        bank: "",
        security: null,
        status: null,
        charge: null,
        chargedOn: null,
        chargedFromAccount: "",
        fileAttached: false,
        status: "ACTIVE",
        file: null,
        fileName: null,
        contentType: null,
      };
    },
    getAll() {
      this.loading = true;
      BankGuaranteeService.getAll(this.clientId)
        .then((response) => {
          this.bankGuarantees.splice(0, this.bankGuarantees.length);
          this.bankGuarantees = response;

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    saveBankGuarantee() {
      this.bg.clientId = this.clientId;
      BankGuaranteeService.creatGuarantee(this.bg)
        .then((response) => {
          if (this.mode === "add") {
            this.bankGuarantees.unshift(response);
            this.success("BG Created Successfully");
          } else if (this.mode === "edit") {
            this.success("BG Updated Successfully");
          }
          this.getAll();
          this.onHide();
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },

    beforeShow() {},
    openDialog(mode, bg) {
      this.mode = mode;
      if (mode === "add") {
        this.dialogLabel = "New Guarantee";
      } else if (mode === "edit") {
        this.dialogLabel = "Update Guarantee";
        this.bg = bg;
      }
      this.open = true;
    },
    onHide() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.bg = this.newGuarantee();
    },
    getAllEnums() {
      EnumService.getOptions("EBankGuaranteeCreationType")
        .then((response) => {
          this.creationTypeOptions = [];
          this.creationTypeOptions = response;
        })
        .catch((err) => {});
      EnumService.getOptions("EBankGuaranteeType")
        .then((response) => {
          this.typeOptions = [];
          this.typeOptions = response;
        })
        .catch((err) => {});
      EnumService.getOptions("EBankGuaranteeStatus")
        .then((response) => {
          this.statusOptions = [];
          this.statusOptions = response;
        })
        .catch((err) => {});
      EnumService.getOptions("EBankGuaranteeSecurityType")
        .then((response) => {
          this.securityOptions = [];
          this.securityOptions = response;
        })
        .catch((err) => {});
    },
    getBanks() {
      GeneralService.entry("Bank")
        .then((response) => {
          this.banks = [];
          this.banks = response;
        })
        .catch((err) => {
          this.loading = false;
        });
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
</style>
