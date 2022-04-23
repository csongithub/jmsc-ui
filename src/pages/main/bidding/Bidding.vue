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
           name="active_bids" label="Active"
           to="/active_bids"
           exact
          />
          <q-route-tab
            name="submitted_bids" label="Submitted"
            to="/submitted_bids"
            exact
          />
          <q-route-tab
            name="accepted_bids" label="Accepted"
            to="/accepted_bids"
            exact
          />
          <q-route-tab
            name="rejected_bids" label="Rejected"
            to="/rejected_bids"
            exact
          />
          <q-route-tab
            name="awarded_bids" label="Awarded"
            to="/awarded_bids"
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
 name: 'Bidding',
  setup () {
    return {
    }
  },
  created() {},
  mounted() {

  },
  data() {
    return {
      tab: ref('active_bids'),
    };
  },
  methods: {
  }
};
</script>
