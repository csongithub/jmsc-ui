<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar  class="glossy">
        <q-btn
          flat
          dense
          glossy
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
         JMSC Banking
        </q-toolbar-title>

        <div></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
     :width="200"
      :breakpoint="500"
      bordered
      content-class="bg-grey-3"
    >
      <q-scroll-area
        style="height: calc(100% - 150px);  border-right: 1px solid #ddd"
      >
        <q-list padding>
          <q-item exact clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Accounts</q-item-section>
          </q-item>
          <q-item exact clickable v-ripple to="/party_accounts">
            <q-item-section avatar>
              <q-icon :name="icons.creditors" />
            </q-item-section>
            <q-item-section>Party</q-item-section>
          </q-item>
           <q-item exact clickable v-ripple to="/payment">
            <q-item-section avatar>
              <q-icon :name="icons.plan" />
            </q-item-section>
            <q-item-section>Payments</q-item-section>
          </q-item>
          <q-separator></q-separator>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from "quasar";
import { commonMixin } from "../mixin/common";

import {
  fasCreditCard,
  fasUserFriends  
} from "@quasar/extras/fontawesome-v5";
export default {
  name: "MainLayout",
  mixins: [commonMixin],
  components: {
    // NewPost
  },

  created() {},
  mounted() {
    //if client has not logged in, then rout to login page, else open landing page
    if (!this.getClient()) {
      this.openLoginLayout();
    }
  },
  data() {
    return {
      leftDrawerOpen: true,
      client: null,
      tab: "home",
      icons: {
        plan: fasCreditCard,
        creditors: fasUserFriends
      }
    };
  },
  methods: {
    getClient() {
      //Check if client has already logged in, then get client form local storage
      if (this.client === null && LocalStorage.getItem("auth")) {
        let auth =  LocalStorage.getItem("auth")
        this.client = auth.client
        // console.log(JSON.stringify(this.client))
        return true;
      } else {
        return false;
      }
    },
    rout(path) {
      this.$router.push({ path: path });
    }
  }
};
</script>
