<template>
  <q-layout>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey bg-grey-3"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="stock" label="Stock" />
      <q-tab name="transaction" label="Transactions" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated class="">
      <q-tab-panel name="stock"> <Stock /> </q-tab-panel>
      <q-tab-panel name="transaction">transaction</q-tab-panel>
    </q-tab-panels>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";

import Stock from "./Stock.vue";
export default {
  name: "StockWrapper",
  mixins: [commonMixin],
  components: { Stock },
  mounted() {},
  beforeUnmount() {},
  computed: {},
  setup() {
    return {
      tab: ref("stock"),
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
    };
  },
  methods: {},
};
</script>
