<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar class="glossy">
        <q-toolbar-title class="text-white text-bold">
          {{ "JMSC-ACCOUNTING" }}
        </q-toolbar-title>
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
            <q-tab name="capitalaccount" label="Capitals" />
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
            <q-tab-panel name="capitalaccount">
              <CapitalAccount></CapitalAccount>
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
  </q-layout>
</template>

<script>
import { commonMixin } from "../mixin/common";
import Dashboard from "../pages/accounting/Dashboard.vue";
import Project from "../pages/accounting/project/Project.vue";
import Creditor from "../pages/accounting/Creditor/Creditor.vue";
import Leadger from "../pages/accounting/Ledger/Leadger.vue";
import CapitalAccount from "src/pages/accounting/CapitalAccount/CapitalAccuont.vue";

import { ref } from "vue";

export default {
  mixins: [commonMixin],
  components: {
    Dashboard,
    Project,
    Creditor,
    Leadger,
    CapitalAccount,
  },
  created() {},
  mounted() {},
  setup() {
    return {
      tab: ref("dashboard"),
    };
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style></style>
