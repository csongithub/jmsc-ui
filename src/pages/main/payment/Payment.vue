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
           :icon="icon.pencil"
           exact
          />
          <q-route-tab
            name="print" label="Print Challan"
            to="/print_payment"
            icon="print"
            exact
          />
          <q-route-tab
            name="printed" label="History"
            to="/printed_payment"
            :icon="icon.print"
            exact
          />
        </q-tabs>
      </q-card>
    </div>  
  </div>
</template>

<script>
import { ref } from 'vue'
import {
  fasPencilAlt,
  fasPrint  
} from "@quasar/extras/fontawesome-v5";
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
      tab: ref('create'),
      icon: {
        pencil: fasPencilAlt,
        print: fasPrint
      }
    };
  },
  methods: {
  }
};
</script>
