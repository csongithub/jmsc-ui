<template>
  <q-layout>
    <q-form
      @submit="saveVoucher"
      @reset="reset"
      class="q-gutter-md"
      ref="myForm"
    >
      <q-table
        ref="myTable"
        flat
        dense
        bordered
        :rows="items"
        :columns="columns"
        row-key="name"
        binary-state-sort
        :pagination="pagination"
      >
        <template v-slot:top="">
          <q-input
            filled
            class=""
            style="max-width: 150px"
            hide-bottom-space
            dense
            outlined
            label="Voucher Date"
            v-model="voucher.date"
            :rules="[
              (val) => !!val || 'required',
              (val) => /^\d{2}-\d{2}-\d{4}$/.test(val) || 'Invalid date format',
            ]"
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
                    v-model="voucher.date"
                    mask="DD-MM-YYYY"
                    minimal
                    lazy-rules
                    @update:model-value="$refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            class="q-ml-sm"
            filled
            style="max-width: 200px"
            v-model="voucher.voucherNo"
            dense
            outlined
            placeholder="Voucher No."
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'required']"
            hide-bottom-space
          />
          <q-select
            style="max-width: 200px"
            class="q-ml-sm"
            label="Capital"
            filled
            dense
            outlined
            hide-bottom-space
            :options="capitalOptions"
            v-model="voucher.capitalAccountId"
            option-disable="inactive"
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="filterCapital"
            hide-dropdown-icon
            lazy-rules
            :rules="[(val) => val > 0 || 'required']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-red">
                  No Capital Account Matched
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            style="max-width: 250px"
            label="Project"
            filled
            class="q-ml-sm"
            dense
            outlined
            hide-bottom-space
            :options="projectOptions"
            v-model="voucher.projectId"
            option-disable="inactive"
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="filterProject"
            hide-dropdown-icon
            lazy-rules
            :rules="[(val) => val > 0 || 'required']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-red">
                  No Project Matched
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </template>
        <template v-slot:bottom>
          <q-btn
            class="text-secondary"
            label="add"
            @click="addItem"
            size="10px"
          />
          <q-space />
          <q-btn
            color="secondary"
            class="text-secondary text-capitalize q-ml-md float-right"
            label="Save"
            size="10px"
            type="submit"
          />
          <q-btn
            size="10px"
            label="Reset"
            type="reset"
            class="text-capitalize q-ml-sm"
          />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" ref="itmesRef">
            <q-td key="item" :props="props">
              <q-input
                class="custom-small-input"
                v-model="props.row.item"
                dense
                outlined
                placeholder="i.e. milk or vegetables"
                hide-bottom-space
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']"
                style="width: 300px"
              />
            </q-td>
            <q-td key="amount" :props="props">
              <q-input
                class="custom-small-input"
                ref="rateRef"
                type="number"
                v-model="props.row.amount"
                dense
                outlined
                placeholder="i.e. 250"
                hide-bottom-space
                lazy-rules
                :rules="[(val) => val > 0 || '']"
                style="max-width: 100px"
              />
            </q-td>
            <q-td key="group" :props="props">
              <q-select
                class="custom-small-select"
                dense
                outlined
                hide-bottom-space
                :options="groupOptions"
                v-model="props.row.group"
                option-disable="inactive"
                use-input
                input-debounce="0"
                @filter="filterList"
                lazy-rules
                :rules="[(val) => val !== null || '']"
                hide-dropdown-icon
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-red">
                      No Creditor Matched
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-td>
            <q-td key="creditorId" :props="props">
              <q-select
                :disable="props.row.group !== 'Party Advance'"
                class="custom-small-select"
                dense
                outlined
                hide-bottom-space
                :options="creditorOptions"
                v-model="props.row.creditorId"
                option-disable="inactive"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterCreditor"
                @update:model-value="getLedgers(props.row)"
                hide-dropdown-icon
                lazy-rules
                :rules="[(val) => val > 0 || '']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-red">
                      No Creditor Matched
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-td>
            <q-td key="ledgerId" :props="props">
              <q-select
                :disable="isNullOrUndefined(props.row.creditorId)"
                class="custom-small-select"
                dense
                outlined
                hide-bottom-space
                :options="props.row.ledgerOptions"
                v-model="props.row.ledgerId"
                option-disable="inactive"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="
                  (val, update, abort) =>
                    filterLedger(val, update, abort, props.row)
                "
                hide-dropdown-icon
                lazy-rules
                :rules="[(val) => val > 0 || '']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-red">
                      No Ledger Matched
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-td>
            <q-td key="action" :props="props">
              <q-icon
                color="red"
                class="pointer"
                :name="icons.delete"
                size="10px"
                @click="deleteItem(props.rowIndex)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-form>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import { filter, filterFn } from "../Utils/filterUtils";
import { projectStore } from "../../../pinia_stores/ProjectStore";
import { capitalAccountStore } from "src/pinia_stores/CapitalAccountStore";
import { creditorStore } from "src/pinia_stores/CreditorStore";
import { fasTrash } from "@quasar/extras/fontawesome-v5";

