import { defineStore } from "pinia";
import AccountingService from "src/services/accounting/AccountingService";

export const capitalAccountStore = defineStore("capitalAccountStore", {
  state: () => ({
    capitalAccounts: [],
  }),

  actions: {
    async updateCapitalAccounts(accounts) {
      this.capitalAccounts = accounts;
    },

    async loadCapitalAccounts(client_id, force_refresh = true) {
      if (this.capitalAccounts.length === 0 || force_refresh) {
        try {
          const response = await AccountingService.getAllCapitalAccountList(
            client_id
          );
          this.capitalAccounts = response.list;
          return this.capitalAccounts;
        } catch (err) {
          console.error("Failed to load capital accounts", err);
          this.capitalAccounts = [];
          throw err;
        } finally {
        }
      } else {
        return this.capitalAccounts;
      }
    },
  },
});
