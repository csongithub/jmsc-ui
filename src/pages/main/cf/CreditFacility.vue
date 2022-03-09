<template>
  <div class="">
    <div class="q-gutter-y-md" >
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-route-tab
           name="all" label="All"
           to="/all_cf"
           exact
          />
          <q-route-tab
            name="bg" label="Bank Guarantee"
            to="/bank_guarantee"
            exact
          />
          <q-route-tab
            name="fd" label="Fixed Deposit"
            to="/fixed_deposit"
            exact
          />
          <q-route-tab
            name="nsc" label="NSC"
            to="/nsc"
            exact
          />
        </q-tabs>
      </q-card>
    </div>  
  </div>
</template>

<script>
import { ref } from 'vue'
export default {

  setup () {
    return {
    }
  },
  created() {},
  mounted() {

  },
  data() {
    return {
      tab: ref('all')
    };
  },
  methods: {
  }
};
</script>