export default {
  name: "VoucherEntry",
  mixins: [commonMixin],
  components: {},
  async mounted() {
    this.initiateData();
  },

  beforeUnmount() {},
  computed: {
    totalVaoucherAmount() {
      return this.items.reduce((sum, i) => sum + Number(i.amount), 0);
    },
  },
  setup() {
    return {
      tab: ref("entry"),
      columns: [
        { name: "item", align: "left", label: "Description", field: "item" },
        {
          name: "amount",
          align: "left",
          label: "Amount",
          field: "amount",
          format: (val) => `${val.toLocaleString("en-IN")}`,
        },
        {
          name: "group",
          align: "left",
          label: "Category",
          field: "group",
        },
        {
          name: "creditorId",
          align: "left",
          label: "Creditor",
          field: "creditorId",
        },
        {
          name: "ledgerId",
          align: "left",
          label: "Ledger",
          field: "ledgerId",
        },
        { name: "action", align: "left", label: "", field: "action" },
      ],
      icons: {
        delete: fasTrash,
      },
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
      pagination: { rowsPerPage: 100 },
      voucherDate: null,
      voucherProject: null,
      voucher: this.newVoucher(),
      items: this.emptyItems(),
      projects: [],
      capitals: [],
      projectOptions: [],
      capitalOptions: [],

      creditors: [],
      creditorOptions: [],

      groupOptions: [],
      groups: [
        "Party Advance",
        "Bank",
        "BikeRent",
        "Vehicle Maintenace.",
        "Car Rent",
        "Diesel",
        "Departmenatal",
        "Water",
        "Equipment Purchage",
        "Electricity Bill",
        "Food & Snacks",
        "GST",
        "Ration",
        "House Rent",
        "House HoldItem",
        "Labour",
        "Mobile Recharge",
        "Milk & Vegetables",
        "MachineRent",
        "Petrol",
        "Personal Grooming",
        "Personal Payment",
        "Site Material",
        "Salary",
        "Khoraki",
        "Other",
      ],
    };
  },
  methods: {
    newVoucher() {
      return {
        clientId: this.getClientId(),
        id: null,
        voucherNo: null,
        date: null,
        items: null,
        list: null,
        amount: null,
        capitalAccountId: null,
        projectId: null,
        status: "CREATED",
        creator: null,
        approver: null,
      };
    },
    emptyItems() {
      return [
        {
          item: null,
          amount: 0,
          group: null,
          creditorId: null,
          ledgerId: null,
        },
      ];
    },
    async initiateData() {
      this.projects = await projectStore().loadProjects(
        this.getClientId(),
        false
      );

      this.capitals = await capitalAccountStore().loadCapitalAccounts(
        this.getClientId(),
        false
      );

      this.creditors = await creditorStore().loadCreditors(
        this.getClientId(),
        false
      );
    },

    filterProject(input, update, abort) {
      this.projectOptions = filter(input, update, this.projects);
    },
    filterCapital(input, update, abort) {
      this.capitalOptions = filter(input, update, this.capitals);
    },
    filterCreditor(input, update, abort) {
      this.creditorOptions = filter(input, update, this.creditors);
    },
    filterLedger(input, update, abort, row) {
      row.ledgerOptions = filter(input, update, row.ledgers);
    },
    async getLedgers(row) {
      row.ledgers = await creditorStore().getLedgerList(
        this.getClientId(),
        row.creditorId,
        false
      );
      row.ledgerOptions = [];
    },
    filterList(input, update, abort) {
      this.groupOptions = filterFn(input, update, this.groups);
    },

    newitem() {
      return {
        item: null,
        amount: 0,
        group: null,
        creditorId: null,
        ledgerId: null,
      };
    },
    addItem() {
      this.items.push(this.newitem());
    },
    deleteItem(index) {
      this.items.splice(index, 1);
      if (this.items.length === 0) {
        this.items.push({
          item: null,
          amount: 0,
          group: null,
          creditorId: null,
          ledgerId: null,
        });
      }
    },
    reset() {
      this.voucher = this.newVoucher();
      this.items = this.emptyItems();
      this.$refs.myForm.resetValidation();
    },
    async saveVoucher() {
      this.items.forEach((item) => {
        item.date = this.voucher.date;
        if (this.isNotNullOrUndefined(item.ledgerOptions))
          delete item.ledgerOptions;
        if (this.isNotNullOrUndefined(item.ledgers)) delete item.ledgers;
      });
      console.log(JSON.stringify(this.items));
      this.voucher.amount = this.totalVaoucherAmount;
      this.voucher.list = this.items;
      this.voucher.items = JSON.stringify(this.items);
      this.voucher.status = "APPROVED";
      this.voucher.creator = this.isAdmin()
        ? this.getclientLogonId()
        : this.getUserLogonId();
      this.voucher.approver = this.isAdmin()
        ? this.getclientLogonId()
        : this.getUserLogonId();
      AccountingService.createVoucher(this.voucher)
        .then((response) => {
          // window.alert("Voucher Created: " + JSON.stringify(response));
          this.reset();
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.hint-red .q-field__messages {
  color: red !important;
}
.custom-small-input,
.custom-small-select {
  // Target the control and marginal areas for height adjustment
  :deep(.q-field__control),
  :deep(.q-field__marginal) {
    height: 32px !important; // Adjust height as needed
    min-height: 32px !important; // Ensure minimum height
  }
  // Adjust padding for the native input element
  :deep(.q-field__control),
  :deep(.q-field__native) {
    padding: 0 4px; // Adjust padding as needed
  }
  // Adjust font size for the native input text
  :deep(.q-field__native) {
    font-size: 12px; // Adjust font size as needed
    min-height: 32px !important; // Ensure minimum height for native element
  }
  // Adjust label position for smaller inputs
  :deep(.q-field__label) {
    top: 6px !important; // Adjust label position
  }
}
</style>
