<template>
  <q-layout>
    <q-splitter
      v-model="splitterModel"
      separator-class="bg-secondary"
      separator-style="width: 3px"
      style="height: 600px"
    >
      <template v-slot:before>
        <!-- Content for the left panel goes here -->
        <div class="q-pa-md">
          <div class="row">
            <div class="col">
              <q-select
                dense
                :disable="disableSelectCreditor"
                outlined
                hide-bottom-space
                label="Select Creditors"
                label-color="secondary"
                :options="options"
                v-model="selectedCreditor"
                option-disable="inactive"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterCreditor"
                @update:model-value="getCreditor"
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
            <div class="q-ml-sm">OR</div>
            <div class="col q-ml-sm">
              <q-btn
                class="text-capitalize text-secondary"
                :disable="disableSelectCreditor"
                label="Create New"
                :icon="icons.add"
                outline
                @click="showCreateForm('add')"
              />
            </div>
          </div>
          <q-card style="" v-if="showCreate" class="full-width">
            <q-bar
              class="q-mt-md bg-secondary text-white text-weight-light text-subtitle2"
            >
              {{ "New Creditor" }}
            </q-bar>
            <q-card-section>
              <div class="">
                <q-form
                  @submit="saveCreditor"
                  @reset="cancel"
                  class="q-gutter-md"
                >
                  <div>
                    <q-input
                      dense
                      outlined
                      v-model="creditor.name"
                      label="Creditor Name"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Enter Creditor name',
                      ]"
                    />
                  </div>
                  <div>
                    <q-input
                      dense
                      outlined
                      v-model="creditor.address"
                      label="Creditor Address"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Enter creditor address',
                      ]"
                    />
                  </div>
                  <div>
                    <q-select
                      dense
                      outlined=""
                      hide-bottom-space
                      label="Select Party"
                      label-color="secondary"
                      :options="partyOptions"
                      v-model="creditor.partyId"
                      option-disable="inactive"
                      emit-value
                      map-options
                      use-input
                      input-debounce="0"
                      @filter="filterParty"
                      lazy-rules
                      :rules="[
                        (val) => (val && val !== null) || 'Please link a party',
                      ]"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-red">
                            No Party Matched
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <div>
                    <q-btn
                      dense
                      size="sm"
                      label="Save"
                      type="submit"
                      color="secondary"
                      class="text-capitalize q-px-md"
                    />

                    <q-btn
                      dense
                      size="sm"
                      label="Cancel"
                      type="reset"
                      class="text-capitalize q-px-md q-mx-sm"
                    />
                  </div>
                </q-form></div
            ></q-card-section>
          </q-card>

          <q-card v-if="selectedCreditor !== null" class="q-mt-xl full-width">
            <q-bar
              class="bg-secondary text-white text-weight-light text-subtitle2"
            >
            </q-bar>
            <q-card-section>
              <div class="row">
                <div class="col">NAME</div>
                <div class="col">{{ ":" + creditor.name }}</div>
              </div>
              <div class="row q-mt-sm">
                <div class="col">ADDRESS</div>
                <div class="col">{{ ":" + creditor.address }}</div>
              </div>
              <div class="row q-mt-sm">
                <div class="col">PARTY LEGAL NAME</div>
                <div class="col">
                  {{ ":" + getPartyNames(creditor.partyId, "name") }}
                </div>
              </div>
              <div class="row">
                <div class="col">PARTY NICK NAME</div>
                <div class="col text-secondary">
                  {{ ":" + getPartyNames(creditor.partyId, "nick_name") }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:separator>
        <q-avatar
          color="secondary"
          text-color="white"
          size="40px"
          icon="drag_indicator"
        />
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <q-bar
            dense
            class="bg-secondary text-white text-weight-light text-subtitle2"
          >
            <div class="">Add Materials (Ctrl + M)</div>
          </q-bar>
          <q-table
            flat
            dense
            bordered
            :rows="items"
            :columns="columns"
            row-key="name"
            binary-state-sort
            :pagination="item_pagination"
            :filter="filterItem"
          >
            <template v-slot:top-left v-if="selectedCreditor != null">
              <!-- <q-btn
                class="text-capitalize"
                color="secondary"
                label="Add More"
                size="sm"
                @click="addItem"
                :icon="icons.add"
              /> -->

              <!-- <q-btn
                class="text-capitalize q-ml-sm"
                color="secondary"
                label="Save"
                size="sm"
                @click="saveItems"
              /> -->
            </template>

            <template v-slot:top-right v-if="selectedCreditor != null">
              <q-input
                class="q-ml-sm"
                borderless
                dense
                outlined
                debounce="300"
                v-model="filterItem"
                placeholder="Search items"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" ref="itemRow">
                <q-td key="name" :props="props">
                  <q-input
                    v-if="props.row.mode === 'edit'"
                    ref="nameRef"
                    v-model="props.row.name"
                    dense
                    outlined
                    label="item name"
                    @update:model-value="
                      (val) => {
                        props.row.name = val.toUpperCase();
                      }
                    "
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']"
                    style="max-width: 150px"
                  />
                  <span v-else>{{ props.row.name }}</span>
                </q-td>
                <q-td key="unit" :props="props">
                  <q-input
                    v-if="props.row.mode === 'edit'"
                    ref="unitRef"
                    v-model="props.row.unit"
                    dense
                    outlined
                    label="item unit"
                    @update:model-value="
                      (val) => {
                        props.row.unit = val.toUpperCase();
                      }
                    "
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']"
                    style="max-width: 150px"
                  />
                  <span v-else>{{ props.row.unit }}</span>
                </q-td>
                <q-td key="rate" :props="props">
                  <q-input
                    v-if="props.row.mode === 'edit'"
                    ref="rateRef"
                    type="number"
                    v-model="props.row.rate"
                    dense
                    outlined
                    label="rate per unit"
                    lazy-rules
                    :rules="[(val) => val > 0 || '']"
                    style="max-width: 150px"
                  />
                  <span v-else>{{ props.row.rate }}</span>
                </q-td>
                <q-td>
                  <q-icon
                    v-if="props.row.mode === 'edit'"
                    color="primary"
                    class="q-mr-sm pointer"
                    :name="icons.save"
                    @click="addItemToList(props.row)"
                  />
                  <q-icon
                    v-if="props.row.mode === 'edit'"
                    color="red"
                    class="q-mr-sm pointer"
                    :name="icons.delete"
                    @click="removeItem(props.rowIndex)"
                  />
                  <q-icon
                    v-else
                    color="primary"
                    class="q-mr-sm pointer"
                    :name="icons.edit"
                    @click="props.row.mode = 'edit'"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-page-container class="q-mt-xl" v-if="selectedCreditor === null">
            <q-page class="row justify-center text-bold text-uppercase">
              {{ "please select a creditor" }}
            </q-page>
          </q-page-container>
        </div>
      </template>
    </q-splitter>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import PartyService from "src/services/main/PartyService";
import {
  fasPlus,
  fasEdit,
  fasSave,
  fasTrash,
} from "@quasar/extras/fontawesome-v5";
import { reset } from "numeral";

export default {
  name: "Creditors",
  mixins: [commonMixin],
  components: {},
  mounted() {
    this.getAllCreditors();
    this.getParties();
    window.addEventListener("keydown", this.globalKeyDownHandler);
  },
  beforeUnmount() {
    // Remove event listener before the component is unmounted to prevent memory leaks
    window.removeEventListener("keydown", this.globalKeyDownHandler);
  },
  setup() {
    const splitterModel = ref(50);

    return {
      splitterModel,
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        save: fasSave,
        delete: fasTrash,
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        { name: "unit", align: "left", label: "Unit", field: "unit" },
        { name: "rate", align: "left", label: "Rate", field: "rate" },
      ],
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
      item_pagination: { rowsPerPage: 20 },
      selectedCreditor: null,
      options: [],
      creditors: [],
      creditor: this.newCreditor(),
      partyOptions: [],
      parties: [],
      mode: "add",
      showCreate: false,
      disableSelectCreditor: false,
      items: [],
      filterItem: "",
      keysPressed: null,
    };
  },
  methods: {
    globalKeyDownHandler(event) {
      // console.log("Global keydown:", event.key);
      if (this.keysPressed !== "Control") this.keysPressed = event.key;
      if (
        this.keysPressed === "Control" &&
        event.key === "m" &&
        this.selectedCreditor !== null
      ) {
        this.keysPressed = null;
        this.addItem();
      }
    },

    filterCreditor(val, update, abort) {
      update(() => {
        const input = val.toLowerCase();
        this.options = this.creditors.filter((option) => {
          return option.label.toLowerCase().indexOf(input) > -1;
        });
      });
    },
    filterParty(input, update, abort) {
      update(() => {
        const val = input.toLowerCase();
        this.partyOptions = this.parties.filter((option) => {
          return option.label.toLowerCase().indexOf(val) > -1;
        });
      });
    },

    newCreditor() {
      return {
        id: null,
        clientId: this.clientId,
        name: null,
        address: null,
        partyId: null,
        items: null,
      };
    },
    saveCreditor(event) {
      this.creditor.clientId = this.clientId;
      AccountingService.saveCreditor(this.creditor)
        .then((response) => {
          if (event !== "item saved")
            this.success("Creditor Saved Successfully");
          this.getAllCreditors();
          this.showCreate = false;
          this.disableSelectCreditor = false;
        })
        .catch((err) => {});
    },
    getAllCreditors() {
      AccountingService.getAllCreditors(this.clientId)
        .then((response) => {
          this.options = response.list;
          this.creditors = response.list;
        })
        .catch((err) => {});
    },
    getParties() {
      PartyService.list(this.clientId)
        .then((response) => {
          this.partyOptions = response.list;
          this.parties = response.list;
        })
        .catch((err) => {});
    },
    showCreateForm(mode) {
      this.creditor = this.newCreditor();
      this.items = [];
      this.mode = mode;
      this.showCreate = true;
      this.disableSelectCreditor = true;
      this.selectedCreditor = null;
    },
    cancel() {
      this.creditor = this.newCreditor();
      this.showCreate = false;
      this.disableSelectCreditor = false;
    },
    getCreditor() {
      AccountingService.getCreditor(this.clientId, this.selectedCreditor)
        .then((response) => {
          this.creditor = response;
          this.items =
            this.creditor.items !== null ? JSON.parse(this.creditor.items) : [];
        })
        .catch((err) => {});
    },
    addItem() {
      this.items.push({
        name: "",
        unit: "",
        rate: 0,
        mode: "edit",
      });
    },
    addItemToList(row) {
      if (row.name.length > 0 && row.unit.length > 0 && row.rate > 0) {
        row.mode = "save";
        this.creditor.items = JSON.stringify(this.items);
        this.saveCreditor("item saved");
      }
    },
    removeItem(rowIndex) {
      // window.alert(rowIndex);
      this.items.splice(rowIndex, 1);
      this.creditor.items = JSON.stringify(this.items);
      this.saveCreditor("item saved");
    },
  },
};
</script>

<style lang="sass" scoped></style>
