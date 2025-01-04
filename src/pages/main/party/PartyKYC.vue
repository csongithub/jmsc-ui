<template>
  <div v-if="party_id !== null" class="q-gutter-sm">
    <div class="row">
      <div class="col-2"><span>Is Party KYC Required ?</span></div>
      <div class="col">
        <q-radio v-model="kyc_required" val="true" label="Yes" />
        <q-radio v-model="kyc_required" val="false" label="No" />
      </div>
      <!-- <div class="col"></div> -->
    </div>
    <!-- {{ JSON.stringify(party) }} -->
  </div>
  <div v-else class="q-gutter-sm">
    <p class="text-center">Please add party</p>
  </div>
</template>

<script>
import PartyService from "../../../services/PartyService";
import { commonMixin } from "../../../mixin/common";
import { ref } from "vue";
export default {
  name: "Site",
  mixins: [commonMixin],
  props: {
    party: {
      type: Object,
      required: true,
      default: null,
    },
  },
  computed: {},
  setup() {
    return {};
  },
  components: {},
  created() {},
  mounted() {
    if (this.party.kyc_required) {
      this.kyc_required = "true";
    } else {
      this.kyc_required = "false";
    }
  },
  data() {
    return {
      client_id: this.getClientId(),
      kyc_required: null,
    };
  },
  methods: {},
};
</script>
