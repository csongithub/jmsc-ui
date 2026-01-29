import { defineStore } from "pinia";
import AccountingService from "src/services/accounting/AccountingService";

export const stockStore = defineStore("stockStore", {
  state: () => ({
    stockList: [],
  }),

  actions: {
    async loadStocks(client_id, force_refresh = true) {
      if (this.stockList.length === 0 || force_refresh) {
        try {
          const response = await AccountingService.getStockList(client_id);
          this.stockList = response.list;
          return this.stockList;
        } catch (err) {
          console.error("Failed to load projects", err);
          this.stockList = [];
          throw err;
        } finally {
        }
      } else {
        return this.stockList;
      }
    },

    async getStockUnit(stock_id) {
      const stock = this.stockList.find((stock) => stock.value === stock_id);
      return stock.text2;
    },
    async getStockBalance(stock_id) {
      const stock = this.stockList.find((stock) => stock.value === stock_id);
      return stock.text1;
    },
  },
});
