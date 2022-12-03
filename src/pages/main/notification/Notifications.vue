/* eslint-disable vue/no-deprecated-slot-scope-attribute */
<template>
    <div>
      <q-bar class="text-white bg-primary">
        <span>
            Notifications
        </span>
        
        <q-btn flat 
          class="" style="cursor: pointer" icon="refresh" @click="reload">
          <q-tooltip>reload notifications</q-tooltip>
        </q-btn>
      </q-bar>
      <q-banner v-for="(notification, index) of $store.getters['notification/notifications']" :key="index" rounded
        class="my-banner bg-primary q-mt-lg q-ml-md q-mr-md">
        <span><q-icon name="notifications"/> Machine</span>
        <div v-if="notification.entityType === 'MACHINE'" class="bg-grey-3">
          <div class="row q-ma-sm">
            <div class="col-4">
              {{'Name: ' + notification.machine.name}}
            </div>
            <div class="col-4">
              {{'Registration No: ' + notification.machine.registration_no}}
            </div>
            <div class="col-4">
              {{'Machine: ' + notification.machine.machine_type}}
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col-4">
              {{'Engine No: ' + notification.machine.engine_no}}
            </div>
            <div class="col-4">
              {{'Chasis No: ' + notification.machine.chasis_no}}
            </div>
          </div>
        </div>
        <q-bar class="bg-white text-subtitle2">{{notification.notificationMessage}}</q-bar>
      </q-banner>
    </div>
</template>

<script>

import { commonMixin } from "../../../mixin/common"
export default {
  name: 'Notifications',
  mixins: [commonMixin],
  setup () {
    return {
    }
  },
  components: {
  },
  created() {},
  mounted() {
  },
  data() {
    return {
      client_id: this.getClientId()
    };
  },
  methods: {
    reload() {
      this.updateNotificationCache(this.client_id)
    }
  }
};
</script>
