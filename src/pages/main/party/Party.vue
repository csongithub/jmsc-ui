<template>
  <div>
    <!-- {{permissions}} -->
    <q-table
      class="my-sticky-header-table"
      title="All Party"
      dense
      bordered
      flat
      :rows="parties"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="nick_name"
      :loading="loading"
      :pagination="party_pagination"
      :filter="filter"
      wrap-cells
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-icon
            class="q-ma-none q-pa-none pointer"
            color="primary"
            :name="icons.edit"
            @click="editParty(props.row)"
          />
          <q-icon
            v-if="admin || permissions.deleteParty"
            class="q-ma-sm q-pa-none pointer"
            color="red"
            :name="icons.delete"
            @click="deleteParty(props.row)"
          />
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-input
          class="q-mr-sm"
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Search Site"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
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
      <template v-slot:top-left>
        <q-btn
          v-if="admin || permissions.addParty"
          class="q-mt-sm q-mr-sm text-capitalize"
          color="primary"
          label="Add"
          size="sm"
          glossy
          @click="openDialog('add')"
          :icon="icons.plus"
        />
        <q-btn
          class="q-mt-sm q-mr-sm text-capitalize"
          outline
          color="primary"
          icon="refresh"
          label="Refresh"
          size="sm"
          glossy
          @click="getAllParties()"
        />
      </template>
    </q-table>

    <q-dialog
      v-model="open"
      persistent
      @before-show="beforeShow"
      @hide="onHide"
      ref="newPartyRef"
    >
      <q-card style="width: 1000px; max-width: 80vw">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ dialog_label }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-tabs
          v-model="tab"
          dense
          class="bg-primary text-white shadow-2"
          narrow-indicator
          align="left"
          :breakpoint="0"
          inline-label
          no-caps
        >
          <q-tab name="party" label="Party"> </q-tab>
          <q-tab name="bank_accounts" label="Bank Accounts" />
        </q-tabs>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="party">
            <q-card-section>
              <q-form @submit="addParty" @reset="reset">
                <div class="row">
                  <div class="col-3 q-mr-sm">
                    <q-select
                      :disable="disableByPermission(permissions.addParty)"
                      placeholder="Select a party type"
                      dense
                      outlined
                      v-model="party.party_type"
                      :options="party_type_options"
                      label="Party Type"
                      lazy-rules
                      :rules="[
                        (val) => (val && val.length > 0) || 'Enter Party Type',
                      ]"
                    />
                  </div>
                  <div class="col-4 q-mr-sm">
                    <q-input
                      :disable="disableByPermission(permissions.addParty)"
                      placeholder="Party Nick Name"
                      dense
                      outlined
                      v-model="party.nick_name"
                      label="Nick Name"
                      full-width
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Enter Party Nick name',
                      ]"
                    />
                  </div>
                  <div class="col-4 q-mr-sm">
                    <q-input
                      :disable="disableByPermission(permissions.addParty)"
                      placeholder="Party Legal Name, For Example- OM Service Station"
                      dense
                      outlined
                      v-model="party.name"
                      label="Legal Name"
                      full-width
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Enter Party Legal Name',
                      ]"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <q-input
                      :disable="disableByPermission(permissions.addParty)"
                      placeholder="Party Address, For Example- Near Bypass, Aurangabad, Bihar"
                      type="textarea"
                      dense
                      outlined
                      v-model="party.address"
                      label="Address"
                      full-width
                    />
                  </div>
                </div>
                <div class="row q-mt-sm">
                  <div class="col-3 q-mr-sm">
                    <q-input
                      :disable="disableByPermission(permissions.addParty)"
                      placeholder="Mobile"
                      dense
                      outlined
                      v-model="party.mobile"
                      label="Mobile"
                      full-width
                    />
                  </div>
                  <div class="col-3 q-mr-sm">
                    <q-select
                      :disable="disableByPermission(permissions.addParty)"
                      placeholder="status"
                      dense
                      outlined
                      v-model="party.status"
                      :options="party_status_options"
                      label="Status"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Select party status',
                      ]"
                    />
                  </div>
                </div>

                <div class="q-mt-sm">
                  <q-space />
                  <q-btn
                    :disable="disableByPermission(permissions.addParty)"
                    dense
                    glossy
                    size="sm"
                    :label="mode === 'add' ? 'Add' : 'Update'"
                    type="submit"
                    color="primary"
                    class="text-capitalize q-px-md"
                  />

                  <q-btn
                    :disable="disableByPermission(permissions.addParty)"
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
            <div
              class="text-red"
              v-if="disableByPermission(permissions.addParty)"
            >
              You don't have permissions to update the party details
            </div>
          </q-tab-panel>
          <q-tab-panel name="bank_accounts">
            <q-card-section>
              <ManageAccount :party_id="party.id" />
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import PartyService from "../../../services/main/PartyService";
import EnumService from "../../../services/EnumerationService";
import { commonMixin } from "../../../mixin/common";
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { matCurrencyRupee, matDelete } from "@quasar/extras/material-icons";
import ManageAccount from "./ManagePartyAccount.vue";
import { ref } from "vue";
export default {
  name: "Site",
  mixins: [commonMixin],
  setup() {
    return {
      selected: ref([]),
      tab: ref("party"),
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        rupee: matCurrencyRupee,
        delete: matDelete,
      },
      visibleColumns: ref([
        "nick_name",
        "name",
        "party_type",
        "status",
        "actions",
      ]),
    };
  },
  components: {
    ManageAccount,
  },
  created() {},
  mounted() {
    this.getAllParties();
    this.getPartyStatusOptions();
  },
  data() {
    return {
      client_id: this.getClientId(),
      admin: this.isAdmin(),
      permissions: this.getPermissions(),
      party_pagination: { rowsPerPage: 20 },
      filter: "",
      columns: [
        {
          name: "nick_name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.nick_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "name",
          align: "left",
          label: "Legal Name",
          field: "name",
          sortable: true,
        },
        {
          name: "party_type",
          align: "left",
          label: "Party Type",
          field: "party_type",
          sortable: true,
        },
        {
          name: "mobile",
          align: "left",
          label: "Mobie",
          field: "mobile",
          sortable: true,
        },
        {
          name: "address",
          align: "left",
          label: "Address",
          field: "address",
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
          sortable: true,
        },
        {
          name: "actions",
          required: false,
          label: "Actions",
          field: "actions",
        },
      ],
      party_status_options: this.getPartyStatusOptions(),
      loading: true,
      parties: [],
      party: this.newParty(),
      open: false,
      mode: "add",
      dialog_label: "New Party",
      party_type_options: this.getPartyTypeOptions(),
    };
  },
  methods: {
    newParty() {
      return {
        id: null,
        client_id: this.client_id,
        name: "",
        nick_name: "",
        party_type: null,
        mobile: null,
        address: null,
      };
    },
    getPartyTypeOptions() {
      EnumService.getOptions("EPartyType")
        .then((response) => {
          this.party_type_options = [];
          this.party_type_options = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getPartyStatusOptions() {
      EnumService.getOptions("EPartyStatus")
        .then((response) => {
          this.party_status_options = [];
          this.party_status_options = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllParties() {
      this.loading = true;
      PartyService.all(this.client_id)
        .then((response) => {
          this.parties.splice(0, this.parties.length);
          this.parties = response;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    addParty() {
      this.party.client_id = this.client_id;
      PartyService.create(this.party)
        .then((response) => {
          if (this.mode === "add") {
            this.party.id = response.id;
            this.success("Party added Successfully");
            this.updatePartyCache(response);
          } else if (this.mode === "edit") {
            this.success("Party Updated Successfully");
          }
          this.getAllParties();
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    editParty(row) {
      console.log(JSON.stringify(row));
      this.party = row;
      console.log(JSON.stringify(this.party));
      this.dialog_label = "Update Party";
      this.open = true;
    },
    beforeShow() {},
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialog_label = "New Party";
      }
      this.open = true;
    },
    onHide() {
      this.reset();
      this.mode = "add";
      this.tab = "party";
    },
    reset() {
      this.party = this.newParty();
    },
    deleteParty(party) {
      console.log(JSON.stringify(party));
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "This will delete the party permanently.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          PartyService.deleteParty(this.client_id, party.id)
            .then((response) => {
              if (response === 0) {
                this.getAllParties();
                this.success("Party has been deleted");
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
  },
};
</script>
