<template>
    <div>
        <Bidding/>
        <q-btn class="q-mt-sm q-mr-sm" 
               color="primary"
               label="Add" 
               size="sm"
               glossy
               @click="openDialog('add')"
               :icon="icons.plus"/>
        <q-btn v-if="selected.length > 0" 
               class="q-mt-sm q-mr-sm "
               color="primary"
               label="Update"
               size="sm"
               glossy
               @click="openDialog('edit')"
               :icon="icons.edit"/>
        <q-btn v-if="selected.length > 0" 
               class="q-mt-sm q-mr-sm "
               color="primary"
               label="Discard"
               size="sm"
               glossy
               @click="confirmDiscard()"
               :icon="icons.discard"/>
         <q-btn round  
                class="q-mt-sm q-mr-sm" 
                color="primary" 
                icon="refresh" 
                size="sm"
                glossy
                 @click="getActiveBids()"/>
        <q-table
          :grid="grid"
          :hide-header="grid"
          class="my-sticky-header-table"
          title="Active Tenders"
          dense
          bordered
          flat
          :rows="bids"
          :columns="columns"
          row-key="tenderId"
          :visible-columns="visibleColumns"
          :loading="loading"
          :pagination="myPagination"
          :filter="filter"
          selection="single"
          v-model:selected="selected"
      >
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
            placeholder="Search Bid"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-space />
          <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            options-cover
            style="min-width: 150px"
          />
        </template>
      </q-table>

      <q-dialog
        v-model="open"
        persistent
        @before-show="beforeShow"
        @hide="onHide"
        ref="newAccountRef"
        size="bg"
      >
        <q-card style="width: 1000px; max-width: 100vw;">
          <q-bar class="bg-primary glossy">
            {{ dialogLabel }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator>

            <q-tab name="bid" label="Bid Details" />
            <q-tab name="emd" label="EMD Details"/>
            <q-tab name="fee" label="Fee Details"/>
            <q-tab name="other" label="Other Cost"/>
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="bid">
          <q-card-section>
            <q-form @submit="createBid" @reset="reset" class="q-gutter-md">
              <div class="row">
                <div class="col q-mr-sm">
                  <q-input
                    dense
                    outlined
                    v-model="bid.displayName"
                    label="Display Name"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Please Enter Display Name']"
                  />
                </div>

                <div class="col">
                   <q-select dense outlined v-model="bid.sourceSite" :options="bidSourceSiteOPtions" label="Bid Source"/>
                </div>
              </div>
              <div class="row">
                <div class="col q-mr-sm">
                  <q-input
                  dense
                  outlined
                  v-model="bid.bidAuthority"
                  label="Bid Issuer"
                  full-width
                  lazy-rules
                  :rules="[val => (val && val.length > 0) || 'Issuer name']"
                />
                </div>
              </div>
              
              
              <div class="row">
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.nit"
                    label="NIT Number"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Notice Inviting Tender Number']"/>
                </div>
                <div>
                  <q-input filled v-model="bid.nitDate" :rules="['YYYY-MM-DD']"  label="NIT Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="bid.nitDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
              </div>
              <!-- <q-input
                dense
                outlined
                v-model="bid.nitDate"
                label="NIT Date"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Notice Inviting Tender Date']"
              /> -->
              <div class="row">
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.tenderRefNumber"
                    label="Reference Number"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Tender Reference Number']"/>
                </div>
                <div class="col">
                  <q-input
                    dense
                    outlined
                    v-model="bid.tenderId"
                    label="Tender ID"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Tender ID']"/>
                </div>
              </div>
              
              
              
              <div class="row">
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.title"
                    label="Work Name / Title"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Work Name / Title']"/>
                </div>
                <div>
                  <q-input
                    dense
                    outlined
                    v-model="bid.workValue"
                    label="Work Value"
                    lazy-rules
                    type="number"
                    :rules="[val => (val && val.length > 0) || 'Enter Work Value']"/>
                </div>
              </div>
              <div class="row">
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.biddingCost"
                    label="BOQ Cost"
                    lazy-rules
                    type="number"
                    :rules="[val => (val && val.length > 0) || 'Enter BOQ Cost']"/>
                </div>
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.bcInFavourOf"
                    label="BOQ Payble To"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Enter BOQ Payble To']"/>
                </div>
                <div class="col">
                  <q-input
                    dense
                    outlined
                    v-model="bid.bcPaybleAt"
                    label="BOQ Payble At"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Enter BOQ Payble At']"/>
                </div>
              </div>
              <div class="row">
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.emdAmount"
                    label="EMD Amount"
                    full-width
                    lazy-rules
                    type="number"
                    :rules="[val => (val && val.length > 0) || 'Enter EMD Amount']"/>
                </div>
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.emdInFavourOf"
                    label="EMD Payble To"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Enter EMD Payble To']"/>
                </div>
                <div class="col">
                  <q-input
                    dense
                    outlined
                    v-model="bid.emdPaybleAt"
                    label="EMD Payble At"
                    full-width
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Enter EMD Payble At']"/>
                </div>
              </div>
              <div class="row">
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.bankCertificate"
                    label="Bank Certificate / Credit Facility"
                    full-width
                    lazy-rules
                    type="number"
                    :rules="[val => (val && val.length > 0) || 'Enter Bank Certificate Value']"/>
                </div>
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="bid.periodOfWork"
                    label="Work Period (In Months)"
                    full-width
                    lazy-rules
                    type="number"
                    :rules="[val => (val && val.length > 0) || 'Enter Work Period (In Days)']"/>
                </div>
                <div class="col">
                  <q-input
                    dense
                    outlined
                    v-model="bid.bidValidity"
                    label="Bid Validity (In Days)"
                    full-width
                    lazy-rules
                    type="number"
                    :rules="[val => (val && val.length > 0) || 'Enter Bid Validity (In Days)']"/>
                </div>
              </div>
              <div class="row">
                <div class="col q-mr-md">
                  <q-input filled v-model="bid.bidStartDate" :rules="['YYYY-MM-DD']"  label="Bid Submission Start Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="bid.bidStartDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
                <div class="col q-mr-md">
                  <q-input filled v-model="bid.bidEndDate" :rules="['YYYY-MM-DD']"  label="Bid Submission End Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="bid.bidEndDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-input filled v-model="bid.bidOpeningDate" :rules="['YYYY-MM-DD']"  label="Bid Opening Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="bid.bidOpeningDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
              </div>
              <div class="row">
                <div class="col q-mr-md">
                   <q-select outlined v-model="bid.status" :options="bidStatusOptions" label="Status"/>
                </div>
                <div class="col q-mr-md">
                  <q-input filled v-model="bid.bidSubmittedDate" :rules="['YYYY-MM-DD']"  label="Bid Submitted Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="bid.bidSubmittedDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
                 <div class="col">
                    <q-input outlined v-model="bid.bidId" label="Generated Bid Id" />
                </div>
              </div>
              <div class="row">
                <div class="col">
                    <q-input outlined v-model="bid.reason" label="Reason" />
                </div>
              </div>
              <div>
                <q-space />
                <q-btn
                  dense
                  glossy
                  size="sm"
                  :label="mode === 'add' ? 'Create' : 'Update'"
                  type="submit"
                  color="primary"
                  class="text-capitalize q-px-md"
                />

                <q-btn
                  v-if="mode === 'add'"
                  dense
                  glossy
                  size="sm"
                  label="Reset"
                  type="reset"
                  class="text-capitalize q-px-md q-mx-sm"
                />
              </div>
            </q-form>
          </q-card-section>
          </q-tab-panel>

          <q-tab-panel name="emd">
            <div v-if="bid.id !== undefined">
              <div class="row">
                <div class="col">EMD: {{'INR ' + bid.emdAmount.toLocaleString('en-IN')}}</div>
             
                <div class="col">Selected: {{'INR ' + selectedEmdValue.toLocaleString('en-IN')}}</div>
               
                <div class="col">Remaning: {{'INR ' + ((bid.emdAmount - selectedEmdValue) > 0 ? (bid.emdAmount - selectedEmdValue).toLocaleString('en-IN') : 0.00)}}</div>
               
                <div class="col">Extra: {{'INR ' + ((selectedEmdValue - bid.emdAmount) > 0 ? (selectedEmdValue-bid.emdAmount).toLocaleString('en-IN') : 0.00)}}</div>
                
              </div>

              <q-separator class="q-mt-md q-mb-md"/>

              <div class="emd_details" v-if="bidCost.emdDetails !== null">
                <div class="offline_emd_details" v-if="bidCost.emdDetails.emdMode === 'offline'">
                  <q-btn v-if="bid.id !== undefined"
                    class="q-mt-sm q-mr-sm"
                    label="Clear & Reassign" 
                    color="primary"
                    size="sm"
                    glossy
                    @click="clearEMD()"/>
                  <q-table
                    class="my-sticky-header-table"
                    title="EMD Details"
                    dense
                    bordered
                    flat
                    :columns="cols"
                    :rows="emdData"
                    row-key="accountNumber"
                    :filter="emdFilter">
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="emdFilter"
                        placeholder="Search Account">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
                  </q-table>
                </div>
                <div class="offline_emd_details" v-if="bidCost.emdDetails.emdMode === 'online'">
                    <div class="row q-mb-md">
                      <div class="col q-mr-md">
                        {{'Payment Mode: ' + onlineEmdDetails.paymentMode}}
                      </div>
                      <div class="col q-mr-md">
                        {{'Amount: INR ' + onlineEmdDetails.amount}}
                      </div>
                      <div class="col">
                        {{'Transaction: ' + onlineEmdDetails.transactionNumber}}
                      </div>
                    </div>
                    <div>
                      <q-input 
                        type="textarea" style="max-width: 300px"
                        disable
                        dense
                        filled
                        v-model="onlineEmdDetails.accountDetail"/>
                    </div>
                    <q-btn v-if="bid.id !== undefined"
                      class="q-mt-sm"
                      label="Clear & Reassign" 
                      color="primary"
                      size="sm"
                      glossy
                      @click="clearEMD()"/>
                </div>
              </div>
              <div v-else>
                <div class="row q-mt-sm">
                  <div class="col">
                    <span>Select Mode</span>
                  </div>
                </div>
                <div class="row q-mt-sm">
                  <div class="col">
                    <q-radio class="q-mr-md" dense v-model="emdMode" val="offline" label="Offline"/>
                    <q-radio dense v-model="emdMode" val="online" label="Online"/>
                  </div>
                </div>

                <div class="offline_emd q-mt-md" v-if="emdMode == 'offline'">
                  <q-btn v-if="bid.id !== undefined"
                    class="q-mt-sm q-mr-sm"
                    label="Reload" 
                    color="primary" 
                    icon="refresh" 
                    size="sm"
                    glossy
                    @click="getAvailableFacilities()"/>
                  <q-btn v-if="bid.id !== undefined && emdSelected.length > 0"
                    class="q-mt-sm q-mr-sm"
                    label="Confirm" 
                    color="primary"
                    size="sm"
                    glossy
                    @click="saveEMD()"/>
                  <q-table v-if="bid.id !== undefined"
                    class="my-sticky-header-table"
                    title="Available Funds"
                    dense
                    bordered
                    flat
                    :rows="emdAccounts"
                    :columns="emdColumns"
                    row-key="accountNumber"
                    :loading="emdLoading"
                    :pagination="emdPagination"
                    :filter="emdFilter"
                    selection="multiple"
                    @selection="getAmount"
                    v-model:selected="emdSelected">
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        outlined
                        debounce="300"
                        v-model="emdFilter"
                        placeholder="Search Account">
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
                  </q-table>
                </div>
                <div class="online_emd q-mt-md" v-else-if="emdMode == 'online'">
                  <q-form @submit="saveEMD" @reset="resetOnlineEmd" class="">
                    <div class="q-gutter-md" style="max-width: 300px">
				              <q-select 
                        v-model="onlineEmdDetails.paymentMode" 
					              :options="onlineEMDOptions" 
					              label="Select Mode"
					              lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Select Mode']"/>
                    <q-input type="number"
                      dense
                      filled
                      v-model="onlineEmdDetails.amount"
                      label="Enter Amount"
                      lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Enter Amount']"/>
				            <q-input
                      dense
                      filled
                      v-model="onlineEmdDetails.transactionNumber"
                      label="Enter Transaction Detail/UTR"/>
				            <q-input type="textarea"
                      dense
                      filled
                      v-model="onlineEmdDetails.accountDetail"
                      label="Enter Account Detail"
                      lazy-rules
                      :rules="[val => (val && val.length > 0) || 'Please Enter Account Detail']"/>

                    <q-btn  dense label="Save" type="submit" color="primary" class="full-width"/>
                    <q-btn dense label="Reset" type="reset" color="primary" outline class="q-mt-sm full-width"/>
                  </div>
                </q-form>
                </div>
              </div>
            </div>
            <div v-else class="title">No Bid Found! Please follow below steps.<br><q-space/><br>
              1. Go to BID DETAILS Section and create a bid.<br>
              2. Open the bit in edit mode to assign the EMD.
            </div>
          </q-tab-panel>
          
          <q-tab-panel name="fee">
            <FeeDetail :bid="bid" :bidCost="bidCost"></FeeDetail>
          </q-tab-panel>

          <q-tab-panel name="other">
            <OtherCost :bid="bid" :bidCost="bidCost"></OtherCost>
          </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
import { ref } from 'vue'
import BidService from "../../../services/BidService"
import EnumService from "../../../services/EnumerationService"
import CreditFacilityService from "../../../services/CreditFacilityService"
import Bidding from "../bidding/Bidding.vue"
import { fasPlus, fasEdit, fasTh, fasList, fasRemoveFormat, fasTrash } from "@quasar/extras/fontawesome-v5";
import { commonMixin } from "../../../mixin/common"
import { date } from 'quasar'
import FeeDetail from '../bidding/FeeDetails.vue'
import OtherCost from '../bidding/OtherCost.vue'
export default {
  name: 'ActiveBids',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      tab: ref('bid'),
      visibleColumns: ref(['displayName', 'tenderId', 'title', 'workValue', 'emdAmount', 'emdInFavourOf', 'emdPaybleAt', 'bidAuthority', 'nit' ]),
      columns: [
        {
          name: "displayName",
          required: true,
          label: "Display Name",
          align: "left",
          field: "displayName",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "sourceSite",
          required: true,
          label: "Source",
          align: "left",
          field: "sourceSite",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "tenderId",
          required: true,
          label: "Tender ID",
          align: "left",
          field: row => row.tenderId,
          format: val => `${val}`,
          sortable: true
        },
        {name: "tenderRefNumber",  align: "left", label: "Ref Number", field: "tenderRefNumber", sortable: true},
        {name: "nit",  align: "left", label: "NIT", field: "nit", sortable: true},
        {
          name: "nitDate",
          align: "left", 
          label: "NIT Date", 
          field: "nitDate", 
          sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {name: "title",  align: "left", label: "Work Name", field: "title", sortable: true},
        {name: "workValue",  align: "left", label: "Work Value", field: "workValue", sortable: true},
        {name: "biddingCost",  align: "left", label: "BOQ Cost", field: "biddingCost", sortable: true},
        {name: "bcInFavourOf",  align: "left", label: "BOQ Cost Payble To", field: "bcInFavourOf", sortable: true},
        {name: "bcPaybleAt",  align: "left", label: "BOQ Cost Payble At", field: "bcPaybleAt", sortable: true},
        {name: "emdAmount",  align: "left", label: "EMD Amount", field: "emdAmount", sortable: true},
        {name: "emdInFavourOf",  align: "left", label: "EMD Payble To", field: "emdInFavourOf", sortable: true},
        {name: "emdPaybleAt",  align: "left", label: "EMD Payble At", field: "emdPaybleAt", sortable: true},
        {name: "bankCertificate",  align: "left", label: "Bank Certificate", field: "bankCertificate", sortable: true},
        {name: "bidAuthority",  align: "left", label: "Issuer", field: "bidAuthority", sortable: true},
        {name: "periodOfWork",  align: "left", label: "Work Period", field: "periodOfWork", sortable: true},
        {name: "bidValidity",  align: "left", label: "Validity", field: "bidValidity", sortable: true},
        {
          name: "bidStartDate", 
          align: "left",
          label: "Start",
          field: "bidStartDate",
          sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {
          name: "bidEndDate",
          align: "left",
          label: "End", 
          field: "bidEndDate", 
          sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {
          name: "bidOpeningDate", 
          align: "left", 
          label: "Opening", 
          field: "bidOpeningDate",
          sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {name: "status",  align: "left", label: "Status", field: "status", sortable: true},
      ],
      emdColumns: [
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
        {
          name: "openDate",
          align: "left",
          label: "Open Date",
          field: "openDate", 
          sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {
          name: "maturityDate", 
          align: "left",
          label: "Maturity Date",
          field: "maturityDate",
          sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {name: "issuerType",  align: "left", label: "Issuer", field: "issuerType", sortable: true},
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true}

      ],
      cols: [
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
        {
          name: "openDate", 
          align: "left",
          label: "Open Date",
          field: "openDate",
          sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {
          name: "maturityDate", 
          align: "left",
          label: "Maturity Date",
          field: "maturityDate",
          sortable: true,
          format: val => date.formatDate(val, 'DD-MM-YYYY')
        },
        {name: "issuerType",  align: "left", label: "Issuer", field: "issuerType", sortable: true},
        {name: "issuerName",  align: "left", label: "Issuer Name", field: "issuerName", sortable: true},
        {name: "issuerBranch",  align: "left", label: "Branch", field: "issuerBranch", sortable: true},
        {name: "pledgedType",  align: "left", label: "Pledged As", field: "pledgedType", sortable: true},
      ],
      emdSelected: ref([]),
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        grid: fasTh,
        list: fasList,
        remove: fasRemoveFormat,
        discard: fasTrash
      }
    }
  },
  watch: {
    emdMode(val) {
      this.emdSelected = ref([])
      this.selectedEmdValue = 0
    },
    'onlineEmdDetails.amount'(value) {
      this.selectedEmdValue = value
    }
  },
  created() {
  },
  mounted() {
    this.getActiveBids()
    this.getBidStatusOptions()
    this.getBidSourceSiteOptions()
  },
  components: {
    Bidding,
    FeeDetail,
    OtherCost
  },
  data() {
    return {
      clientId: this.getClientId(),
      myPagination: { rowsPerPage: 10 },
      emdPagination:  { rowsPerPage: 10 },
      grid: true,
      filter: "",
      emdFilter: "",
      loading: true,
      emdLoading: true,
      bids: [],
      bid: this.newBid(),
      emdAccounts: [],
      open: false,
      mode: "add",
      dialogLabel: "New Bid",
      selectedEmdValue: 0,
      bidCost: null,
      emdMode: 'offline',
      emdComments: '',
      emdData: [],
      onlineEMDOptions: ['Net Banking', 'Challan Payment', 'UPI Payment', 'Card Payment'],
      onlineEmdDetails: {
        paymentMode: '',
        amount: 0,
        transactionNumber: '',
        accountDetail: ''
      },
      bidStatusOptions: [],
      bidSourceSiteOPtions: []
    };
  },
  methods: {
    newBid() {
      return {
        clientId: this.clientId,
        displayName:'',
        sourceSite: '',
        bidAuthority:'',
        nit: '',
        nitDate: ref(this.getTodaysDate()),
        tenderRefNumber:'',
        tenderId:'',
        title:'',
        workValue: null,
        biddingCost: null,
        bcInFavourOf:'',
        bcPaybleAt: '',
        emdAmount: null,
        emdInFavourOf: '',
        emdPaybleAt: '',
        bankCertificate: null,
        periodOfWork: null,
        bidValidity: null,
        bidStartDate: ref(this.getTodaysDate()),
        bidEndDate: ref(this.getTodaysDate()),
        bidOpeningDate: ref(this.getTodaysDate()),
        status: 'CREATED'
      }
    },
    getActiveBids() {
      this.loading = true;
      BidService.getBidsByStatus(this.clientId, 'CREATED')
        .then(response => {
        this.bids.splice(0, this.bids.length)
        this.bids = response
        console.log(JSON.stringify(this.bids))
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    getBidCost(bidId) {
      let self = this
      BidService.getBidCost(bidId)
        .then(response => {
        self.bidCost = response
        self.emdData = []
        self.selectedEmdValue = 0
        if(self.bidCost.emdDetails !== null && self.bidCost.emdDetails.emdMode === 'offline') {
          for (let item of self.bidCost.emdDetails.emdList) {
             self.emdData.push(item.emd)
             self.selectedEmdValue = self.selectedEmdValue + item.emd.amount
          }
        }else if(self.bidCost.emdDetails !== null && self.bidCost.emdDetails.emdMode === 'online') {
           self.onlineEmdDetails = self.bidCost.emdDetails.onlineDetails
           //self.selectedEmdValue = self.bidCost.onlineDetails.amount
        }
        console.log(JSON.stringify(self.bidCost))
        console.log(JSON.stringify(self.emdData))
      }).catch(err => {
      });
    },
    createBid() {
      if (this.bid.clientId === undefined) {
        this.bid.clientId = this.clientId
      }
      BidService.createBid(this.bid)
        .then(response => {
        if(this.mode === 'add') {
            this.bids.unshift(response)
            this.success('Bid Created Successfully')
          } else if(this.mode === 'edit'){
            this.success('Bid Updated Successfully')
          }
          this.getActiveBids()
          this.closeDialog()
          }).catch(err => {
            this.fail(this.getErrorMessage(err))
          });
    },
    discardBid() {
      BidService.discardBid(this.clientId, this.selected[0].id)
        .then(response => {
        this.getActiveBids()
      }).catch(err => {
        this.fail(this.getErrorMessage(err))
      });
    },
    confirmDiscard() {
      this.$q.dialog({
        title: 'Are You Sure?',
        message: 'This will delete the bid permanently',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.discardBid()
      }).onOk(() => {
         this.discardBid()
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    resetOnlineEmd () {
      this.onlineEmdDetails = {
        paymentMode: '',
        amount: 0,
        transactionNumber: '',
        accountDetail: ''
      }
    },
    saveEMD() {
      if(this.bid.emdAmount - this.selectedEmdValue > 0) {
        this.fail('Selected accounts does not fullfill the emd amount')
        return
      }

      let newBidCost = {
        clientId: this.clientId,
        bidId: this.bid.id,
        feeDetails: null,
        emdDetails: null
      }

      let emdDetails = {
        emdMode: this.emdMode,
        emdList: null,
        onlineDetails: null,
        comments: null
      }

      if(this.emdMode == 'offline') {
        emdDetails.onlineDetails = null
        let emdList = []
        for (let emd of this.emdSelected) {
          let emdWrapper = {
            emd: emd,
            status: 'SUBMITTED'
          }
          emdList.push(emdWrapper)
        }
        emdDetails.emdList = emdList
        emdDetails.comments = this.emdComments
      } else { 
        emdDetails.emdList = null
        emdDetails.onlineDetails = this.onlineEmdDetails
        emdDetails.onlineDetails.status = 'SUBMITTED'
      }

      newBidCost.emdDetails = emdDetails

      BidService.saveBidCost(newBidCost)
        .then(response => {
        // this.bidCost = response
        this.getBidCost(this.bid.id)
        this.resetOnlineEmd()
        console.log(JSON.stringify(response))
      }).catch(err => {
      });
    },
    clearEMD() {
      BidService.clearEMD(this.bid.id)
        .then(response => {
        console.log(response)
       this.getAvailableFacilities()
       this.getBidCost(this.bid.id)
       this.emdSelected = []
       this.resetOnlineEmd()
      }).catch(err => {
      });
    },
    getAvailableFacilities() {
      this.emdLoading = true
      CreditFacilityService.getAvailableFacilities(this.clientId)
        .then(response => {
        this.emdAccounts.splice(0, this.emdAccounts.length)
        this.emdAccounts = response;
        this.emdLoading = false
      }).catch(err => {
        this.emdLoading = false
      });
    },
    beforeShow() {},
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialogLabel = "New Bid";
      } else if (this.mode === "edit") {
        this.bid = this.selected[0];
        this.tab = ref('bid')
        console.log(JSON.stringify(this.bid))
        this.getAvailableFacilities()
        this.getBidCost(this.bid.id)
        this.dialogLabel = "Update Bid";
      }
      this.open = true;
    },
    getAmount(payload) {
      if(payload.added) {
        for(let emd of payload.rows) {
          this.selectedEmdValue = this.selectedEmdValue + emd.amount
        }
      } else {
        for(let emd of payload.rows) {
          this.selectedEmdValue = this.selectedEmdValue - emd.amount
          if (this.selectedEmdValue < 0) {
             this.selectedEmdValue = 0
             break
          }
        }
      }
    },
    closeDialog() {
      this.open = false
      this.reset()
    },
    onHide() {
     this.closeDialog()
    },
    reset() {
      this.bid = this.newBid();
      this.emdFilter = ""
      this.emdSelected = ref([])
      this.selectedEmdValue = 0
    },
    getBidStatusOptions() {
      let req= {
        enumName: 'EBidStatus',
        skipList: ['TECHNICAL_ACCEPTED', 'TECHNICAL_REJECTED', 'FINANCIAL_ACCEPTED', 'FINANCIAL_REJECTED', 'AWARDED']
      }
      EnumService.getEumOptions(req)
        .then(response => {
          this.bidStatusOptions = []
          this.bidStatusOptions = response
          // window.alert(JSON.stringify(this.bidStatusOptions))
      }).catch(err => {
        this.emdLoading = false
      });
    },
    getBidSourceSiteOptions() {
      EnumService.getEumOptionsByName('EBidSourceSite')
        .then(response => {
          this.bidSourceSiteOPtions = []
          this.bidSourceSiteOPtions = response
          // window.alert(JSON.stringify(this.bidStatusOptions))
      }).catch(err => {
        this.emdLoading = false
      });
    },
  }
};
</script>

<style>
.jmsc-table-header{
   border-bottom: 0.2px solid rgb(0, 0, 0);
}
.jmsc-table{
   border-bottom: 0.2px solid rgb(0, 0, 0);
}
</style>
