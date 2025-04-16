<template>
  <div>
    <PartyAccount />
    <!-- <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="Add" 
               size="sm"
               glossy  
               @click="openDialog('add')"
               :icon="icons.plus"/> -->
    <q-table
      class="my-sticky-header-table"
      title="Party Accounts"
      dense
      bordered
      flat
      :rows="accounts"
      :columns="columns"
      row-key="partyName"
      :loading="loading"
      :pagination="myPagination"
      :filter="filter"
      v-model:selected="selected"
      wrap-cells
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div>
            <q-icon
              class="pointer"
              color="primary"
              :name="icons.view"
              @click="openView(props.row)"
            />
            <q-icon
              class="q-ml-sm pointer"
              color="primary"
              :name="icons.edit"
              @click="editAccount(props.row)"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-btn
          dense
          flat
          class="q-mr-sm"
          v-if="accounts.length > 0"
          color="primary"
          icon-right="archive"
          no-caps
          @click="exportAsFile"
        >
          <q-tooltip>Export</q-tooltip>
        </q-btn>
        <q-input
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Search Account"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:top-left>
        <q-btn
          class="q-mt-sm q-mr-sm text-capitalize"
          outline
          color="primary"
          size="sm"
          label="Refresh"
          icon="refresh"
          glossy
          @click="getPartyAccounts()"
        />
      </template>
    </q-table>

    <q-dialog
      v-model="open"
      persistent
      @before-show="beforeShow"
      @hide="onHide"
      ref="newAccountRef"
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
          <q-form @submit="addPartyAccount" @reset="reset" class="q-gutter-md">
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="account.partyName"
                  label="Party Name"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Party name']"
                />
              </div>
              <div class="col q-ml-sm">
                <q-input
                  dense
                  outlined
                  v-model="account.accountHolder"
                  label="Account Holder"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Account holder name',
                  ]"
                />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="account.accountNumber"
                  label="Account Number"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Account number',
                  ]"
                />
              </div>
              <div class="col q-ml-sm">
                <q-input
                  dense
                  outlined
                  v-model="account.ifscCode"
                  label="IFSC Code"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'IFSC Code']"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="account.bankName"
                  label="Bank"
                  full-width
                />
              </div>
              <div class="col q-ml-sm">
                <q-input
                  dense
                  outlined
                  v-model="account.branchName"
                  label="Branch"
                  full-width
                />
              </div>
              <div class="col q-ml-sm">
                <q-input
                  dense
                  outlined
                  v-model="account.branchCode"
                  label="Branch Code"
                  full-width
                />
              </div>
            </div>
            <div>
              <q-space />
              <q-btn
                dense
                glossy
                size="sm"
                :label="mode === 'add' ? 'Add' : 'Update'"
                type="submit"
                color="primary"
                class="text-capitalize q-px-md text-weight-light text-subtitle2"
              />

              <q-btn
                v-if="mode === 'add'"
                dense
                glossy
                size="sm"
                label="Reset"
                type="reset"
                class="text-capitalize q-px-md q-mx-sm text-weight-light text-subtitle2"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="openViewDialog" persistent ref="viewRef">
      <q-card style="width: 700px; max-width: 80vw" class="q-ma-lg">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ "Account Details" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <span class="text-subtitle1 text-primary"
            ><u>{{ account.partyName }}</u></span
          >
          <q-input
            class="q-mt-lg"
            dense
            readonly
            v-model="account.accountHolder"
            label="Account Holder"
            full-width
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Account holder name']"
          />
          <div class="row">
            <div class="col">
              <q-input
                dense
                readonly
                v-model="account.accountNumber"
                label="Account Number"
                full-width
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Account number']"
              />
            </div>
            <div class="col q-ml-sm">
              <q-input
                dense
                readonly
                v-model="account.ifscCode"
                label="IFSC Code"
                full-width
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'IFSC Code']"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input
                dense
                readonly
                v-model="account.bankName"
                label="Bank"
                full-width
              />
            </div>
            <div class="col q-ml-sm">
              <q-input
                dense
                readonly
                v-model="account.branchName"
                label="Branch"
                full-width
              />
            </div>
            <div class="col q-ml-sm">
              <q-input
                dense
                readonly
                v-model="account.branchCode"
                label="Branch Code"
                full-width
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <ExportTable
      :header="'Export Party Accounts'"
      :open="openExport"
      :rows="columns"
      :content="accounts"
      :fileName="exportFileName"
      :fileType="fileType"
      @close="openExport = false"
    />
  </div>
