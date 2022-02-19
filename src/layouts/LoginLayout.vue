<template>
  <q-layout>
    <q-page-container>
      <q-page class="row justify-center items-center bg-white">
        <Login></Login>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Login from "../pages/auth/Login";
export default {
  components: {
    Login
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style></style>
