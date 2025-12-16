<template>
  <q-layout>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-tab name="entry" label="Entry" :disable="disableTab" />
      <q-tab name="statement" label="Statement" :disable="disableTab" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated class="">
      <q-tab-panel name="entry"><VoucherEntry /></q-tab-panel>
      <q-tab-panel name="statement"><VoucherStatement /></q-tab-panel>
    </q-tab-panels>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import VoucherEntry from "./VoucherEntry.vue";
import VoucherStatement from "./VoucherStatement.vue";

export default {
  name: "Ledger",
  mixins: [commonMixin],
  components: { VoucherEntry, VoucherStatement },
  mounted() {},
  beforeUnmount() {},
  computed: {},
  setup() {
    return {
      tab: ref("entry"),
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
      projects: [],
    };
  },
  methods: {},
};
</script>
