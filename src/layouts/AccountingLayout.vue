<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar class="glossy">
        <q-toolbar-title class="text-white text-bold">
          <q-icon
            class="q-mr-sm"
            :name="icons.back"
            style="cursor: pointer"
            @click="back"
            color="grey"
          ></q-icon>
          <span class="text-title text-grey"> {{ "JMSC" }}</span>
        </q-toolbar-title>

        <q-space />
        <span class="text-grey text-subtitle2 q-mr-sm"
          >Welcome {{ userName }} !</span
        >
        <q-icon
          :name="icons.logout"
          color="red"
          style="cursor: pointer"
          size="xs"
          @click="logout"
        ></q-icon>
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
            align="left"
            narrow-indicator
            active-bg-color=""
          >
            <q-tab name="dashboard" label="Dashboard" />
            <q-tab name="project" label="Projects" />
            <q-tab name="capitalaccount" label="Capitals" />
            <q-tab name="voucher" label="Voucher" />
            <q-tab name="creditor" label="Creditors" />
            <q-tab name="ledger" label="Leadger" />
            <q-tab name="stock" label="Stocks" />
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
              <CapitalAccountWrapper></CapitalAccountWrapper>
            </q-tab-panel>
            <q-tab-panel name="voucher">
              <Voucher></Voucher>
            </q-tab-panel>
            <q-tab-panel name="creditor">
              <CreditorWrapper></CreditorWrapper>
            </q-tab-panel>
            <q-tab-panel name="ledger">
              <Leadger></Leadger>
            </q-tab-panel>
            <q-tab-panel name="stock">
              <StockWrapper></StockWrapper>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from "quasar";
import { commonMixin } from "../mixin/common";
import Dashboard from "../pages/accounting/Dashboard.vue";
import Project from "../pages/accounting/project/Project.vue";
import CreditorWrap from "../pages/accounting/Creditor/Creditor.vue";
import Leadger from "../pages/accounting/Ledger/Leadger.vue";
import Voucher from "src/pages/accounting/Voucher/Voucher.vue";
import CapitalAccountWrapper from "src/pages/accounting/CapitalAccount/CapitalAccountWrapper.vue";
import StockWrapper from "src/pages/accounting/Stock/StockWrapper.vue";
import { fasBackward, fasPowerOff } from "@quasar/extras/fontawesome-v5";

import { ref } from "vue";
import CreditorWrapper from "src/pages/accounting/Creditor/CreditorWrapper.vue";

export default {
  mixins: [commonMixin],
  components: {
    Dashboard,
    Project,
    CreditorWrapper,
    Leadger,
    Voucher,
    CapitalAccountWrapper,
    StockWrapper,
  },
  created() {},
  mounted() {
    if (this.isAdmin()) {
      this.userName = "Admin";
    } else {
      this.userName = this.getUser().name;
    }
  },
  setup() {
    return {
      tab: ref("dashboard"),
      icons: {
        logout: fasPowerOff,
        back: fasBackward,
      },
    };
  },
  data() {
    return {
      userName: null,
    };
  },
  methods: {
    logout() {
      LocalStorage.clear();
      this.openLoginLayout();
    },
    back() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style></style>
