<template>
  <div>
    <q-table
      class="my-sticky-header-table_einvoice"
      title="Suppliers"
      dense
      bordered
      flat
      :rows="suppliers"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      :filter="filter"
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
          label="Create Supplier"
          size="sm"
          glossy
          @click="openDialog('add', null)"
          icon="add"
        />
      </template>
      <template v-slot:top-right>
        <q-input
          class="q-mr-sm"
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Search Supplier"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
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
          <q-td key="name" :props="props">{{
            this.getPartyNames(props.row.partyId, "nick_name")
          }}</q-td>
          <q-td key="legal_name" :props="props">{{
            this.getPartyNames(props.row.partyId, "name")
          }}</q-td>

          <q-td key="actions">
            <q-icon
              v-if="admin"
              class="q-ma-sm q-pa-none pointer"
              color="red"
              :name="icons.delete"
              @click="deleteSupplier(props.row)"
            />
            <q-icon
              class="q-ma-none q-pa-none pointer"
              :name="icons.edit"
              @click="openDialog('edit', props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog
      v-model="open"
      persistent
      @before-show="beforeShow"
      @hide="onHide"
      ref="newPartyRef"
    >
      <q-card style="width: 800px; max-width: 80vw">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ dialog_label }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-stepper
          v-if="mode === 'add'"
          v-model="step"
          ref="stepper"
          color="primary"
          animated
        >
          <q-step
            :name="1"
            title="Select Party"
            icon="settings"
            :done="step > 1"
          >
            <q-table
              class="my-sticky-header-table"
              dense
              bordered
              flat
              :rows="parties"
              :columns="party_columns"
              row-key="nick_name"
              :loading="loading"
              :pagination="party_pagination"
              :filter="party_filter"
              selection="single"
              v-model:selected="selected_party"
            >
              <template v-slot:top-right>
                <q-input
                  borderless
                  dense
                  outlined
                  debounce="300"
                  v-model="party_filter"
                  placeholder="Search Party"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
            </q-table>
          </q-step>

          <q-step :name="2" title="Supply Configuration" icon="add_comment">
            <div class="row">
              <div class="col">Supplier Name</div>
              <div class="col">
                {{ this.getPartyNames(selected_party[0].id, "name") }}
              </div>
            </div>
            <div class="row">
              <div class="col">Supplier Nick Name</div>
              <div class="col">
                {{ this.getPartyNames(selected_party[0].id, "nick_name") }}
              </div>
            </div>
            <q-table
              class="my-sticky-header-table"
              dense
              bordered
              flat
              :rows="supply_data"
              :columns="supply_columns"
              row-key="item_name"
            >
              <template v-slot:top-left>
                <q-btn
                  class="text-capitalize"
                  dense
                  size="sm"
                  color="primary"
                  label="Add Item"
                  @click="addNewItem"
                ></q-btn>
              </template>
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="item_name" :props="props">
                    <div v-if="props.row.status === 'saved'">
                      {{ props.row.item_name }}
                    </div>
                    <div v-else-if="props.row.status === 'editable'">
                      <q-input
                        dense
                        outlined
                        v-model="props.row.item_name"
                        label="item name"
                        full-width
                      />
                    </div>
                  </q-td>

                  <q-td key="item_unit" :props="props">
                    <div v-if="props.row.status === 'saved'">
                      {{ props.row.item_unit }}
                    </div>
                    <div v-else-if="props.row.status === 'editable'">
                      <q-input
                        dense
                        outlined
                        v-model="props.row.item_unit"
                        label="unit of item"
                        full-width
                      /></div
                  ></q-td>
                  <q-td key="item_price" :props="props">
                    <div v-if="props.row.status === 'saved'">
                      {{ props.row.item_price }}
                    </div>
                    <div v-else-if="props.row.status === 'editable'">
                      <q-input
                        dense
                        outlined
                        v-model="props.row.item_price"
                        label="item price per unit"
                        full-width
                        type="number"
                      /></div
                  ></q-td>
                  <q-td key="actions">
                    <q-icon
                      v-if="props.row.status === 'saved'"
                      class="q-ma-none q-pa-none pointer"
                      :name="icons.edit"
                      @click="editItem(props)"
                    />
                    <q-icon
                      v-if="props.row.status === 'saved'"
                      class="q-ma-sm q-pa-none pointer"
                      color="red"
                      :name="icons.delete"
                      @click="deleteItem(props)"
                    />
                    <q-icon
                      v-if="props.row.status === 'editable'"
                      class="q-ma-sm q-pa-none pointer"
                      color="green"
                      name="save"
                      @click="saveItem(props)"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                @click="step === 2 ? create() : $refs.stepper.next()"
                color="primary"
                :label="step === 2 ? 'Finish' : 'Continue'"
              />
              <q-btn
                v-if="step > 1"
                flat
                color="primary"
                @click="$refs.stepper.previous()"
                label="Back"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
        <div class="q-ma-md" v-if="mode === 'edit'">
          <div class="row">
            <div class="col">Supplier Name</div>
            <div class="col">
              {{ this.getPartyNames(selected_supplier.partyId, "name") }}
            </div>
          </div>
          <div class="row">
            <div class="col">Supplier Nick Name</div>
            <div class="col">
              {{ this.getPartyNames(selected_supplier.partyId, "nick_name") }}
            </div>
          </div>
          <q-table
            class="my-sticky-header-table"
            dense
            bordered
            flat
            :rows="supply_data"
            :columns="supply_columns"
            row-key="item_name"
            :pagination="item_pagination"
          >
            <template v-slot:top-left>
              <q-btn
                class="text-capitalize"
                dense
                size="sm"
                color="primary"
                label="Add Item"
                @click="addNewItem"
              ></q-btn>
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
                <q-td key="item_name" :props="props">
                  <div v-if="props.row.status === 'saved'">
                    {{ props.row.item_name }}
                  </div>
                  <div v-else-if="props.row.status === 'editable'">
                    <q-input
                      dense
                      outlined
                      v-model="props.row.item_name"
                      label="item name"
                      full-width
                    />
                  </div>
                </q-td>

                <q-td key="item_unit" :props="props">
                  <div v-if="props.row.status === 'saved'">
                    {{ props.row.item_unit }}
                  </div>
                  <div v-else-if="props.row.status === 'editable'">
                    <q-input
                      dense
                      outlined
                      v-model="props.row.item_unit"
                      label="unit of item"
                      full-width
                    /></div
                ></q-td>
                <q-td key="item_price" :props="props">
                  <div v-if="props.row.status === 'saved'">
                    {{ props.row.item_price }}
                  </div>
                  <div v-else-if="props.row.status === 'editable'">
                    <q-input
                      dense
                      outlined
                      v-model="props.row.item_price"
                      label="item price per unit"
                      full-width
                      type="number"
                    /></div
                ></q-td>
                <q-td key="actions">
                  <q-icon
                    v-if="props.row.status === 'saved'"
                    class="q-ma-none q-pa-none pointer"
                    :name="icons.edit"
                    @click="editItem(props)"
                  />
                  <q-icon
                    v-if="props.row.status === 'saved'"
                    class="q-ma-sm q-pa-none pointer"
                    color="red"
                    :name="icons.delete"
                    @click="deleteItem(props)"
                  />
                  <q-icon
                    v-if="props.row.status === 'editable'"
                    class="q-ma-sm q-pa-none pointer"
                    color="green"
                    name="save"
                    @click="saveItem(props)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-btn
            outlined
            class="q-ma-sm text-capitalize float-right"
            size="md"
            @click="create()"
            color="primary"
            label="Save"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import PartyService from "../../../services/PartyService";
