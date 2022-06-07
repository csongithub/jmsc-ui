<template>
    <div>
    <CreditFacility/>
        <q-table
        class="my-sticky-header-table"
        title="Bank Guarantee"
        dense
        bordered
        flat
        :rows="accounts"
        :columns="columns"
        row-key="accountNumber"
        :loading="loading"
        :pagination="myPagination"
        :filter="filter"
        selection="single"
        v-model:selected="selected"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            outlined
            debounce="300"
            v-model="filter"
            placeholder="Search Account"
          >
          <template v-slot:append>
              <q-icon name="search" />
          </template>
          </q-input>
        </template>
      </q-table>
    </div>
</template>

<script>

import CreditFacilityService from "../../../services/CreditFacilityService"
import CreditFacility from "../cf/CreditFacility.vue"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { ref } from 'vue'
export default {
  name: 'BankGuarantee',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      columns: [
        {name: "facilityType",  align: "left", label: "Type", field: "facilityType", sortable: true},
        {
          name: "accountNumber",
          required: true,
          label: "Account No",
          align: "left",
          field: row => row.accountNumber,
          format: val => `${val}`,
          sortable: true
        },
        {name: "amount",  align: "left", label: "Amount", field: "amount", sortable: true},
        {name: "openDate",  align: "left", label: "Open Date", field: "openDate", sortable: true},
        {name: "maturityDate",  align: "left", label: "Maturity Date", field: "maturityDate", sortable: true},
        {name: "issuerType",  align: "left", label: "Issuer", field: "issuerType", sortable: true},
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true},
        {name: "isPledged",  align: "left", label: "Pledged", field: "isPledged", sortable: true},
        {name: "pledgedType",  align: "left", label: "Pledged As", field: "pledgedType", sortable: true},
        
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit
      }
    }
  },
  components: {
    CreditFacility
  },
  created() {},
  mounted() {
    this.getAllBankGuarantee()
  },
  data() {
    return {
      clientId: this.getClientId(),
      myPagination: { rowsPerPage: 15 },
      filter: "",
      loading: true,
      accounts: [],
      account: [],
      open: false,
      mode: "add",
      dialogLabel: "New Facility"
    };
  },
  methods: {
      getAllBankGuarantee() {
      this.loading = true;
      CreditFacilityService.getAllFacilitiesByType(this.clientId, 'BG')
        .then(response => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts = response;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
  }
};
</script>