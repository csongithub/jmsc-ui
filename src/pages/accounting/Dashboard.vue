<template>
  <q-layout>
    <q-page-container>
      <q-page class="row justify-center items-center bg-white text-bold">
        {{ "Coming Soon" }}
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { commonMixin } from "src/mixin/common";

export default {
  mixins: [commonMixin],
  components: {},
  async mounted() {
    this.initiateData();
  },
  data() {
    return {};
  },
  methods: {
    async initiateData() {},
  },
};
</script>

<style></style>
