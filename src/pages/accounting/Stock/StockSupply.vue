<template>
  <div>
    <q-card class="q-ml-xl">
      <q-form @submit="submit" class="q-gutter-md">
        <q-card-section>
          <div class="row">
            <div class="col-3">
              <q-select
                dense
                outlined
                hide-bottom-space
                label="Select Stock"
                option-label="name"
                :options="stockOptions"
                v-model="stock"
                option-disable="inactive"
                use-input
                input-debounce="0"
                @filter="filterStock"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-red">
                      No Stock Matched
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row text-green" v-if="stock">
            {{ "Balance: " }} {{ stock.balance.toLocaleString("en-IN") }}
            {{ " " + stock.unit + "(s)" }}
          </div>

          <div class="row q-mt-sm">
            <div class="col-1">Supply To:</div>
            <div class="col-1">
              <q-radio
                size="sm"
                class="q-mr-md"
                dense
                v-model="supplyTo"
                val="Project"
                label="Project"
                color="secondary"
              />
              <q-radio
                size="sm"
                dense
                v-model="supplyTo"
                val="Party"
                label="Party/Creditor"
                color="secondary"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section v-if="stock && supplyTo">
          <div class="row q-mb-sm">
            <div class="col-3">
              <q-input
                hide-bottom-space
                dense
                outlined
                v-model="date"
                :rules="[
                  (val) => !!val || '',
                  (val) => /^\d{2}-\d{2}-\d{4}$/.test(val) || '',
                ]"
                label="Date"
                placeholder="dd-mm-yyyy"
                @blur="validate($event.target.value)"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="date"
                        mask="DD-MM-YYYY"
                        minimal
                        lazy-rules
                        @update:model-value="$refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row" v-if="supplyTo === 'Project'">
            <div class="col-3">
              <q-select
                dense
                outlined
                hide-bottom-space
                label-color="secondary"
                :options="projectOptions"
                v-model="selectedProjectId"
                option-disable="inactive"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterProject"
                :placeholder="
                  selectedProjectId === null ? 'select project' : ''
                "
              >
                <template #label
                  ><span class="text-subtitle2">Select Project</span></template
                >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-red">
                      No Project Matched
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row" v-else-if="supplyTo === 'Party'">
            <div class="col-3">
              <q-select
                dense
                outlined
                hide-bottom-space
                label="Select Creditors"
                :options="creditorOptions"
                v-model="selectedCreditorId"
                option-disable="inactive"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterCreditor"
                @update:model-value="getLedgers(true)"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-red">
                      No Creditor Matched
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-3 q-ml-sm">
              <q-select
                dense
                outlined
                hide-bottom-space
                label="Select Ledger"
                option-label="name"
                :options="ledgerOptions"
                v-model="selectedLedger"
                option-disable="inactive"
                use-input
                input-debounce="0"
                @filter="filterLedger"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-red">
                      No Ledger Matched
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-3">
              <q-input
                type="number"
                hide-bottom-space
                dense
                outlined
                v-model="quantity"
                label="Quantity"
                full-width
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val > 0 && val <= Number(stock.balance)) ||
                    'Invalid Figure',
                ]"
                @update:model-value="amount = quantity * stock.price"
              >
                <template v-slot:append>
                  <q-avatar style="width: 50px">
                    {{ stock.unit }}
                  </q-avatar>
                </template>
              </q-input>
            </div>
            <div class="col-1 q-ml-sm">
              <q-input
                type="number"
                hide-bottom-space
                dense
                outlined
                v-model="stock.price"
                label="Price"
                full-width
                lazy-rules
                :rules="[(val) => (val && val > 0) || 'Invalid Price']"
                @update:model-value="amount = quantity * stock.price"
              >
              </q-input>
            </div>
            <div class="col-2 q-ml-sm">
              <q-input
                class="text-bold"
                :readonly="true"
                type="number"
                hide-bottom-space
                dense
                outlined
                v-model="amount"
                label="Total Amount"
                full-width
              >
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-section v-if="stock">
          <q-btn
            dense
            size="sm"
            label="Submit"
            type="submit"
            color="secondary"
            class="text-capitalize q-px-lg"
          />

          <q-btn
            dense
            size="sm"
            label="Reset"
            type="reset"
            @click="reset"
            class="text-capitalize q-ml-sm q-px-lg"
          />
        </q-card-section>
        <!-- <q-card-section>{{ JSON.stringify(stock) }}</q-card-section> -->
      </q-form>
    </q-card>
  </div>
