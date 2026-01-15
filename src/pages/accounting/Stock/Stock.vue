<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      :rows="stocks"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      :filter="filter"
      wrap-cells
      bordered
      dense
    >
      <template v-slot:loading>
        <q-inner-loading
          v-if="loading"
          showing
          color="primary"
          label="Loading..."
          size="sm"
        />
      </template>
      <template v-slot:top-left>
        <q-btn
          class="q-mt-sm q-mr-sm text-capitalize"
          color="secondary"
          label="New Stock"
          size="10px"
          @click="openDialog('add', null)"
          :icon="icons.add"
        />
      </template>
      <template v-slot:top-right>
        <q-input
          class="q-ml-sm"
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Search Stock"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td style="width: 90px">
            <q-btn
              size="xs"
              color="secondary"
              outline
              dense
              @click="props.expand = !props.expand"
              :icon="!props.expand ? icons.expand : icons.collaps"
            >
            </q-btn>
          </q-td>
          <q-td key="stockName" :props="props">
            {{ props.row.stockName }}
          </q-td>
          <!-- <q-td key="stockUnit" :props="props">{{ props.row.stockUnit }}</q-td> -->
          <q-td key="creationDate" :props="props">{{
            props.row.creationDate
          }}</q-td>
          <q-td key="balance" :props="props">{{
            props.row.balance.toLocaleString("en-IN") +
            " " +
            props.row.stockUnit
          }}</q-td>
          <q-td key="lastUpdated" :props="props">{{
            props.row.lastUpdated
          }}</q-td>
          <q-td key="status" :props="props">{{ props.row.status }}</q-td>

          <q-td>
            <q-icon
              color="grey"
              class="q-ma-none q-pa-none pointer"
              :name="icons.edit"
              @click="editAccount(props.row)"
              size="10px"
            />
            <!-- <span
              class="q-ml-sm text-blue"
              style="cursor: pointer"
              @click="openStatement(props.row)"
              >view</span
            > -->
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props"> ok </q-tr>
      </template>
    </q-table>
  </div>
  <div>
    <q-dialog
      v-model="open"
      persistent
      @hide="onHide"
      @before-show="beforeShow"
      ref="newStockRef"
      position="right"
    >
      <q-card style="width: 300px; max-width: 80vw">
        <q-bar class="bg-secondary text-white text-weight-light text-subtitle2">
          {{ dialog_label }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-form @submit="create" @reset="reset" class="q-gutter-md">
            <div class="row">
              <q-input
                hide-bottom-space
                class="full-width"
                dense
                outlined
                v-model="stock.stockName"
                label="Stock Name"
                full-width
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']"
                maxlength="20"
                counter
                @update:model-value="
                  (val) => {
                    stock.stockName = val.toUpperCase();
                  }
                "
              />
            </div>
            <div class="row">
              <q-input
                hide-bottom-space
                class="full-width"
                dense
                outlined
                v-model="stock.stockUnit"
                label="Stock Unit"
                full-width
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']"
                maxlength="10"
                counter
              />
            </div>

            <div class="row">
              <q-input
                :disable="mode === 'edit'"
                class="full-width"
                hide-bottom-space
                dense
                outlined
                v-model="stock.creationDate"
                :rules="[
                  (val) => !!val || '',
                  (val) => /^\d{2}-\d{2}-\d{4}$/.test(val) || '',
                ]"
                label="Stock Opening Date"
                placeholder="dd-mm-yyyy"
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
                        v-model="stock.creationDate"
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
            <div class="row">
              <q-input
                :disable="mode === 'edit'"
                type="number"
                class="full-width"
                hide-bottom-space
                dense
                outlined
                v-model="stock.balance"
                label="Openeing Balance"
                full-width
                lazy-rules
                :rules="[(val) => (val && val >= 0) || '']"
              />
            </div>
            <div class="row">
              <q-select
                class="full-width"
                dense
                outlined
                hide-bottom-space
                label="Status"
                label-color="secondary"
                :options="['RUNNING', 'CLOSE']"
                v-model="stock.status"
                option-disable="inactive"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']"
              />
            </div>

            <div>
              <q-space />
              <q-btn
                dense
                size="sm"
                :label="submitButtonLabel"
                type="submit"
                color="secondary"
                class="text-capitalize q-px-lg"
              />

              <q-btn
                v-if="!(mode === 'edit')"
                dense
                size="sm"
                label="Reset"
                type="reset"
                class="text-capitalize q-ml-sm q-px-lg"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import AccountingService from "src/services/accounting/AccountingService";
import { commonMixin } from "../../../mixin/common";
import {
  fasPlus,
  fasEdit,
  fasPlusSquare,
  fasMinusSquare,
} from "@quasar/extras/fontawesome-v5";
import { ref } from "vue";
import { capitalAccountStore } from "src/pinia_stores/CapitalAccountStore";
export default {
  name: "Stock",
  mixins: [commonMixin],
  setup() {
    return {
      selected: ref([]),

      columns: [
        {
          name: "expand",
          align: "left",
          label: "",
          field: "expand",
          sortable: false,
        },
        {
          name: "stockName",
          align: "left",
          label: "Stock Name",
          field: "stockName",
          sortable: true,
        },

        // {
        //   name: "stockUnit",
        //   align: "left",
        //   label: "Stock Unit",
        //   field: "stockUnit",
        //   sortable: true,
        // },
        {
          name: "creationDate",
          align: "left",
          label: "Stock Opening Date",
          field: "creationDate",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance",
          field: "balance",
          sortable: true,
        },

        {
          name: "lastUpdated",
          align: "left",
          label: "Last Transaction",
          field: "lastUpdated",
        },

        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
        },
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        expand: fasPlusSquare,
        collaps: fasMinusSquare,
      },
    };
  },
  components: {},
  created() {},
  mounted() {
    this.getAllStocks(true);
  },
  beforeUnmount() {},
  data() {
    return {
      client_id: this.getClientId(),
      pagination: { rowsPerPage: 20 },
      grid: true,
      filter: "",
      loading: true,
      stocks: [],
      stock: this.newStock(),
      open: false,
      mode: "add",
      dialog_label: "New Stock",
      submitButtonLabel: "Create",
    };
  },
  methods: {
    expand(row) {},
    newStock() {
      return {
        id: null,
        clientId: this.client_id,
        stockName: null,
        stockUnit: null,
        balance: null,
        lastUpdated: null,
        creationDate: null,
        status: null,
      };
    },
    async getAllStocks(refresh) {
      this.loading = true;
      await AccountingService.getAllStocks(this.client_id)
        .then((response) => {
          this.stocks.splice(0, this.stocks.length);
          this.stocks = response;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.fail(this.getErrorMessage(err));
        });

      // await capitalAccountStore().loadCapitalAccounts(this.client_id, refresh);
    },
    async create() {
      this.stock.clientId = this.client_id;
      AccountingService.createStock(this.stock)
        .then((response) => {
          if (this.mode === "add") {
            this.success("Stock create Successfully");
          } else if (this.mode === "edit") {
            this.success("Stock Updated Successfully");
          }
          this.getAllStocks(true);
          this.open = false;
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    editAccount(row) {
      this.stock = row;
      this.dialog_label = "Update Stock";
      this.submitButtonLabel = "Update";
      this.open = true;
      this.mode = "edit";
    },
    beforeShow() {},
    openDialog(mode, row) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialog_label = "New Stock";
        this.submitButtonLabel = "Create";
      }
      this.open = true;
    },
    onHide() {
      this.reset();
      this.mode = "add";
    },
    reset() {
      this.stock = this.newStock();
    },
  },
};
</script>
