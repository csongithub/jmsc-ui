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
           name="create" label="Create Payment"
           to="/create_payment"
           exact
          />
          <q-route-tab
            name="draft" label="Draft"
            to="/payment_draft"
            exact
          />
          <q-route-tab
            name="approval" label="Approval"
            to="/payments_approvals"
            exact
          />
          <q-route-tab
            name="history" label="History"
            to="/payments"
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
    this.tab = 'create'
  },
  data() {
    return {
      tab: ref('create'),

    };
  },
  methods: {
  }
};
</script>
