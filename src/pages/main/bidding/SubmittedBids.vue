<template>
<div>
  <Bidding/>
  <div  class="q-pa-md">
  {{'This is Submitted Bids Page'}}
  </div>
</div>
</template>
<script>
import { ref } from 'vue'
import Bidding from "../bidding/Bidding.vue"
export default {
  name: 'SubmittedBids',
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
