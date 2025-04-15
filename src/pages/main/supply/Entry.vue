<template>
  <div>
    <q-select
      dense
      label="Select Supplier"
      outlined=""
      v-model="selected_supplier"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="suppliers"
      option-label="display_name"
      option-value="id"
      @update:model-value="getLedger"
    >
    </q-select>
  </div>
  <div v-if="selected_supplier !== null && ledgerExist"></div>
  <div
    v-if="selected_supplier !== null && !ledgerExist"
    class="q-ml-sm q-mt-md"
  >
    <div class="row">
      <div class="col">
        Ledger does not exist, enter an amount (Opening Balance) to create a
        ledger
      </div>
    </div>

    <div class="row">
      <div class="col-2">
        <q-input
          dense
          outlined
          v-model="opening_balance"
          label="enter amount"
          full-width
          type="number"
        />
      </div>
      <div class="col-2 q-ml-md">
        <q-btn
          class="text-capitalize"
          :disable="opening_balance === null || opening_balance === 0"
          color="primary"
          label="Create Ledger"
          @click="createLedger"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
// import PartyService from "../../../services/PartyService";
import SupplierService from "../../../services/SupplierService";
import { commonMixin } from "../../../mixin/common";
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { matCurrencyRupee, matDelete } from "@quasar/extras/material-icons";
import { ref } from "vue";
export default {
  name: "Supplier",
  mixins: [commonMixin],
  setup() {
    return {
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        rupee: matCurrencyRupee,
        delete: matDelete,
      },
    };
  },
  components: {},
  created() {},
  mounted() {
    this.getAllSuppliers();
  },
  data() {
    return {
      client_id: this.getClientId(),
      admin: this.isAdmin(),
      permissions: this.getPermissions(),
      pagination: { rowsPerPage: 25 },
      filter: "",
      suppliers: [],
      selected_supplier: null,
      selected_supplier_id: null,
      ledgerExist: false,
      opening_balance: 0,
    };
  },
  methods: {
    getAllSuppliers() {
      SupplierService.all(this.client_id)
        .then((response) => {
          this.suppliers.splice(0, this.suppliers.length);
          for (let s of response) {
            this.suppliers.push({
              display_name:
                this.getPartyNames(s.partyId, "nick_name") +
                " (" +
                this.getPartyNames(s.partyId, "name") +
                ")",
              id: s.id,
            });
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    getLedger(supplier) {
      this.supplier_id = supplier.id;
      this.opening_balance = 0;
      SupplierService.entryExistInLedger(this.client_id, this.supplier_id)
        .then((response) => {
          if (response) {
            this.ledgerExist = true;
          } else {
            this.ledgerExist = false;
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
    createLedger() {
      let entry = {
        clientId: this.client_id,
        supplierId: this.supplier_id,
        creditAmount: this.opening_balance,
        remark: "Opening Balance",
      };
      SupplierService.createLedger(entry)
        .then((response) => {
          if (response) {
            this.ledgerExist = true;
          } else {
            this.ledgerExist = false;
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
  },
};
</script>
