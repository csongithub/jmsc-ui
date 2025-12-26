import { defineStore } from "pinia";
import AccountingService from "src/services/accounting/AccountingService";

export const creditorStore = defineStore("creditorStore", {
  state: () => ({
    creditors: [], //Array [{"label":"AV FUELS","value":10}]
    ledgersCache: new Map(), //[{ creditorid: 2, ledgerList: [{id:2, name:'main'}] }],
  }),

  actions: {
    async fetchCreditorsFromBackend(client_id) {
      const response = await AccountingService.getAllCreditors(client_id);
      this.creditors = response.list;
    },
    async getCreditorInternal(clientId, creditor_id, force_refresh) {
      // window.alert(clientId);
      if (this.creditors.length === 0 || force_refresh) {
        await this.fetchCreditorsFromBackend(clientId);
      }
      var creditor = null;
      for (let c of this.creditors) {
        if (Number(c.value) === Number(creditor_id)) {
          creditor = c;
          break;
        }
      }
      return creditor;
    },
    async getCreditorAddress(clientId, creditor_id, force_refresh = true) {
      const creditor = await this.getCreditorInternal(
        clientId,
        creditor_id,
        force_refresh
      );
      if (creditor !== null) {
        return creditor.text1;
      }
    },
    async getCreditorName(clientId, creditor_id, force_refresh = true) {
      const creditor = await this.getCreditorInternal(
        clientId,
        creditor_id,
        force_refresh
      );

      if (creditor !== null) {
        return creditor.label;
      }
    },
    async loadCreditors(client_id, force_refresh = true) {
      if (this.creditors.length === 0 || force_refresh) {
        try {
          await this.fetchCreditorsFromBackend(client_id);
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

      var isLedgerpresent = this.ledgersCache.has(creditor_id);
      if (isLedgerpresent) {
        ledgers = this.ledgersCache.get(creditor_id);
      }

      if (!force_refresh && ledgers !== null) {
        return ledgers;
      }
      if (isLedgerpresent) this.ledgersCache.delete(creditor_id);

      const ledgerList = await AccountingService.getLedgers(
        client_id,
        creditor_id
      );

      this.ledgersCache.set(creditor_id, ledgerList);

      return ledgerList;
    },
    async getLedgerName(client_id, creditor_id, ledger_id, forece_refresh) {
      var ledgers = null;

      if (this.ledgersCache.has(creditor_id))
        ledgers = this.ledgersCache.get(creditor_id);

      if (ledgers !== null && ledgers.length > 0) {
        for (let l of ledgers) {
          if (l.id === ledger_id) {
            return l.name;
          }
        }
      }

      const ledgerList = await AccountingService.getLedgers(
        client_id,
        creditor_id
      );
      this.ledgersCache.set(creditor_id, ledgerList);

      if (ledgerList !== null && ledgerList.length > 0) {
        for (let l of ledgerList) {
          if (l.id === ledger_id) {
            return l.name;
          }
        }
      }
    },
  },
});
