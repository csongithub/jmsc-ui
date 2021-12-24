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
            name="print" label="Payemnt Draft"
            to="/print_payment"
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
      tab: ref('create')
    };
  },
  methods: {
  }
};
</script>
