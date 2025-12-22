import { defineStore } from "pinia";
import AccountingService from "src/services/accounting/AccountingService";

export const creditorStore = defineStore("creditorStore", {
  state: () => ({
    creditors: [], //Array [{"label":"AV FUELS","value":10}]
    ledgersCache: [], //[{ creditorid: 2, ledgerList: [{id:2, name:'main'}] }],
  }),

  actions: {
    async fetchCreditorsFromBackend(client_id) {
      const response = await AccountingService.getAllCreditors(client_id);
      this.creditors = response.list;
    },
    getCreditorName(clientId, creditor_id, force_refresh = true) {
      // window.alert(clientId);
      if (this.creditors.length === 0 || force_refresh) {
        this.fetchCreditorsFromBackend(clientId);
      }
      var creditor = null;
      for (let c of this.creditors) {
        if (Number(c.value) === Number(creditor_id)) {
          creditor = c;
          break;
        }
      }
      if (creditor !== null) {
        return creditor.label;
      } else {
        return this.getCreditorName(clientId, creditor_id, true);
      }
    },
    async loadCreditors(client_id, force_refresh = true) {
      if (this.creditors.length === 0 || force_refresh) {
        try {
          this.fetchCreditorsFromBackend(client_id);
          return this.creditors;
        } catch (err) {
          console.error("Failed to load capital accounts", err);
          this.creditors = [];
          throw err;
        } finally {
        }
      } else {
        return this.creditors;
      }
    },

    async getLedgerList(client_id, creditor_id, force_refresh = true) {
      const list = [];
      const ledgers = await this.loadLedgers(
        client_id,
        creditor_id,
        force_refresh
      );
      if (ledgers.length > 0) {
        for (let ledger of ledgers) {
          list.push({
            label: ledger.name,
            value: ledger.id,
          });
        }
      }
      return list;
    },

    async loadLedgers(client_id, creditor_id, force_refresh = true) {
      var ledgers = null;
      var index = null;

      for (var i = 0; i < this.ledgersCache.length; i++) {
        if (creditor_id === this.ledgersCache[i].creditorId) {
          ledgers = this.ledgersCache[i].ledgers;
          index = i;
          break;
        }
      }

      if (!force_refresh && ledgers) {
        return ledgers;
      }
      if (index) this.ledgersCache.splice(index, 1);

      const ledgerList = await AccountingService.getLedgers(
        client_id,
        creditor_id
      );

      this.ledgersCache.push({
        creditorId: Number(creditor_id),
        ledgers: ledgerList,
      });

      return ledgerList;
    },
  },
});
