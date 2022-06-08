<template>
<div>
  <div class="row bg-primary text-white">
    <span class="text-subtitle2 q-ml-md"> BG Groups </span>
  </div>
  <q-table class="my-sticky-header-table"
          :grid="grid"
          :hide-header="grid"
          dense
          bordered
          flat
          :rows="groupList"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="groupPagination"
          :filter="filter"
          selection="single"
          v-model:selected="selected"
      >
        <template v-slot:top-left>
          <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="New Group" 
               size="sm"
               glossy
               @click="openDialog('add')"
               :icon="icons.plus"/>
          <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
                outline
                color="primary" 
                size="sm"
                glossy
                label="Refresh"
                icon="refresh" 
                @click="getAllGroups()"/>
        </template>
        <template v-slot:body-selection="props">
          <q-btn class="pointer" color="primary" flat round :icon="icons.rightArrow" @click="openGroupDetail(props.row)">
            <q-tooltip>Open BG Group Details</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:top-right>
          <q-btn class="q-mr-sm" 
            flat
            round
            color="primary"
            :icon="grid ? icons.list : icons.grid"
            @click="grid = !grid">
          </q-btn>
          <q-input class="q-mr-sm"
            borderless
            dense
            outlined
            debounce="300"
            v-model="filter"
            placeholder="Search Group"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
            <q-tooltip>Serch a BG Group</q-tooltip>
          </q-input>
        </template>
  </q-table>
  <q-dialog v-model="open"
                    persistent
                    @hide="onHide"
                    ref="newGroupRef">
    <q-card style="width: 1000px; max-width: 80vw;">
      <q-bar class="bg-primary glossy">
            {{ dialogLabel }}
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-stepper v-model="step" color="primary" animated>
          <q-step :name="1"  title="Configure Group" icon="settings" :done="step > 1">
            <q-input v-model="group.groupName" dense outlined full-width lazy-rules label="Group Name"  
                     :rules="[val => (val && val.length > 0) || 'Enter Group Name']"/>
            <q-input type="textarea"  v-model="group.groupInfo" dense outlined full-width lazy-rules label="Group Info"
                      :rules="[val => (val && val.length > 0) || 'EnterGroup Info']"/>
            <q-input type="number" v-model="group.groupLimit" dense outlined full-width lazy-rules label="Group Limit"  
                     :rules="[val => (val > 0) || 'Enter Group Limit']"/>
            <q-stepper-navigation>
              <q-btn class="text-capitalize" @click="step = 2" color="primary" label="Continue" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Select Deposits" caption="Optional" icon="create_new_folder" :done="step > 2">
            <q-table class="my-sticky-header-table" title="Select Deposit(s)" dense bordered  flat
                    :rows="deposits"
                    :columns="facilityColumns"
                    row-key="accountNumber"
                    :loading="depositLoading"
                    :pagination="facilityPagination"
                    :filter="depositFilter"
                    selection="multiple"
                    @selection="printDetails"
                    v-model:selected="depositSelected">
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="depositFilter"
                        placeholder="Search Deposit">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
            </q-table>
            <q-stepper-navigation>
              <q-btn class="text-capitalize" @click="step = 3" color="primary" label="Continue" />
              <q-btn class="q-ml-sm text-capitalize" flat @click="step = 1" color="primary" label="Back" />
            </q-stepper-navigation>
          </q-step>
          <q-step :name="3" title="Select Guarantee" caption="Optional" icon="assignment">
            <q-table class="my-sticky-header-table" title="Select Guarantee(s)" dense bordered  flat
                    :rows="guarantees"
                    :columns="facilityColumns"
                    row-key="accountNumber"
                    :loading="guaranteeLoading"
                    :pagination="facilityPagination"
                    :filter="depositFilter"
                    selection="multiple"
                    @selection="printGuaranteeDetails"
                    v-model:selected="guaranteeSelected">
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="guaranteeFilter"
                        placeholder="Search Deposit">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
            </q-table>
            <q-stepper-navigation>
              <q-btn class="text-capitalize" color="primary" label="Finish" @click="createBGGroup"/>
              <q-btn class="q-ml-sm text-capitalize" flat @click="step = 2" color="primary" label="Back"/>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
