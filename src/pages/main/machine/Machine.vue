<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      dense
      bordered
      flat
      :rows="machines"
      :visible-columns="visibleColumns"
      :columns="columns"
      row-key="name"
      :loading="loading"
      :pagination="machine_pagination"
      :filter="filter"
      v-model:selected="selected"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-icon
            v-if="showEditMachine"
            class="pointer q-mr-sm"
            color="primary"
            :name="icons.edit"
            @click="editMachine(props.row)"
          />

          <q-icon
            v-if="showDeleteMachine"
            class="pointer"
            color="red"
            :name="icons.delete"
            @click="deleteMachine(props.row)"
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
          placeholder="Search Machine or Vehicle"
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
        >
          <q-tooltip>Select/Remove Columns</q-tooltip>
        </q-select>
      </template>
      <template v-slot:top-left>
        <q-btn
          v-if="showAddMachine"
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
          @click="getAllMachines()"
        />
      </template>
    </q-table>
    <q-dialog
      v-model="open"
      persistent
      @before-show="beforeShow"
      @hide="onHide"
      ref="newMachineRef"
    >
      <q-card style="width: 700px; max-width: 80vw">
        <q-bar
          class="bg-primary glossy text-white text-weight-light text-subtitle2"
        >
          {{ dialog_label }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-form @submit="addMachine" @reset="reset" class="q-gutter-md">
            <div class="row">
              <div class="col">
                <q-input
                  class="q-mr-sm"
                  dense
                  outlined
                  v-model="machine.name"
                  label="Vehicle Name"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Enter Vehicle Name',
                  ]"
                />
              </div>
              <div class="col">
                <q-input
                  class="q-mr-sm"
                  dense
                  outlined
                  v-model="machine.owner"
                  label="Owner Name"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Enter Owner Name',
                  ]"
                />
              </div>
              <div class="col">
                <q-select
                  dense
                  outlined
                  v-model="machine.machine_type"
                  :options="machine_type_list"
                  label="Category"
                />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input
                  class="q-mr-sm"
                  dense
                  outlined
                  v-model="machine.registration_no"
                  label="Registration Number"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Enter Registration Number',
                  ]"
                />
              </div>
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="machine.registration_date"
                  :rules="['DD-MM-YYYY']"
                  label="Registration Date"
                  :placeholder="'dd-mm-yyyy'"
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
                          v-model="machine.registration_date"
                          mask="DD-MM-YYYY"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              class="text-capitalize"
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input
                  class="q-mr-sm"
                  dense
                  outlined
                  v-model="machine.chasis_no"
                  label="Chasis Number"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Enter Chasis Number',
                  ]"
                />
              </div>
              <div class="col">
                <q-input
                  class="q-mr-sm"
                  dense
                  outlined
                  v-model="machine.engine_no"
                  label="Engine Number"
                  full-width
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Enter Engine Number',
                  ]"
                />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input
                  class="q-mr-sm"
                  dense
                  outlined
                  v-model="machine.insurance_valid_up_to"
                  :rules="['DD-MM-YYYY']"
                  label="Insurance Validiy"
                  :placeholder="'dd-mm-yyyy'"
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
                          v-model="machine.insurance_valid_up_to"
                          mask="DD-MM-YYYY"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              class="text-capitalize"
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input
                  class="q-mr-sm"
                  dense
                  outlined
                  v-model="machine.tax_valid_up_to"
                  :rules="['DD-MM-YYYY']"
                  label="Tax Validiy"
                  :placeholder="'dd-mm-yyyy'"
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
                          v-model="machine.tax_valid_up_to"
                          mask="DD-MM-YYYY"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              class="text-capitalize"
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="machine.permit_valid_up_to"
                  :rules="['DD-MM-YYYY']"
                  label="Permit Validiy"
                  :placeholder="'dd-mm-yyyy'"
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
                          v-model="machine.permit_valid_up_to"
                          mask="DD-MM-YYYY"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              class="text-capitalize"
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input
                  class="q-mr-sm"
                  dense
                  outlined
                  v-model="machine.pollution_valid_up_to"
                  :rules="['DD-MM-YYYY']"
                  label="Pollution Validiy"
                  :placeholder="'dd-mm-yyyy'"
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
                          v-model="machine.pollution_valid_up_to"
                          mask="DD-MM-YYYY"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              class="text-capitalize"
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="machine.fitness_valid_up_to"
                  :rules="['DD-MM-YYYY']"
                  label="Fitness Validiy"
                  :placeholder="'dd-mm-yyyy'"
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
                          v-model="machine.fitness_valid_up_to"
                          mask="DD-MM-YYYY"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              class="text-capitalize"
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col"></div>
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
import EnumService from "../../../services/EnumerationService";
import MachineService from "../../../services/MachineService";
import { commonMixin } from "../../../mixin/common";
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { matCurrencyRupee, matDelete } from "@quasar/extras/material-icons";
import { ref } from "vue";
export default {
  name: "Site",
  mixins: [commonMixin],
  setup() {
    return {
      selected: ref([]),
      visibleColumns: ref([
        "name",
        "registration_no",
        "insurance_valid_up_to",
        "tax_valid_up_to",
        "pollution_valid_up_to",
        "fitness_valid_up_to",
      ]),
      columns: [
        {
          name: "name",
          required: true,
          label: "Machine Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "owner",
          align: "left",
          label: "Owner",
          field: "owner",
          sortable: true,
        },
        {
          name: "machine_type",
          align: "left",
          label: "Category",
          field: "machine_type",
          sortable: true,
        },
        {
          name: "registration_no",
          align: "left",
          label: "Regd No",
          field: "registration_no",
          sortable: true,
        },
        {
          name: "registration_date",
          align: "left",
          label: "Regd Date",
          field: "registration_date",
          sortable: true,
        },
        {
          name: "chasis_no",
          align: "left",
          label: "Chasis No",
          field: "chasis_no",
          sortable: true,
        },
        {
          name: "engine_no",
          align: "left",
          label: "Engine No",
          field: "engine_no",
          sortable: true,
        },
        {
          name: "insurance_valid_up_to",
          align: "left",
          label: "Insurance Up To",
          field: "insurance_valid_up_to",
          sortable: true,
        },
        {
          name: "tax_valid_up_to",
          align: "left",
          label: "Tax Up To",
          field: "tax_valid_up_to",
          sortable: true,
        },
        {
          name: "permit_valid_up_to",
          align: "left",
          label: "Permit Up To",
          field: "permit_valid_up_to",
          sortable: true,
        },
        {
          name: "pollution_valid_up_to",
          align: "left",
          label: "Pollution Up To",
          field: "pollution_valid_up_to",
          sortable: true,
        },
        {
          name: "fitness_valid_up_to",
          align: "left",
          label: "Fitness Up To",
          field: "fitness_valid_up_to",
          sortable: true,
        },
        { name: "actions", required: true, label: "Actions", field: "actions" },
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        rupee: matCurrencyRupee,
        delete: matDelete,
      },
    };
  },
  components: {},
  created() {},
  mounted() {
    this.getAllMachines();
  },
  data() {
    return {
      client_id: this.getClientId(),
      machine_pagination: { rowsPerPage: 20 },
      filter: "",
      loading: true,
      machines: [],
      machine: this.newMachine(),
      open: false,
      mode: "add",
      dialog_label: "New Machine",
      machine_type_list: this.getMachineTypes(),
      showAddMachine: this.showByPermission(this.getPermissions().addMachine),
      showEditMachine: this.showByPermission(
        this.getPermissions().updateMachine
      ),
      showDeleteMachine: this.showByPermission(
        this.getPermissions().deleteMachine
      ),
    };
  },
  methods: {
    getMachineTypes() {
      EnumService.getOptions("EMachineType")
        .then((response) => {
          this.machine_type_list = [];
          this.machine_type_list = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    newMachine() {
      return {
        id: null,
        client_id: this.client_id,
        name: "",
        owner: "",
        machine_type: "",
        registration_no: "",
        registration_date: null,
        chasis_no: "",
        engine_no: "",
        insurance_valid_up_to: null,
        permit_valid_up_to: null,
        tax_valid_up_to: null,
        pollution_valid_up_to: null,
        fitness_valid_up_to: null,
      };
    },
    getAllMachines() {
      this.loading = true;
      MachineService.all(this.client_id)
        .then((response) => {
          this.machines.splice(0, this.machines.length);
          this.machines = response;
          // window.alert(JSON.stringify(this.sites))
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    addMachine() {
      // window.alert(JSON.stringify(this.machine))
      this.machine.client_id = this.client_id;
      MachineService.create(this.machine)
        .then((response) => {
          if (this.mode === "add") {
            this.getAllMachines();
            this.success("Machine create Successfully");
          } else if (this.mode === "edit") {
            this.success("Machine Updated Successfully");
          }
          this.$refs.newMachineRef.hide();
          this.updateNotificationCache(this.client_id);
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
    },
    deleteMachine(machine) {
      this.$q
        .dialog({
          title: "Are You Sure?",
          message: "This will delete the machine permanently.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          MachineService.deleteMachine(this.client_id, machine.id)
            .then((response) => {
              if (response === 0) {
                this.getAllMachines();
                this.success("Machine has been deleted");
              }
            })
            .catch((err) => {
              this.fail(this.getErrorMessage(err));
            });
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    editMachine(row) {
      console.log(JSON.stringify(row));
      this.machine = row;
      console.log(JSON.stringify(this.machine));
      this.dialog_label = "Update Machine";
      this.open = true;
    },
    beforeShow() {},
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialog_label = "New Machine";
      }
      this.open = true;
    },
    onHide() {
      this.reset();
      this.mode = "add";
    },
    reset() {
      this.machine = this.newMachine();
    },
  },
};
</script>
