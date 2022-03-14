<template>
<div>
  <Bidding/>
  <div  class="q-pa-md">
  {{'This is Accepted Bids Page'}}
  </div>
</div>
</template>

<script>
import { ref } from 'vue'
import Bidding from "../bidding/Bidding.vue"
export default {
  name: 'AcceptedBids',
  setup () {
    return {
    }
  },
  created() {

  },
  mounted() {

  },
  components: {
    Bidding
  },
  data() {
    return {
      
    };
  },
  methods: {

  }
};
</script>
