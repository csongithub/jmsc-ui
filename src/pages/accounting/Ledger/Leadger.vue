<template>
  <q-layout>
    <q-splitter v-model="splitterModel" style="height: 800px">
      <template v-slot:before>
        <div style="max-width: 400px">
          <div class="row">
            <div class="col">
              <q-select
                dense
                outlined
                hide-bottom-space
                label="Select Creditors"
                label-color="secondary"
                :options="creditorsOptions"
                v-model="selectedCreditorId"
                option-disable="inactive"
                emit-value
                map-options
                use-input
                input-debounce="0"
                @filter="filterCreditor"
                @update:model-value="
                  getLedgers(true);
                  detectPayments();
                "
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
          </div>
          <div class="row q-mt-sm">
            <div class="col">
              <q-select
                :disable="selectedCreditorId == null"
                dense
                outlined
                hide-bottom-space
                label="Select Ledger"
                label-color="secondary"
                option-label="name"
                :options="ledgersOptions"
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
          <div class="row q-mt-sm q-mb-md">
            <q-btn
              class="text-secondary float-right"
              label="New Ledger (Alt + L)"
              @click="showCreateLedger = true"
              size="10px"
              outline
            />
          </div>

          <q-separator />
          <div class="row q-mt-md" v-if="selectedLedger !== null">
            <q-card class="my-card q-mt-sm full-width">
              <q-card-section class="bg-secondary">
                <div class="text-subtitle">{{ selectedLedger.name }}</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col">Ledger Code</div>
                  <div class="col">{{ ":" + selectedLedger.code }}</div>
                </div>
                <div class="row">
                  <div class="col">Creation Date</div>
                  <div class="col">
                    {{ ":" + selectedLedger.createdTimestamp }}
                  </div>
                </div>
                <div class="row">
                  <div class="col">Opening Date</div>
                  <div class="col text-red">
                    {{ ":" + selectedLedger.startDate }}
                  </div>
                </div>

                <div class="row">
                  <div class="col">Opengin Balance</div>
                  <div class="col text-red">
                    {{
                      ":" +
                      selectedLedger.openingBalance.toLocaleString("en-IN")
                    }}
                  </div>
                </div>
              </q-card-section>
              <!-- <q-card-actions>
                <q-toggle
                  class="q-ml-sm"
                  dense
                  size="xs"
                  v-model="updatePayments"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                  label="Debit Entry"
              /></q-card-actions> -->
            </q-card>
          </div>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-ml-sm">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
          >
            <q-tab name="entry" label="Entry" :disable="disableTab" />

            <q-tab name="statement" label="Statement" :disable="disableTab" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated class="">
            <q-tab-panel name="entry"
              ><LedgerEntry
                :creditorId="selectedCreditorId"
                :ledgerId="selectedLedger !== null ? selectedLedger.id : null"
                :startDate="
                  selectedLedger !== null ? selectedLedger.startDate : null
                "
                :updatePayments="updatePayments"
                @changeMode="updatePayments = !updatePayments"
              ></LedgerEntry
            ></q-tab-panel>

            <q-tab-panel name="statement">
              <Statement
                :creditorId="selectedCreditorId"
                :ledgerId="selectedLedger !== null ? selectedLedger.id : null"
                :startDate="
                  selectedLedger !== null ? selectedLedger.startDate : null
                "
              ></Statement>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </template>
    </q-splitter>

    <q-dialog
      v-model="showCreateLedger"
      persistent
      @hide="closeCreateLedger"
      @before-show="openCreateLedger"
      ref="newLedgerRef"
    >
      <q-card
        :style="
          step === 1 ? 'width: 400px;' : 'width: 600px;' + 'max-width: 80vw'
        "
      >
        <q-bar class="bg-secondary text-white text-weight-light text-subtitle2">
          {{ "New Ledger" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-form ref="ledgerForm" class="q-gutter-md">
            <q-stepper
              v-model="step"
              ref="stepper"
              active-color="secondary"
              animated
              keep-alive
            >
              <q-step
                :name="1"
                title="Basic Detail"
                :done="step > 1"
                done-color="grey"
              >
                <div class="row q-mb-sm">
                  <q-select
                    class="full-width"
                    dense
                    outlined
                    hide-bottom-space
                    label="Select Creditors"
                    label-color="secondary"
                    :options="creditorsOptions"
                    v-model="ledger.creditorId"
                    option-disable="inactive"
                    emit-value
                    map-options
                    use-input
                    input-debounce="0"
                    @filter="filterCreditor"
                    lazy-rules
                    :rules="[(val) => (val && val > 0) || 'select creditor']"
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
                <div class="row q-mb-sm">
                  <q-input
                    hide-bottom-space
                    class="full-width"
                    dense
                    outlined
                    v-model="ledger.code"
                    label="Ledger Code"
                    full-width
                    @update:model-value="
                      (val) => {
                        ledger.code = val.toUpperCase();
                      }
                    "
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || 'ledger code']"
                  />
                </div>
                <div class="row q-mb-sm">
                  <q-input
                    class="full-width"
                    hide-bottom-space
                    dense
                    outlined
                    v-model="ledger.name"
                    label="Ledger Name"
                    full-width
                    @update:model-value="
                      (val) => {
                        ledger.name = val.toUpperCase();
                      }
                    "
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || 'ledger name']"
                  />
                </div>
                <div class="row q-mb-sm">
                  <q-input
                    class="full-width"
                    hide-bottom-space
                    dense
                    outlined
                    v-model="ledger.startDate"
                    :rules="[
                      (val) => !!val || '',
                      (val) => /^\d{2}-\d{2}-\d{4}$/.test(val) || '',
                    ]"
                    label="Start Date"
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
                            v-model="ledger.startDate"
                            mask="DD-MM-YYYY"
                            minimal
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="row q-mb-sm">
                  <q-input
                    class="full-width"
                    hide-bottom-space
                    type="number"
                    dense
                    outlined
                    v-model="ledger.openingBalance"
                    label="Opening Balance"
                    full-width
                    lazy-rules
                    :rules="[(val) => (val && val > 0) || 'Opening Balance']"
                  />
                </div>
                <div class="row q-mb-sm">
                  <q-input
                    class="full-width"
                    hide-bottom-space
                    dense
                    outlined
                    v-model="ledger.remark"
                    label="Description"
                    full-width
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || 'description']"
                  />
                </div>
              </q-step>
              <q-step :name="2" title="Select Coumns" :done="step > 2">
                <q-card flat bordered>
                  <!-- Header -->
                  <div class="row text-weight-bold">
                    <div class="col-2"></div>
                    <div class="col-3">Select</div>
                    <div class="col-3">Name</div>
                    <div class="col-3 text-wrap">Customized Name</div>
                  </div>

                  <!-- <q-item dense>
                    <q-item-section></q-item-section>
                    <q-item-section>Select</q-item-section>
                    <q-item-section>Name</q-item-section>
                    <q-item-section>New Name</q-item-section>
                  </q-item> -->
                  <!-- Draggable rows -->
                  <draggable
                    v-model="ledgerHeaders"
                    item-key="name"
                    handle=".drag-handle"
                    direction="vertical"
                    animation="200"
                  >
                    <template #item="{ element }">
                      <q-item dense>
                        <!-- Drag -->
                        <q-item-section avatar>
                          <q-icon
                            size="xs"
                            name="drag_indicator"
                            class="drag-handle cursor-pointer"
                          />
                        </q-item-section>

                        <!-- Checkbox -->
                        <q-item-section>
                          <q-checkbox
                            color="secondary"
                            class="q-pa-non"
                            size="xs"
                            v-model="element.selected"
                            :disable="element.disable"
                          />
                          <!-- <q-toggle
                            v-model="element.selected"
                            size="xs"
                            color="secondary"
                          /> -->
                        </q-item-section>

                        <!-- Label -->
                        <q-item-section>
                          {{ element.label }}
                        </q-item-section>

                        <!-- Input -->
                        <q-item-section>
                          <q-input
                            class="custom-small-input"
                            v-model="element.customeLabel"
                            dense
                            outlined
                            placeholder="new name"
                            :maxlength="15"
                          />
                        </q-item-section>
                      </q-item>
                    </template>
                  </draggable>
                </q-card>
              </q-step>
              <template v-slot:navigation>
                <q-stepper-navigation>
                  <q-btn
                    v-if="step === 2"
                    dense
                    size="10px"
                    label="Finish"
                    class="text-capitalize q-px-lg"
                    color="secondary"
                    @click="createLedger"
                  />
                  <q-btn
                    v-if="step === 1"
                    dense
                    size="10px"
                    label="Next"
                    @click="$refs.stepper.next()"
                    class="text-capitalize q-px-lg"
                    color="secondary"
                  />

                  <q-btn
                    size="10px"
                    v-if="step === 2"
                    flat
                    color="secondary"
                    @click="$refs.stepper.previous()"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </template>
            </q-stepper>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showPaymentsDetected" persistent ref="pendingPaymentref">
      <q-card style="width: fit-content; max-width: 80vw">
        <q-bar class="bg-secondary text-white text-weight-light text-subtitle2">
          {{ "Payments Detected" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="text-bold">
          {{ selectedCreditorName }}
        </q-card-section>
        <q-card-section>
          <q-table
            ref="myTable"
            flat
            dense
            bordered
            :rows="payments"
            :columns="paymentColumns"
            row-key="debit"
            binary-state-sort
            wrap-cells
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="date" :props="props">{{ props.row.date }}</q-td>
                <q-td key="debit" :props="props">{{
                  props.row.debit.toLocaleString("en-IN") + ".00"
                }}</q-td>
                <q-td key="paymentMode" :props="props">{{
                  props.row.paymentMode
                }}</q-td>
                <q-td
                  style="max-width: 50px"
                  key="paymentRefNo"
                  :props="props"
                  >{{ props.row.paymentRefNo }}</q-td
                >
                <q-td key="remark" :props="props">{{ props.row.remark }}</q-td>
                <q-td key="ledger" :props="props">
                  <q-select
                    class="custom-small-select"
                    :disable="!(props.row.status === 'CREATED')"
                    dense
                    outlined
                    option-label="name"
                    :options="ledgersOptions"
                    v-model="props.row.ledger"
                    option-disable="inactive"
                    use-input
                    input-debounce="0"
                    @filter="filterLedger"
                    hide-dropdown-icon
                    :error="props.row.ledger_error"
                    error-message="select ledger"
                    @update:model-value="validateLedger(props)"
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

                <q-td>
                  <span
                    class="text-green"
                    v-if="props.row.status === 'ACCEPTED'"
                    >Accepted</span
                  >
                  <span class="text-red" v-if="props.row.status === 'REJECTED'"
                    >Rejected</span
                  >
                  <q-btn
                    label="Accept"
                    color="green"
                    class="q-mr-md"
                    size="10px"
                    @click="updatePayment(props, 'ACCEPTED')"
                    v-if="props.row.status === 'CREATED'"
                  />
                  <q-btn
                    label="Reject"
                    color="red"
                    class="q-mr-md"
                    size="10px"
                    @click="updatePayment(props, 'REJECTED')"
                    v-if="props.row.status === 'CREATED'"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import LedgerEntry from "./LedgerEntry.vue";
import Statement from "./Statement.vue";
import { creditorStore } from "src/pinia_stores/CreditorStore";
import draggable from "vuedraggable";
import { filter, filterOnName } from "../Utils/filterUtils";
import { defaultLedgerEntryColumns } from "../Utils/ledgerUtils";

export default {
  name: "Ledger",
  mixins: [commonMixin],
  components: { LedgerEntry, Statement, draggable },
  async mounted() {
    window.addEventListener("keydown", this.altKeyDownHandler);
    await this.getAllCreditors();
  },
  beforeUnmount() {
    // Remove event listener before the component is unmounted to prevent memory leaks
    window.removeEventListener("keydown", this.altKeyDownHandler);
  },
  computed: {
    disableTab() {
      return (
        this.isNullOrUndefined(this.selectedCreditorId) ||
        this.isNullOrUndefined(this.selectedLedger)
      );
    },
  },
  watch: {
    ledgerHeaders: {
      deep: true,
      handler() {
        // Optional: reassign order after drag
        this.ledgerHeaders.forEach((r, i) => {
          r.orderNo = i + 1;
        });
      },
    },
  },
  beforeUnmount() {},
  setup() {
    return {
      splitterModel: ref(20),
      pagination: { rowsPerPage: 7 },
      step: ref(1),
      tab: ref("entry"),

      columns: [
        { name: "drag", label: "", field: "" },
        {
          name: "selected",
          align: "left",
          label: "Select",
          field: "selected",
        },
        {
          name: "label",
          align: "left",
          label: "Name",
          field: "label",
        },
        {
          name: "customeLabel",
          align: "left",
          label: "Customized Name",
          field: "customeLabel",
        },
      ],

      paymentColumns: [
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
        },

        {
          name: "debit",
          align: "left",
          label: "Amount",
          field: "debit",
        },
        {
          name: "paymentMode",
          align: "left",
          label: "Mode",
          field: "paymentMode",
        },
        {
          name: "paymentRefNo",
          align: "left",
          label: "PaymentRef.No/Cheque/UTR",
          field: "paymentRefNo",
        },
        { name: "remark", align: "left", label: "Note", field: "remark" },
        { name: "ledger", align: "left", label: "Ledger", field: "ledger" },
      ],
    };
  },
  data() {
    return {
      clientId: this.getClientId(),
      selectedCreditorId: null,
      creditorsOptions: [],
      creditors: [],
      selectedLedger: null,
      ledgersOptions: [],
      ledgers: [],
      ledger: this.newLedger(),
      showCreateLedger: false,
      keysPressed: null,
      items: null,
      updatePayments: ref(false),
      payments: [],
      showPaymentsDetected: false,
      selectedCreditorName: null,
      ledgerHeaders: this.defaultColumns(),
    };
  },
  methods: {
    defaultColumns() {
      return JSON.parse(JSON.stringify(defaultLedgerEntryColumns));
    },
    moveUp(index) {
      if (index === 0) return;
      this.swap(index, index - 1);
    },

    moveDown(index) {
      if (index === this.ledgerHeaders.length - 1) return;
      this.swap(index, index + 1);
    },

    swap(i, j) {
      const temp = this.ledgerHeaders[i];
      this.ledgerHeaders[i] = this.ledgerHeaders[j];
      this.ledgerHeaders[j] = temp;
    },
    altKeyDownHandler(event) {
      console.log(" keydown:", event.key);
      if (this.keysPressed !== "Alt") this.keysPressed = event.key;
      if (
        this.keysPressed === "Alt" &&
        event.key === "l" &&
        this.selectedCreditor !== null
      ) {
        console.log("Control keydown:", event.key);
        this.keysPressed = null;
        this.showCreateLedger = true;
      }
    },
    newLedger() {
      return {
        id: null,
        clientId: null,
        creditorId: null,
        code: null,
        name: null,
        startDate: null,
        openingBalance: null,
        remark: null,
      };
    },
    filterCreditor(input, update, abort) {
      this.creditorsOptions = filter(input, update, this.creditors);
    },
    filterLedger(input, update, abort) {
      this.ledgersOptions = filterOnName(input, update, this.ledgers);
    },
    createLedger() {
      this.$refs.ledgerForm.validate().then((isValid) => {
        if (isValid) {
          this.createLedgerPostValidation();
        } else {
          this.step = 1;
        }
      });
    },
    createLedgerPostValidation() {
      this.ledger.clientId = this.clientId;
      this.ledger.columns = JSON.stringify(this.ledgerHeaders);
      AccountingService.createLedger(this.ledger)
        .then((response) => {
          if (this.selectedCreditorId === response.creditorId) {
            this.getLedgers(true);
          }
          this.closeCreateLedger();
          this.success("Ledger Created", "secondary");
        })
        .catch((err) => {});
    },
    openCreateLedger() {
      this.resetLedger();
      this.ledger.creditorId =
        this.selectedCreditorId !== null ? this.selectedCreditorId : null;

      this.showCreateLedger = true;
    },
    closeCreateLedger() {
      this.showCreateLedger = false;
      this.step = 1;
      this.ledgerHeaders = this.defaultColumns();
      this.resetLedger();
    },
    resetLedger() {
      this.ledger = this.newLedger();
    },
    async getAllCreditors() {
      this.creditors = await creditorStore().loadCreditors(
        this.clientId,
        false
      );
    },

    async getLedgers(refresh) {
      this.ledgers = [];
      this.ledgersOptions = [];
      this.selectedLedger = null;
      this.updatePayments = false;
      this.ledgers = await creditorStore().loadLedgers(
        this.clientId,
        this.selectedCreditorId,
        refresh
      );
    },

    detectPayments() {
      this.payments = [];
      AccountingService.detectPayments(this.clientId, this.selectedCreditorId)
        .then((response) => {
          this.payments = response;
          if (this.payments.length > 0) {
            this.showPaymentsDetected = true;
            this.selectedCreditorName = this.creditors.find(
              (item) => Number(item.value) === 11
            ).label;
          }
        })
        .catch((err) => {});
    },
    validateLedger(props) {
      if (this.isNotNullOrUndefined(props.row.ledger)) {
        delete props.row.ledger_error;
      }
    },
    updatePayment(props, status) {
      if (this.isNullOrUndefined(props.row.ledger)) {
        props.row.ledger_error = true;
      }
      let entry = this.payments[props.rowIndex];
      entry.ledgerId = props.row.ledger.id;
      entry.status = status;
      delete entry.ledger;
      AccountingService.updateDetectedPayment(entry)
        .then((status) => {
          if (status) {
          }
        })
        .catch((err) => {
          this.fail(this.getErrorMessage(err));
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.drag-handle {
  cursor: grab;
}

.sortable-ghost {
  opacity: 0.4;
}
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
