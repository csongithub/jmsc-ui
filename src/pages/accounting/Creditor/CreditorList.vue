<template>
  <q-layout> </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";

export default {
  name: "CreditorList",
  mixins: [commonMixin],
  components: {},
  mounted() {},
  beforeUnmount() {},
  computed: {},
  setup() {
    return {};
  },
  data() {
    return {
      clientId: this.getClientId(),
    };
  },
  methods: {},
};
</script>
