<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      :rows="accounts"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      :filter="filter"
      wrap-cells
      bordered
      dense
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
          color="secondary"
          label="New Account"
          size="10px"
          @click="openDialog('add', null)"
          :icon="icons.add"
        />
      </template>
      <template v-slot:top-right>
        <q-input
          class="q-ml-sm"
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Search accounts"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="accountName" :props="props">
            {{ props.row.accountName }}
          </q-td>
          <q-td key="accountType" :props="props">{{
            props.row.accountType
          }}</q-td>
          <q-td key="accountOpeningDate" :props="props">{{
            props.row.accountOpeningDate
          }}</q-td>
          <q-td key="balance" :props="props">{{
            props.row.balance.toLocaleString("en-IN")
          }}</q-td>
          <q-td key="lastUpdated" :props="props">{{
            props.row.lastUpdated
          }}</q-td>
          <q-td key="status" :props="props">{{ props.row.status }}</q-td>

          <q-td>
            <q-icon
              color="grey"
              class="q-ma-none q-pa-none pointer"
              :name="icons.edit"
              @click="editAccount(props.row)"
              size="10px"
            />
            <!-- <span
              class="q-ml-sm text-blue"
              style="cursor: pointer"
              @click="openStatement(props.row)"
              >view</span
            > -->
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div>
    <q-dialog
      v-model="open"
      persistent
      @hide="onHide"
      @before-show="beforeShow"
      ref="newCapitalAccountRef"
      position="right"
    >
      <q-card style="width: 300px; max-width: 80vw">
        <q-bar class="bg-secondary text-white text-weight-light text-subtitle2">
          {{ dialog_label }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-form @submit="create" @reset="reset" class="q-gutter-md">
            <div class="row">
              <q-input
                hide-bottom-space
                class="full-width"
                dense
                outlined
                v-model="account.accountName"
                label="Account Name"
                full-width
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']"
                maxlength="20"
                counter
                @update:model-value="
                  (val) => {
                    account.accountName = val.toUpperCase();
                  }
                "
              />
            </div>

            <div classs="row">
              <q-select
                :disable="mode === 'edit'"
                class="full-width"
                dense
                outlined
                hide-bottom-space
                label="Account Type"
                label-color="secondary"
                :options="['Bank Account', 'Cash']"
                v-model="account.accountType"
                option-disable="inactive"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']"
              />
            </div>

            <div class="row">
              <q-input
                :disable="mode === 'edit'"
                class="full-width"
                hide-bottom-space
                dense
                outlined
                v-model="account.accountOpeningDate"
                :rules="[
                  (val) => !!val || '',
                  (val) => /^\d{2}-\d{2}-\d{4}$/.test(val) || '',
                ]"
                label="Account Opening Date"
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
                        v-model="account.accountOpeningDate"
                        mask="DD-MM-YYYY"
                        minimal
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="row">
              <q-input
                :disable="
                  account.accountType === 'Bank Account' || mode === 'edit'
                "
                type="number"
                class="full-width"
                hide-bottom-space
                dense
                outlined
                v-model="account.balance"
                label="Openeing Balance"
                full-width
                lazy-rules
                :rules="[(val) => (val && val >= 0) || '']"
              />
            </div>
            <div class="row">
              <q-select
                class="full-width"
                dense
                outlined
                hide-bottom-space
                label="Status"
                label-color="secondary"
                :options="['ACTIVE', 'INACTIVE']"
                v-model="account.status"
                option-disable="inactive"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']"
              />
            </div>

            <div>
              <q-space />
              <q-btn
                dense
                size="sm"
                :label="submitButtonLabel"
                type="submit"
                color="secondary"
                class="text-capitalize q-px-lg"
              />

              <q-btn
                v-if="!(mode === 'edit')"
                dense
                size="sm"
                label="Reset"
                type="reset"
                class="text-capitalize q-ml-sm q-px-lg"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import AccountingService from "src/services/accounting/AccountingService";
import { commonMixin } from "../../../mixin/common";
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { ref } from "vue";
import { capitalAccountStore } from "src/pinia_stores/CapitalAccountStore";
export default {
  name: "Project",
  mixins: [commonMixin],
  setup() {
    return {
      selected: ref([]),

      columns: [
        {
          name: "accountName",
          align: "left",
          label: "Account Name",
          field: "accountName",
          sortable: true,
        },

        {
          name: "accountType",
          align: "left",
          label: "Account Type",
          field: "accountType",
          sortable: true,
        },
        {
          name: "accountOpeningDate",
          align: "left",
          label: "A/C Opening Date",
          field: "accountOpeningDate",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance",
          field: "balance",
          sortable: true,
        },

        {
          name: "lastUpdated",
          align: "left",
          label: "Last Transaction",
          field: "lastUpdated",
        },

        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
        },
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
      },
    };
  },
  components: {},
  created() {},
  mounted() {
    this.getAllAccounts(true);
  },
  beforeUnmount() {},
  data() {
    return {
      client_id: this.getClientId(),
      pagination: { rowsPerPage: 20 },
      grid: true,
      admin: this.isAdmin(),
      filter: "",
      loading: true,
      accounts: [],
      account: this.newAccount(),
      open: false,
      mode: "add",
      dialog_label: "New Account",
      submitButtonLabel: "Create",
    };
  },
  methods: {
    openStatement(row) {
      this.$router.push({
        name: "capAccountState",
        params: { account: row },
      });
    },
    newAccount() {
      return {
        id: null,
        clientId: this.client_id,
        accountName: null,
        accountType: null,
        balance: null,
        lastUpdated: null,
        accountOpeningDate: null,
      };
    },
    async getAllAccounts(refresh) {
      this.loading = true;
      await AccountingService.getAllCapitalAccounts(this.client_id)
        .then((response) => {
          this.accounts.splice(0, this.accounts.length);
          this.accounts = response;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });

      await capitalAccountStore().loadCapitalAccounts(this.client_id, refresh);
    },
    async create() {
      this.account.clientId = this.client_id;
      AccountingService.createCapitalAccount(this.account)
        .then((response) => {
          if (this.mode === "add") {
            this.success("Account create Successfully");
          } else if (this.mode === "edit") {
            this.success("Account Updated Successfully");
          }
          this.getAllAccounts(true);
          this.open = false;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    editAccount(row) {
      this.account = row;
      this.dialog_label = "Update Account";
      this.submitButtonLabel = "Update";
      this.open = true;
      this.mode = "edit";
    },
    beforeShow() {},
    openDialog(mode, row) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialog_label = "New Account";
        this.submitButtonLabel = "Create";
      }
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
