<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar class="glossy">
        <q-toolbar-title class="text-white text-bold">
          {{ "JMSC-ACCOUNTING" }}
        </q-toolbar-title>
        <!-- <q-select
          label="Project"
          label-color="white"
          :options="options"
          v-model="selectedProject"
          option-value="id"
          option-label="nickName"
          option-disable="inactive"
          emit-value
          map-options
          use-input
          input-debounce="0"
          @filter="filterFn"
          filled
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-red">
                No Project Match
              </q-item-section>
            </q-item>
          </template>
        </q-select> -->
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="q-gutter-y-md">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-primary bg-secondary"
            active-color="white"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            active-bg-color=""
          >
            <q-tab name="dashboard" label="Dashboard" />
            <q-tab name="project" label="Projects" />
            <q-tab name="creditor" label="Creditors" />
            <q-tab name="suppliers" label="Leadger" />
            <q-tab name="entry" label="Entry" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="dashboard">
              <Dashboard></Dashboard>
            </q-tab-panel>
            <q-tab-panel name="project">
              <Project></Project>
            </q-tab-panel>
            <q-tab-panel name="creditor">
              <Creditor></Creditor>
            </q-tab-panel>
            <q-tab-panel name="suppliers">
              <Leadger></Leadger>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </q-page-container>
    <!-- <q-page-container else>
      <q-page class="row justify-center items-center bg-white text-secondary">
        <q-card> {{ "Please Select a Project" }}</q-card>
      </q-page>
    </q-page-container> -->
  </q-layout>
</template>

<script>
import { commonMixin } from "../mixin/common";
import Dashboard from "../pages/accounting/Dashboard.vue";
import Project from "../pages/accounting/project/Project.vue";
import Creditor from "../pages/accounting/Creditor/Creditor.vue";
import Leadger from "../pages/accounting/Leadger.vue";
import ProjectService from "src/services/ProjectService";
import { ref } from "vue";

// const options = ref([]);
// const projects = ref([]);
export default {
  mixins: [commonMixin],
  components: {
    Dashboard,
    Project,
    Creditor,
    Leadger,
  },
  created() {},
  mounted() {
    // this.getAllProjects();
    // var fs = !this.$q.fullscreen.isActive ? this.$q.fullscreen.toggle() : null;
  },
  setup() {
    return {
      tab: ref("dashboard"),
      // options,
      // filterFn(val, update, abort) {
      //   update(() => {
      //     const needle = val.toLowerCase();
      //     options.value = projects.value.filter((option) => {
      //       return option.nickName.toLowerCase().indexOf(needle) > -1;
      //     });
      //   });
      // },
    };
  },
  data() {
    return {
      client_id: this.getClientId(),
      // projects: [],
      selectedProject: null,
    };
  },
  methods: {
    // getAllProjects() {
    //   ProjectService.all(this.client_id)
    //     .then((response) => {
    //       options.value = [...response];
    //       projects.value = [...response];
    //     })
    //     .catch((err) => {
    //       this.fail(this.getErrorMessage(err));
    //     });
    // },
  },
};
</script>

<style></style>