import SupplierService from "../../../services/SupplierService";
import { commonMixin } from "../../../mixin/common";
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { matCurrencyRupee, matDelete } from "@quasar/extras/material-icons";
import { ref } from "vue";
export default {
  name: "Supplier",
  mixins: [commonMixin],
  setup() {
    return {
      selected: ref([]),
      selected_party: ref([]),
      step: ref(1),
      tab: ref("party"),
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        rupee: matCurrencyRupee,
        delete: matDelete,
      },
      supply_columns: [
        {
          name: "item_name",
          required: true,
          label: "Item",
          align: "left",
          field: (row) => row.item_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "item_unit",
          required: true,
          label: "Unit",
          align: "left",
          field: (row) => row.item_unit,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "item_price",
          required: true,
          label: "Rate per Unit",
          align: "left",
          field: (row) => row.item_price,
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
      party_columns: [
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
      ],
    };
  },
  components: {},
  created() {},
  mounted() {
    this.getAllSuppliers();
  },
  data() {
    return {
      client_id: this.getClientId(),
      admin: this.isAdmin(),
      permissions: this.getPermissions(),
      pagination: { rowsPerPage: 25 },
      party_pagination: { rowsPerPage: 25 },
      item_pagination: { rowsPerPage: 10 },
      filter: "",
      party_filter: "",
      open: false,
      mode: "add",
      dialog_label: "Create Supplier",
      parties: [],
      columns: [
        {
          name: "name",
          align: "left",
          label: "Supplier Name",
          field: (row) => this.getPartyNames(row.partyId, "nick_name"),
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "legal_name",
          align: "left",
          label: "Legal Name",
          field: (row) => this.getPartyNames(row.partyId, "name"),
          format: (val) => `${val}`,
          sortable: true,
        },
      ],
      suppliers: [],
      supplier: this.newSupplier(),
      supply_data: [],
      selected_supplier: null,
    };
  },
  methods: {
    addNewItem() {
      let item = {
        item_name: "",
        item_unit: "",
        item_price: 0,
        status: "editable",
      };
      this.supply_data.push(item);
    },
    saveItem(props) {
      props.row.status = "saved";
      console.log("Saved: " + JSON.stringify(props));
    },
    editItem(props) {
      props.row.status = "editable";
      console.log("Editable: " + JSON.stringify(props));
    },
    deleteItem(props) {
      let index = props.rowIndex;
      this.supply_data.splice(index, 1);
    },
    newSupplier() {
      return {
        clientId: this.client_id,
        id: null,
        partyId: null,
        supplyConfig: "",
      };
    },
    create() {
      this.supplier = {
        clientId: this.client_id,
        id: this.mode === "add" ? null : this.selected_supplier.id,
        partyId:
          this.mode === "add"
            ? this.selected_party[0].id
            : this.selected_supplier.partyId,
        supplyConfig: JSON.stringify(this.supply_data),
      };

      SupplierService.create(this.supplier)
        .then((response) => {
          if (this.mode === "add") {
            this.success("Supplier create Successfully");
          } else if (this.mode === "edit") {
            this.success("Supplier Updated Successfully");
          }
          this.getAllSuppliers();
          this.open = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    getAllSuppliers() {
      SupplierService.all(this.client_id)
        .then((response) => {
          this.suppliers.splice(0, this.suppliers.length);
          this.suppliers = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    deleteSupplier(row) {
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "This will delete the supplier permanently.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          SupplierService.deleteSupplier(this.client_id, row.id)
            .then((response) => {
              if (response === 0) {
                this.getAllSuppliers();
                this.success("Supplier has been deleted");
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
    editParty(row) {},
    beforeShow() {},
    onHide() {
      this.step = 1;
      this.selected_party = [];
      this.supply_data = [];
      this.supplier = this.newSupplier();
    },
    openDialog(mode, supplier) {
      console.log(JSON.stringify(supplier));
      this.mode = mode;
      if (this.mode === "add") {
        this.getAllParties();
        this.dialog_label = "Create Supplier";
      } else if (this.mode === "edit") {
        this.selected_supplier = supplier;
        this.supply_data = JSON.parse(supplier.supplyConfig);
        this.dialog_label = "Update Supplier";
      }
      this.open = true;
    },
    getAllParties() {
      PartyService.all(this.client_id)
        .then((response) => {
          this.parties.splice(0, this.parties.length);
          this.parties = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
  },
};
</script>
