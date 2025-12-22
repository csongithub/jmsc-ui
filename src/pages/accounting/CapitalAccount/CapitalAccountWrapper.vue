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
      <q-tab name="accounts" label="Accounts" />
      <q-tab name="statement" label="Transactions" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated class="">
      <q-tab-panel name="accounts"><CapitalAccuont /></q-tab-panel>
      <q-tab-panel name="statement"><CapitalAccountStatement /></q-tab-panel>
    </q-tab-panels>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";
import CapitalAccuont from "./CapitalAccuont.vue";
import CapitalAccountStatement from "./CapitalAccountStatement.vue";

export default {
  name: "CapitalAccountParent",
  mixins: [commonMixin],
  components: { CapitalAccuont, CapitalAccountStatement },
  mounted() {},
  beforeUnmount() {},
  computed: {},
  setup() {
    return {
      tab: ref("accounts"),
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