</template>

<script>
import ExportTable from "src/components/ExportTable.vue";
import PartyAccountService from "../../../services/PartyAccountService";
import PartyAccount from "./PartyAccounts.vue";
import { commonMixin } from "../../../mixin/common";
import {
  fasPlus,
  fasEdit,
  fasTrash,
  fasEye,
} from "@quasar/extras/fontawesome-v5";
import { ref } from "vue";
export default {
  name: "PartyAccounts",
  mixins: [commonMixin],
  setup() {
    return {
      selected: ref([]),
      columns: [
        {
          name: "id",
          required: true,
          label: "ID",
          align: "left",
          field: (row) => row.id,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "partyName",
          required: true,
          label: "Account Nick Name",
          align: "left",
          field: (row) => row.partyName,
          format: (val) => `${val}`,
          sortable: true,
          headerClasses: "my-special-class",
        },
        {
          name: "accountHolder",
          align: "left",
          label: "Account Holder",
          field: "accountHolder",
          sortable: true,
        },
        {
          name: "accountNumber",
          align: "left",
          label: "Account Number",
          field: "accountNumber",
          sortable: true,
        },
        {
          name: "ifscCode",
          align: "left",
          label: "IFSC Code",
          field: "ifscCode",
          sortable: true,
        },
        {
          name: "bankName",
          align: "left",
          label: "Bank",
          field: "bankName",
          sortable: true,
        },
        {
          name: "branchName",
          align: "left",
          label: "Branch",
          field: "branchName",
          sortable: true,
        },
        {
          name: "actions",
          required: false,
          label: "Actions",
          field: "actions",
        },
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        delete: fasTrash,
        view: fasEye,
      },
    };
  },
  components: {
    PartyAccount,
    ExportTable,
  },
  created() {},
  mounted() {
    this.getPartyAccounts();
  },
  data() {
    return {
      clientId: this.getClientId(),
      myPagination: { rowsPerPage: 15 },
      filter: "",
      loading: true,
      accounts: [],
      account: this.newAccount(),
      open: false,
      mode: "add",
      dialogLabel: "New Account",
      openViewDialog: false,
      openExport: false,
      fileType: "text/csv",
      exportFileName: "party_accounts.csv",
    };
  },
  methods: {
    exportAsFile() {
      this.openExport = true;
    },
    newAccount() {
      return {
        clientId: this.clientId,
        partyName: "",
        accountHolder: "",
        bankName: "",
        branchName: "",
        branchCode: "",
        accountNumber: "",
        ifscCode: "",
        address: "",
        update: false,
      };
    },
    openView(account) {
      this.account = account;
      this.openViewDialog = true;
    },
    getPartyAccounts() {
      this.loading = true;
      PartyAccountService.getPartyAccounts(this.clientId)
        .then((response) => {
          this.accounts.splice(0, this.accounts.length);
          this.accounts = response;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    addPartyAccount() {
      this.account.clientId = this.clientId;
      PartyAccountService.addPartyAccount(this.account)
        .then((response) => {
          if (this.mode === "add") {
            this.accounts.unshift(response);
            this.success("Account Added Successfully");
          } else if (this.mode === "edit") {
            this.success("Account Updated Successfully");
          }
          this.$refs.newAccountRef.hide();
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    beforeShow() {},
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialogLabel = "New Account";
        console.log(JSON.stringify(this.account));
      } else if (this.mode === "edit") {
        this.account = this.selected[0];
        console.log(JSON.stringify(this.account));
        this.dialogLabel = "Update Account";
      }
      this.open = true;
    },
    editAccount(row) {
      console.log(JSON.stringify(row));
      this.account = row;
      console.log(JSON.stringify(this.account));
      this.dialogLabel = "Update Account";
      this.open = true;
    },
    onHide() {
      this.reset();
      this.mode = "add";
    },
    reset() {
      this.account = this.newAccount();
    },
  },
};
</script>

<style lang="css" scoped>
.my-special-class {
  max-width: 100%;
  color: black;
}
</style>
