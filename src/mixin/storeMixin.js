import { creditorStore } from "src/pinia_stores/CreditorStore";
import { LocalStorage } from "quasar";
export const storeMixin = {
  data() {
    return {
      cacheChanged: false,
      clientId: LocalStorage.getItem("auth").client.id,
    };
  },
  methods: {
    async getCreditorNameFromStore(creditorId) {
      window.alert(this.clientId);
      window.alert(clientId);
      return await creditorStore().getCreditorName(
        this.clientId,
        creditorId,
        false
      );
    },
  },
};
