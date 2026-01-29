<template>
  <q-layout>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey bg-grey-3"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="stock" label="Stock" />
      <q-tab name="supply" label="Supply" />
      <q-tab name="transaction" label="Transactions" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated class="">
      <q-tab-panel name="stock"> <Stock /> </q-tab-panel>
      <q-tab-panel name="supply"> <StockSupply /> </q-tab-panel>
      <q-tab-panel name="transaction"><StockTransaction /></q-tab-panel>
    </q-tab-panels>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";

import Stock from "./Stock.vue";
import StockSupply from "./StockSupply.vue";
import StockTransaction from "./StockTransaction.vue";
export default {
  name: "StockWrapper",
  mixins: [commonMixin],
  components: { Stock, StockSupply, StockTransaction },
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
