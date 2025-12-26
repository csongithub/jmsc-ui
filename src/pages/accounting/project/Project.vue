<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      dense
      bordered
      flat
      :rows="projects"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      :loading="loading"
      :pagination="project_pagination"
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
          color="secondary"
          label="New Project"
          size="10px"
          @click="openDialog('add', null)"
          :icon="icons.add"
        />
      </template>
      <template v-slot:top-right>
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

        <q-input
          class="q-ml-sm"
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Search projects"
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
          <q-td key="clientName" :props="props">{{
            props.row.clientName
          }}</q-td>
          <q-td key="nickName" :props="props">{{ props.row.nickName }}</q-td>
          <q-td key="fullName" :props="props">{{ props.row.fullName }}</q-td>
          <q-td key="packageNo" :props="props">{{ props.row.packageNo }}</q-td>
          <q-td key="agreementNo" :props="props">{{
            props.row.agreementNo
          }}</q-td>
          <q-td key="agreementDate" :props="props">{{
            props.row.agreementDate
          }}</q-td>

          <q-td key="agreementAmount" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.agreementAmount.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="constructionAmount" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.constructionAmount.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="maintenanceAmount" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.maintenanceAmount.toLocaleString("en-IN")
            }}</q-td
          >
          <q-td key="securityAmount" :props="props"
            ><q-icon :name="icons.rupee" />{{
              props.row.securityAmount.toLocaleString("en-IN")
            }}</q-td
          >

          <q-td>
            <q-icon
              color="grey"
              class="q-ma-none q-pa-none pointer"
              :name="icons.edit"
              @click="editProject(props.row)"
              size="10px"
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
      ref="neweProjectRef"
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
          <q-form
            @submit="createOrUpdate"
            @reset="resetProject"
            class="q-gutter-md"
          >
            <div class="row">
              <div class="col">
                <q-input
                  label="Client Name"
                  dense
                  outlined
                  v-model="project.clientName"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="project.nickName"
                  label="Calling or Nick Name"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                  maxlength="15"
                  counter
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="project.fullName"
                  label="Full Name"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="project.packageNo"
                  label="Package No"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="project.agreementNo"
                  label="Agreement No."
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  outlined
                  v-model="project.agreementDate"
                  label="Agreement Date"
                  :rules="[
                    (val) => !!val || '',
                    (val) => /^\d{2}-\d{2}-\d{4}$/.test(val) || '',
                  ]"
                  placeholder="dd-mm-yyyy"
                  hide-bottom-space
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
                          v-model="project.agreementDate"
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
                  type="number"
                  dense
                  outlined
                  v-model="project.agreementAmount"
                  label="Agreement Amount"
                  full-width
                  lazy-rules
                  :rules="[(val) => (val && val > 0) || '']"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  type="number"
                  dense
                  outlined
                  v-model="project.constructionAmount"
                  label="Construction Amount"
                  full-width
                  lazy-rules
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  type="number"
                  dense
                  outlined
                  v-model="project.maintenanceAmount"
                  label="Maintenance Amount"
                  full-width
                  lazy-rules
                  hide-bottom-space
                />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input
                  type="number"
                  dense
                  outlined
                  v-model="project.securityAmount"
                  label="Security Amount"
                  full-width
                  lazy-rules
                  hide-bottom-space
                />
              </div>
            </div>

            <div>
              <q-space />
              <q-btn
                dense
                size="10px"
                :label="mode === 'add' ? 'Create' : 'Update'"
                type="submit"
                color="secondary"
                class="text-capitalize q-px-md"
              />

              <q-btn
                v-if="mode === 'add'"
                dense
                size="10px"
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
import ProjectService from "src/services/ProjectService";
import { commonMixin } from "../../../mixin/common";
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { matCurrencyRupee, matDelete } from "@quasar/extras/material-icons";
import { ref } from "vue";
import { projectStore } from "src/pinia_stores/ProjectStore";
export default {
  name: "Project",
  mixins: [commonMixin],
  setup() {
    return {
      selected: ref([]),
      visibleColumns: ref([
        "nickName",
        "fullName",
        "packageNo",
        "agreementNo",
        "agreementDate",
      ]),
      columns: [
        {
          name: "clientName",
          align: "left",
          label: "Client",
          field: "clientName",
          sortable: true,
        },
        {
          name: "nickName",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.nickName,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "fullName",
          align: "left",
          label: "Complete Name",
          field: "fullName",
          sortable: true,
        },
        {
          name: "packageNo",
          align: "left",
          label: "Package No",
          field: "packageNo",
          sortable: true,
        },
        {
          name: "agreementNo",
          align: "left",
          label: "Agreement No",
          field: "agreementNo",
          sortable: true,
        },
        {
          name: "agreementDate",
          align: "left",
          label: "Agreement Date",
          field: "agreementDate",
          sortable: true,
        },
        {
          name: "agreementAmount",
          align: "left",
          label: "Agreement Value",
          field: "agreementAmount",
          sortable: true,
        },
        {
          name: "constructionAmount",
          align: "left",
          label: "Construcrtion Value",
          field: "constructionAmount",
          sortable: true,
        },
        {
          name: "maintenanceAmount",
          align: "left",
          label: "Maintenance Value",
          field: "maintenanceAmount",
          sortable: true,
        },
        {
          name: "securityAmount",
          align: "left",
          label: "Security Deposit",
          field: "securityAmount",
          sortable: true,
        },

        // {
        //   name: "actions",
        //   align: "left",
        //   required: true,
        //   label: "Actions",
        //   field: "actions",
        // },
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        delete: matDelete,
        rupee: matCurrencyRupee,
      },
    };
  },
  components: {},
  created() {},
  mounted() {
    window.addEventListener("keydown", this.globalKeyDownHandler);
    this.getAllProjects(false);
  },
  beforeUnmount() {
    // Remove event listener before the component is unmounted to prevent memory leaks
    window.removeEventListener("keydown", this.globalKeyDownHandler);
  },
  data() {
    return {
      client_id: this.getClientId(),
      project_pagination: { rowsPerPage: 20 },
      admin: this.isAdmin(),
      filter: "",
      loading: true,
      projects: [],
      project: this.newProject(),
      open: false,
      mode: "add",
      dialog_label: "New Project",
      keysPressed: null,
    };
  },
  methods: {
    globalKeyDownHandler(event) {
      // if (this.keysPressed !== "Control") this.keysPressed = event.key; //Control
      console.log("Global keydown:", event.key);
      // if (this.keysPressed === "Control" && event.key === "c") {
      //   this.keysPressed = null;
      //   this.openDialog("add", null);
      // }
    },
    newProject() {
      return {
        id: null,
        clientId: this.client_id,
        nickName: "",
        fullName: "",
        packageNo: "",
        agreementNo: "",
        agreementDate: null,
        agreementAmount: 0,
        constructionAmount: 0,
        maintenanceAmount: 0,
        otherAmount: 0,
        securityAmount: 0,
      };
    },
    async getAllProjects(refresh) {
      this.loading = true;
      ProjectService.all(this.client_id)
        .then((response) => {
          this.projects.splice(0, this.projects.length);
          this.projects = response;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });
      await projectStore().loadProjects(this.client_id, refresh);
    },
    async createOrUpdate() {
      this.project.clientId = this.client_id;
      await ProjectService.create(this.project)
        .then((response) => {
          if (this.mode === "add") {
            this.success("Project create Successfully");
          } else if (this.mode === "edit") {
            this.success("Project Updated Successfully");
          }
          this.open = false;
          this.getAllProjects(true);
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    editProject(row) {
      // console.log(JSON.stringify(row));
      this.project = row;
      console.log(JSON.stringify(this.project));
      this.dialog_label = "Update Project";
      this.open = true;
      this.mode = "edit";
    },
    beforeShow() {
      // this.resetProject();
    },
    openDialog(mode, row) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialog_label = "New Project";
      }
      this.open = true;
    },
    onHide() {
      this.resetProject();
      this.mode = "add";
    },
    resetProject() {
      this.project = this.newProject();
    },
  },
};
</script>