</template>

<script>
import AccountingService from "src/services/accounting/AccountingService";
import { commonMixin } from "../../../mixin/common";
import { filter, filterOnName } from "../Utils/filterUtils";
import { ref } from "vue";
import { creditorStore } from "src/pinia_stores/CreditorStore";
import { projectStore } from "src/pinia_stores/ProjectStore";
import { stockStore } from "src/pinia_stores/StockStore";
import { isBefore } from "../Utils/DateUtils";
export default {
  name: "Stock",
  mixins: [commonMixin],
  setup() {
    return {};
  },
  components: {},
  created() {},
  async mounted() {
    await this.getStocks();
    await this.getAllCreditors();
    await this.getProjects();
  },
  beforeUnmount() {},
  watch: {
    supplyTo(val) {
      this.selectedProjectId = null;
      this.selectedCreditorId = null;
      this.selectedLedger = null;
    },
  },
  data() {
    return {
      clientId: this.getClientId(),
      supplyTo: null,
      stocks: [],
      stockOptions: [],
      projects: [],
      projectOptions: [],
      creditors: [],
      creditorOptions: [],
      ledgers: [],
      ledgerOptions: [],

      date: null,
      stock: null,
      selectedProjectId: null,
      selectedCreditorId: null,
      selectedLedger: null,

      quantity: null,
      amount: null,
    };
  },
  methods: {
    validate(date) {
      if (this.isNullOrUndefined(this.date)) return;
      if (isBefore(this.date, this.stock.creationDate)) {
        this.date = null;
        this.$q.notify({
          message: "Invalid Date",
          caption: "Date can not be before stock opening date",
        });
      }
    },
    async getStocks() {
      await AccountingService.getAllStocks(this.clientId)
        .then((response) => {
          this.stocks.splice(0, this.stocks.length);
          this.stocks = response;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    filterStock(input, update, abort) {
      this.stockOptions = filterOnName(input, update, this.stocks);
    },

    async getProjects() {
      this.projects = await projectStore().loadProjects(this.clientId, false);
    },
    filterProject(input, update, abort) {
      this.projectOptions = filter(input, update, this.projects);
    },

    async getAllCreditors() {
      this.creditors = await creditorStore().loadCreditors(
        this.clientId,
        false,
      );
    },
    filterCreditor(input, update, abort) {
      this.creditorOptions = filter(input, update, this.creditors);
    },

    async getLedgers(refresh) {
      // window.alert("ok");
      this.ledgers = [];
      this.ledgerOptions = [];
      this.selectedLedger = null;
      this.ledgers = await creditorStore().loadLedgers(
        this.clientId,
        this.selectedCreditorId,
        false,
      );
      console.log(JSON.stringify(this.ledgers));
    },
    filterLedger(input, update, abort) {
      this.ledgerOptions = filterOnName(input, update, this.ledgers);
    },

    async submit() {
      let transaction = {
        clientId: this.clientId,
        date: this.date,
        stockId: this.stock.id,
        creditorId: this.selectedCreditorId,
        ledgerId: this.selectedLedger?.id,
        projectId: this.selectedProjectId,
        note:
          this.stock.item +
          " " +
          this.quantity +
          " " +
          this.stock.unit +
          " @" +
          this.stock.price,
        debit: this.quantity,
        credit: 0,
        amount: this.amount,
        entryType: "DEBIT",
        transactionRefNo: null,
      };
      // console.log(JSON.stringify(transaction));
      AccountingService.addStockTransaction(transaction)
        .then(async (response) => {
          if (response) {
            this.$q.notify({
              message: "Stock Updated Successfully",
              color: "secondary",
              position: "bottom",
            });
            this.reset();
            await this.getStocks();
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },

    reset() {
      this.supplyTo = null;
      this.date = null;
      this.stock = null;
      this.selectedProjectId = null;
      this.selectedCreditorId = null;
      this.selectedLedger = null;
      this.quantity = null;
      this.price = null;
      this.amount = null;
    },
  },
};
</script>
