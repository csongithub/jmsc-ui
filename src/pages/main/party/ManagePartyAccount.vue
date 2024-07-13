<template>
  <div v-if="party_id !== null" class="q-gutter-sm">
    <div class="q-mb-sm">
      <q-radio
        :disable="disable"
        v-model="selected_tab"
        val="exists"
        label="Existing"
      />
      <q-radio
        :disable="disable"
        v-model="selected_tab"
        val="new"
        label="New Account"
      />
    </div>
    <q-separator />
    <div v-if="selected_tab === 'exists'">
      <div class="row q-mt-sm">
        <div class="col-4">Enter Account ID & Press TAB or ENTER</div>
        <div class="col-2"></div>
      </div>
      <div class="row q-mb-sm">
        <q-input
          :disable="disable"
          type="number"
          @keydown.tab.prevent="fetchAccount($event.target.value)"
          @keydown.enter.prevent="fetchAccount($event.target.value)"
          @blur="fetchAccount($event.target.value)"
          dense
          outlined
          v-model="fetch_account_id"
          placeholder="Fetch & Add Account"
        />
      </div>
      <div v-if="fetched_account !== null" class="row bg-primary text-white">
        <div class="col">Account Name</div>
        <div class="col">Account Holder</div>
        <div class="col">Account Number</div>
        <div class="col">IFSC</div>
        <div class="col">Bank</div>
        <div class="col">branch</div>
        <div class="col-1"></div>
      </div>
      <div v-if="fetched_account !== null" class="row q-mt-xs">
        <div class="col">
          {{ fetched_account.partyName }}
        </div>
        <div class="col">
          {{ fetched_account.accountHolder }}
        </div>
        <div class="col">
          {{ fetched_account.accountNumber }}
        </div>
        <div class="col">
          {{ fetched_account.ifscCode }}
        </div>
        <div class="col">
          {{ fetched_account.bankName }}
        </div>
        <div class="col">
          {{ fetched_account.branchName }}
        </div>
        <div class="col-1">
          <q-btn
            size="sm"
            label="add"
            color="primary"
            @click="linkAccount(fetched_account.id)"
          ></q-btn>
        </div>
      </div>
      <q-table
        class="my-sticky-header-table q-mt-lg"
        title="Linked Accounts"
        dense
        bordered
        flat
        row-key="accountNumber"
        :rows="party_accounts"
        :columns="account_columns"
        :filter="search_account"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            outlined
            debounce="300"
            v-model="search_account"
            placeholder="Search Account"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="accountHolder" :props="props">{{
              props.row.accountHolder
            }}</q-td>
            <q-td key="accountNumber" :props="props">{{
              props.row.accountNumber
            }}</q-td>
            <q-td key="ifscCode" :props="props">{{ props.row.ifscCode }}</q-td>
            <q-td key="bankName" :props="props">{{ props.row.bankName }}</q-td>
            <q-td key="branchName" :props="props">{{
              props.row.branchName
            }}</q-td>
            <q-td key="status" :props="props">
              <q-toggle
                :disable="disableAccountStatus"
                size="xs"
                @click="handleStatus(props.row)"
                v-model="props.row.status"
                true-value="ACTIVE"
                false-value="INACTIVE"
                checked-icon="check"
                color="green"
                unchecked-icon="clear"
              />
            </q-td>
            <q-td key="actions">
              <q-icon
                v-if="!disable"
                class="q-ma-sm q-pa-none pointer"
                color="red"
                :name="icons.delete"
                @click="deLink(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="text-red" v-if="disable">
        You don't have permissions to update the party bank accounts
      </div>
    </div>
    <div v-else-if="selected_tab === 'new'">
      <q-form
        @submit="addPartyAccount"
        @reset="reset"
        class="q-gutter-md q-mt-sm"
      >
        <div class="row">
          <div class="col-3 q-mr-sm">
            <q-input
              dense
              outlined
              v-model="account.partyName"
              label="Account Nick Name"
              full-width
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'i.e. Chandan HDFC']"
            />
          </div>
        </div>
        <div class="row">
          <div class="col q-mr-sm">
            <q-input
              dense
              outlined
              v-model="account.accountHolder"
              label="Account Holder"
              full-width
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'i.e. Chandan Kumar Singh',
              ]"
            />
          </div>
          <div class="col q-mr-sm">
            <q-input
              dense
              outlined
              v-model="account.accountNumber"
              label="Account Number"
              full-width
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Bank Account number',
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
              :rules="[(val) => (val && val.length > 0) || 'Bank IFSC Code']"
              @blur="getBankDetails()"
            />
          </div>
        </div>

        <div class="row"></div>
        <div class="row">
          <div class="col">
            <q-input
              dense
              outlined
              v-model="account.bankName"
              label="Bank"
              full-width
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Name of The Bank']"
              :disable="disableBankName"
            />
          </div>
          <div class="col q-ml-sm">
            <q-input
              dense
              outlined
              v-model="account.branchName"
              label="Branch"
              full-width
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Bank Branch Name']"
              :disable="disableBranchName"
            />
          </div>
          <div class="col q-ml-sm">
            <q-input
              dense
              outlined
              v-model="account.branchCode"
              label="Branch Code"
              full-width
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Bank Branch Code']"
              :disable="disableBranchcode"
            />
          </div>
        </div>
        <div>
          <q-space />
          <q-btn
            dense
            glossy
            size="sm"
            label="Add"
            type="submit"
            color="primary"
            class="text-capitalize q-px-md text-weight-light text-subtitle2"
          />
          <q-btn
            dense
            glossy
            size="sm"
            label="Reset"
            type="reset"
            class="text-capitalize q-px-md q-mx-sm text-weight-light text-subtitle2"
          />
        </div>
      </q-form>
    </div>
  </div>
  <div v-else class="q-gutter-sm">
    <p class="text-center">Please add party</p>
  </div>