import { fasPlus, fasTh, fasList} from "@quasar/extras/fontawesome-v5";
import {matAdd, matRefresh, matArrowForwardIos} from "@quasar/extras/material-icons";
import BgGroupService from "../../../services/BgGroupService"
import CreditFacilityService from "../../../services/CreditFacilityService"
import { commonMixin } from "../../../mixin/common"
import { date } from 'quasar'
import { ref } from 'vue'
export default {
  name: 'New FD',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      depositSelected: ref([]),
      guaranteeSelected: ref([]),
      step: ref(1),
      icons: {
        plus: matAdd,
        reload: matRefresh,
        rightArrow: matArrowForwardIos,
        grid: fasTh,
        list: fasList,
      },
      columns: [
        {
          name: "groupName",
          required: true,
          label: "Group Name",
          align: "left",
          field: "groupName",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "groupInfo",
          required: false,
          label: "Group Info",
          align: "left",
          field: "groupInfo",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "groupLimit",
          required: false,
          label: "Group Limit",
          align: "left",
          field: "groupLimit",
          format: val => val ? val.toLocaleString('en-IN') : 0,
          sortable: true
        }
      ],
      facilityColumns: [
        {
          name: "accountNumber", required: true, label: "Account No", align: "left",  sortable: true,
          field: row => row.accountNumber, format: val => `${val}`
        },
        {name: "amount",  align: "left", label: "Amount", field: "amount", sortable: true},
        {
          name: "openDate", align: "left", label: "Open Date", field: "openDate", sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {
          name: "maturityDate", align: "left", label: "Maturity Date", field: "maturityDate", sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true}
      ]
    }
  },
  watch: {
  },
  created() {},
  mounted() {
    this.getAllGroups()
  },
  data() {
    return {
      clientId: this.getClientId(),
      groupPagination:  { rowsPerPage: 10 },
      mode: "add",
      dialogLabel: "Create New Group",
      group: this.newGroup(),
      open: false,
      grid: true,
      groupList: [],
      loading: false,
      deposits: [],
      depositLoading: false,
      depositFilter: "",
      guarantees: [],
      guaranteeLoading: false,
      guaranteeFilter: "",
      facilityPagination:  { rowsPerPage: 10 },
    };
  },
  methods: {
    newGroup () {
      return {
        groupName: '',
        groupInfo: '',
        groupLimit: 0
      }
    },
    getAllGroups() {
      this.loading = true;
      BgGroupService.getAllGroups(this.clientId)
        .then(response => {
        this.groupList.splice(0, this.groupList.length)
        this.groupList = response
        console.log(JSON.stringify(this.groupList))
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialogLabel = "Create New Group"
      } else if (this.mode === "edit") {
        this.group = this.selected[0]
        console.log(JSON.stringify(this.group))
        this.dialogLabel = "Update Group"
      }
      this.depositsList()
      this.guaranteesList()
      this.open = true;
    },
    closeDialog() {
      this.open = false
    },
    onHide() {
      this.reset();
      this.mode='add'
      this.step=ref(1)
    },
    reset() {
      this.group = this.newGroup();
    },
    depositsList() {
      let self = this
      this.depositLoading = true
      CreditFacilityService.depositsForBgGroup(this.clientId)
        .then(response => {
        self.deposits.splice(0, this.deposits.length)
        self.deposits = response
        this.depositLoading = false;
      }).catch(err => {
        this.depositLoading = false;
      });
    },
    guaranteesList() {
      let self = this
      this.guaranteeLoading = true
      CreditFacilityService.guaranteesForBgGroup(this.clientId)
        .then(response => {
        self.guarantees.splice(0, this.guarantees.length)
        self.guarantees = response
        this.guaranteeLoading = false;
      }).catch(err => {
        this.guaranteeLoading = false;
      });
    },
    printDetails() {
    },
    printGuaranteeDetails() {
    },
    createBGGroup() {
      let bgGroupDTO = {
        "clientId": this.clientId,
        "groupName": this.group.groupName,
        "groupInfo": this.group.groupInfo,
        "groupLimit": this.group.groupLimit,
        "linkedBgList": this.guaranteeSelected,
        "linkedFdList": this.depositSelected
      }
      console.log(JSON.stringify(bgGroupDTO))
      BgGroupService.createGroup(bgGroupDTO)
        .then(response => {
        console.log('Bg Group Created: ' + JSON.stringify(response))
        this.success('Group Created Successfully')
        this.closeDialog()
        this.getAllGroups()
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    },
    openGroupDetail(group) {
      console.log(JSON.stringify(group.id))
      this.$router.push({ name: "bgGroupDetails", params: { groupId: group.id}});
    }
  }
};
</script>
<style>
.pointer {
  cursor: pointer;
}
</style>