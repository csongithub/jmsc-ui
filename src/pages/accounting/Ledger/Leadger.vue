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
                @update:model-value="getLedgers"
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
                  <div class="col">Start Date</div>
                  <div class="col">{{ ":" + selectedLedger.startDate }}</div>
                </div>
                <div class="row">
                  <div class="col">Creation Date</div>
                  <div class="col">
                    {{ ":" + selectedLedger.createdTimestamp }}
                  </div>
                </div>
                <div class="row">
                  <div class="col">OB</div>
                  <div class="col">
                    {{ ":" + selectedLedger.openingBalance }}
                  </div>
                </div>
              </q-card-section>
              <q-card-actions>
                <q-toggle
                  class="q-ml-sm"
                  dense
                  size="xs"
                  v-model="updatePayments"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                  label="Debit Entry"
              /></q-card-actions>
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
            <q-tab name="entry" label="Entry" />

            <q-tab name="statement" label="Statement" />
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
              ></LedgerEntry
            ></q-tab-panel>

            <q-tab-panel name="statement">
              <Statement></Statement>
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
      <q-card style="width: 300px; max-width: 80vw">
        <q-bar class="bg-secondary text-white text-weight-light text-subtitle2">
          {{ "New Ledger" }}
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-form
            @submit="createLedger"
            @reset="resetLedger"
            class="q-gutter-md"
          >
            <div class="row">
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
            <div class="row">
              <q-input
                hide-bottom-space
                class="full-width"
                dense
                outlined
                v-model="ledger.code"
                label="Ledger Code"
                full-width
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'ledger code']"
              />
            </div>
            <div class="row">
              <q-input
                class="full-width"
                hide-bottom-space
                dense
                outlined
                v-model="ledger.name"
                label="Ledger Name"
                full-width
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'ledger name']"
              />
            </div>
            <div class="row">
              <q-input
                class="full-width"
                hide-bottom-space
                dense
                outlined
                v-model="ledger.startDate"
                :rules="['DD-MM-YYYY']"
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
            <div class="row">
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
            <div class="row">
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

            <div>
              <q-space />
              <q-btn
                dense
                size="sm"
                label="Create"
                type="submit"
                color="secondary"
                class="text-capitalize q-px-lg"
              />

              <q-btn
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
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { commonMixin } from "../../../mixin/common";
import AccountingService from "src/services/accounting/AccountingService";
import LedgerEntry from "./LedgerEntry.vue";
import Statement from "./Statement.vue";

export default {
  name: "Ledger",
  mixins: [commonMixin],
  components: { LedgerEntry, Statement },
  mounted() {
    window.addEventListener("keydown", this.altKeyDownHandler);
    this.getAllCreditors();
  },
  beforeUnmount() {
    // Remove event listener before the component is unmounted to prevent memory leaks
    window.removeEventListener("keydown", this.altKeyDownHandler);
  },
  beforeUnmount() {},
  setup() {
    return { splitterModel: ref(20), tab: ref("entry") };
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
    };
  },
  methods: {
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
      update(() => {
        const value = input.toLowerCase();
        this.creditorsOptions = this.creditors.filter((item) => {
          return item.label.toLowerCase().indexOf(value) > -1;
        });
      });
    },
    filterLedger(input, update, abort) {
      update(() => {
        const value = input.toLowerCase();
        this.ledgersOptions = this.ledgers.filter((item) => {
          return item.name.toLowerCase().indexOf(value) > -1;
        });
      });
    },
    createLedger() {
      this.ledger.clientId = this.clientId;
      AccountingService.createLedger(this.ledger)
        .then((response) => {
          if (this.selectedCreditorId === response.creditorId) {
            this.getLedgers();
          }
          this.closeCreateLedger();
          this.success("Ledger Created");
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
      this.resetLedger();
    },
    resetLedger() {
      this.ledger = this.newLedger();
    },
    getAllCreditors() {
      AccountingService.getAllCreditors(this.clientId)
        .then((response) => {
          this.creditorsOptions = response.list;
          this.creditors = response.list;
        })
        .catch((err) => {});
    },
    getLedgers() {
      this.ledgers = [];
      this.ledgersOptions = [];
      this.selectedLedger = null;
      this.updatePayments = false;
      AccountingService.getLedgers(this.clientId, this.selectedCreditorId)
        .then((response) => {
          this.ledgers = response;
        })
        .catch((err) => {});
    },
  },
};
</script>

<style></style>