</template>

<script>
import PartyService from "../../../services/PartyService";
import PartyAccountService from "../../../services/PartyAccountService";
import { commonMixin } from "../../../mixin/common";
import { ref } from "vue";
import { matDelete } from "@quasar/extras/material-icons";
export default {
  name: "Site",
  mixins: [commonMixin],
  props: {
    party_id: {
      type: Number,
      required: true,
      default: null,
    },
  },
  setup() {
    return {
      selected_tab: ref("exists"),
      account_columns: [
        // {
        //   name: "partyName",
        //   required: true,
        //   label: "Account Nick Name",
        //   align: "left",
        //   field: (row) => row.partyName,
        //   format: (val) => `${val}`,
        //   sortable: true,
        // },
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
          name: "status",
          align: "left",
          label: "Active",
          field: "status",
          sortable: true,
        },
        {
          name: "actions",
          label: "",
          required: true,
          align: "center",
          field: "actions",
          format: (val) => `${val}`,
        },
      ],
      icons: {
        delete: matDelete,
      },
    };
  },
  components: {},
  created() {},
  mounted() {
    if (this.party_id != null) {
      this.getPartyAccounts();
    }
  },
  data() {
    return {
      client_id: this.getClientId(),
      party_accounts: [],
      fetch_account_id: null,
      search_account: "",
      fetched_account: null,
      account: this.newAccount(),
      disableBankName: false,
      disableBranchName: false,
      disableBranchcode: false,
      disable: this.disableByPermission(
        this.getPermissions().updatePartyBankAccount
      ),
      disableAccountStatus: this.disableByPermission(
        this.getPermissions().updatePartyBankAccountStatus
      ),
    };
  },
  methods: {
    handleStatus(account) {
      PartyAccountService.updateStatus(
        this.client_id,
        account.id,
        account.status
      )
        .then((response) => {})
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
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
        status: "ACTIVE",
        update: false,
      };
    },
    getPartyAccounts() {
      this.party_accounts.splice(0, this.party_accounts.length);
      PartyService.getPartyLinkedAccounts(this.client_id, this.party_id)
        .then((response) => {
          this.party_accounts = response;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    fetchAccount(fetch_account_id) {
      if (fetch_account_id === null || fetch_account_id === "") {
        this.fetched_account = null;
        return;
      }
      PartyAccountService.accountById(this.client_id, fetch_account_id)
        .then((response) => {
          this.fetched_account = response;
        })
        .catch((err) => {
          this.fetched_account = null;
          this.fail(this.getErrorMessage(err));
        });
    },
    linkAccount(account_id) {
      PartyAccountService.linkPartyAccount(
        this.client_id,
        this.party_id,
        account_id
      )
        .then((response) => {
          if (response === 0) {
            this.getPartyAccounts();
          } else if (response === -1) {
            this.fail("Account already linked");
          }
          this.fetched_account = null;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    deLink(account) {
      PartyAccountService.removeAccount(
        this.client_id,
        this.party_id,
        account.id
      )
        .then((response) => {
          if (response === 0) {
            this.getPartyAccounts();
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    addPartyAccount() {
      this.account.clientId = this.client_id;
      PartyAccountService.addPartyAccount(this.account)
        .then((response) => {
          this.linkAccount(response.id);
          this.success("Account Added Successfully");
          this.reset();
          this.selected_tab = "exists";
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    reset() {
      this.account = this.newAccount();
      this.disableBankName = false;
      this.disableBranchName = false;
      this.disableBranchcode = false;
    },
    getBankDetails() {
      if (this.account.ifscCode === "") {
        return;
      }
      PartyAccountService.bankByIFSC(this.account.ifscCode)
        .then((response) => {
          if (response !== "-1") {
            const bank = response.split(",");

            if (bank[0] !== null && bank[0] !== "") {
              this.account.bankName = bank[0];
              this.disableBankName = true;
            }
            if (bank[1] !== null && bank[1] !== "") {
              this.account.branchName = bank[1];
              this.disableBranchName = true;
            }
            if (bank[2] !== "null" && bank[2] !== "") {
              this.account.branchCode = bank[2];
              this.disableBranchcode = true;
            }
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
  },
};
</script>
