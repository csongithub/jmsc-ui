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
           name="manage" label="Manage"
           to="/manage_party_accounts"
           exact
          />
          <q-route-tab
            name="import" label="Import"
            to="/import_party_accounts"
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
      tab: ref('manage')
    };
  },
  methods: {
  }
};
</script>
