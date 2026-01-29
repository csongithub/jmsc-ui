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
      <q-tab name="create" label="Create" />
      <q-tab name="view" label="View" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated class="">
      <q-tab-panel name="create"> <Creditor /> </q-tab-panel>
      <q-tab-panel name="view"> <CreditorList /> </q-tab-panel>
    </q-tab-panels>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";
import Creditor from "./Creditor.vue";
import CreditorList from "./CreditorList.vue";

export default {
  name: "StockWrapper",
  mixins: [commonMixin],
  components: { Creditor, CreditorList },
  mounted() {},
  beforeUnmount() {},
  computed: {},
  setup() {
    return {
      tab: ref("create"),
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
