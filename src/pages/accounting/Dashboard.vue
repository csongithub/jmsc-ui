<template>
  <q-layout>
    {{ "Project: " + JSON.stringify(projects) }}
    <br />
    <br />
    {{ "Creditors: " + JSON.stringify(creditors) }}
    <br />
    <br />
    {{ "Creditors: " + JSON.stringify(ledgers) }}
    <q-page-container>
      <q-page class="row justify-center items-center bg-white">
        {{ "This is Dashboard Page" }}
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { commonMixin } from "src/mixin/common";
import { projectStore } from "../../pinia_stores/ProjectStore";
import { creditorStore } from "src/pinia_stores/CreditorStore";

export default {
  mixins: [commonMixin],
  components: {},
  async mounted() {
    this.initiateData();
  },
  data() {
    return {
      projects: [],
      creditors: [],
      ledgers: [],
    };
  },
  methods: {
    async initiateData() {
      this.projects = await projectStore().loadProjects(
        this.getClientId(),
        false
      );
      this.creditors = await creditorStore().loadCreditors(
        this.getClientId(),
        false
      );

      this.ledgers = await creditorStore().loadLedgers(
        this.getClientId(),
        14,
        false
      );
    },
  },
};
</script>

<style></style>
