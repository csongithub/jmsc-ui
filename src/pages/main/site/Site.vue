<template>
    <div>  
      <q-table
        class="my-sticky-header-table"
        dense
        bordered
        flat
        :rows="sites"
        :columns="columns"
        row-key="site_name"
        :loading="loading"
        :pagination="site_pagination"
        :filter="filter"
        v-model:selected="selected"
      >
        <template v-slot:body-cell-agreement_value="props">
          <q-td :props="props">
            <div>
            <q-icon :name="icons.rupee"/>
                {{props.row.agreement_value.toLocaleString('en-IN')}}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div >
               <!-- <q-icon color="primary" :name="icons.view" @click="openView(props.row)"/> -->
               <q-icon class="q-ma-none q-pa-none pointer" color="primary" :name="icons.edit" @click="editSite(props.row)"/>
            </div>
          </q-td>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            outlined
            debounce="300"
            v-model="filter"
            placeholder="Search Site"
          >
          <template v-slot:append>
              <q-icon name="search" />
          </template>
          </q-input>
        </template>
        <template v-slot:top-left>
          <q-btn class="q-mt-sm q-mr-sm text-capitalize" 
               color="primary"
               label="Add" 
               size="sm"
               glossy
               @click="openDialog('add')"
               :icon="icons.plus"/>
          <q-btn class="q-mt-sm q-mr-sm text-capitalize"
                outline
                color="primary" 
                icon="refresh" 
                label="Refresh"
                size="sm"
                glossy
                @click="getAllSites()"/>
        </template>
      </q-table>

      <q-dialog
        v-model="open"
        persistent
        @before-show="beforeShow"
        @hide="onHide"
        ref="newSiteRef"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar class="bg-primary glossy text-white text-weight-light text-subtitle2">
            {{ dialog_label }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <q-form @submit="addSite" @reset="reset" class="q-gutter-md">
              <q-input
                dense
                outlined
                v-model="site.site_name"
                label="Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Site name']"
              />
              <q-input
                dense
                outlined
                v-model="site.display_name"
                label="Display Name"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Display Name']"
              />
              <q-select dense outlined v-model="bid" :options="bidList" label="Selet Bid" />
              <div class="row q-mb-lg" v-if="bid !== null">
                <!-- <div class="col-1">{{'NIT:'}}</div>
                <div class="col-3">{{bid.nit}}</div> -->
                <div class="col-3">{{'Bid Display Name:'}}</div>
                <div class="col">{{bid.display_name}}</div>
              </div>
              <div class="row">
                <div class="col q-mr-md">
                  <q-input
                    dense
                    outlined
                    v-model="site.agreement_no"
                    label="Agreement No"
                    full-width
                  />
                </div>
                <div class="col q-mr-md">
                  <q-input dense outlined v-model="site.agreement_date" :rules="['DD-MM-YYYY']"  label="Agreement Date" :placeholder="'dd-mm-yyyy'">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="site.agreement_date" mask="DD-MM-YYYY">
                          <div class="row items-center justify-end">
                            <q-btn class="text-capitalize" v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-input
                    dense
                    outlined
                    v-model="site.agreement_value"
                    label="Agreement Value"
                    type="number"
                    full-width
                  />
                </div>
              </div>


              <div>
                <q-space />
                <q-btn
                  dense
                  glossy
                  size="sm"
                  :label="mode === 'add' ? 'Add' : 'Update'"
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
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
import SiteService from "../../../services/SiteService"
import BidService from "../../../services/BidService"
import { commonMixin } from "../../../mixin/common"
import { fasPlus, fasEdit } from "@quasar/extras/fontawesome-v5";
import { matCurrencyRupee} from "@quasar/extras/material-icons";
import { date } from 'quasar'
import { ref } from 'vue'
export default {
  name: 'Site',
  mixins: [commonMixin],
  setup () {
    return {
      selected: ref([]),
      columns: [
        {
          name: "site_name",
          required: true,
          label: "Site",
          align: "left",
          field: row => row.site_name,
          format: val => `${val}`,
          sortable: true
        },
        {name: "display_name",  align: "left", label: "Display Name", field: "display_name", sortable: true},
        {name: "agreement_no",  align: "left", label: "Agreement No", field: "agreement_no", sortable: true},
        {
          name: "agreement_date",
          align: "left",
          label: "Agreement Date",
          field: "agreement_date",
          sortable: true
        },
        {name: "agreement_value",  align: "left", label: "Agreement Value", field: "agreement_value", sortable: true},
        {name: "actions", required: true, label: "Actions", field: "actions"}
      ],
      icons: {
        plus: fasPlus,
        edit: fasEdit,
        rupee: matCurrencyRupee
      }
    }
  },
  components: {
  },
  created() {},
  mounted() {
   this.getAllSites()
  },
  data() {
    return {
      client_id: this.getClientId(),
      site_pagination: { rowsPerPage: 10 },
      filter: "",
      loading: true,
      sites: [],
      site: this.newSite(),
      open: false,
      mode: "add",
      dialog_label: "New Account",
      bidList: [],
      bid: ref(null)
    };
  },
  methods: {
    newSite() {
      return {
        id: null,
        client_id: this.client_id,
        site_name:'',
        display_name: '',
        bid_linkage_id: '',
        agreement_no:'',
        agreement_date:null,
        agreement_value:0,
      }
    },
    getAllSites() {
      this.loading = true;
      SiteService.all(this.client_id)
        .then(response => {
        this.sites.splice(0, this.sites.length)
        this.sites = response;
        // window.alert(JSON.stringify(this.sites))
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    addSite() {
      this.site.client_id = this.client_id
      this.site.bid_linkage_id = this.isNotNullOrUndefined( this.bid) ?  this.bid.value : null
      SiteService.create(this.site)
        .then(response => {
          if(this.mode === 'add') {
            this.sites.unshift(response)
            this.success("Site create Successfully")
          } else if(this.mode === 'edit'){
             this.success("Site Updated Successfully")
          }
          this.$refs.newSiteRef.hide();
      }).catch(err => {
        this.loading = false;
        this.fail(this.getErrorMessage(err))
      });
    },
    editSite(row){
      console.log(JSON.stringify(row))
      this.site = row
      console.log(JSON.stringify(this.site))
      this.dialog_label = "Update Site";
      this.getBids()
      this.open = true;
    },
    beforeShow() {},
    openDialog(mode) {
      this.mode = mode;
      if (this.mode === "add") {
        this.dialog_label = "New Site";
      }
      this.getBids()
      this.open = true;
    },
    getBids() {
      BidService.getBidsByStatus(this.client_id, 'AWARDED')
        .then(response => {
        this.bidList.splice(0, this.bidList.length)
        for(let bid of response) {
          if(this.isNullOrUndefined(bid.siteId)){
             let object = {'value': bid.id, 'nit': bid.nit ,'label': bid.title, 'display_name': bid.displayName}
             this.bidList.push(object)
          } else {
            if(this.site.bid_linkage_id === bid.id) {
             let object = {'value': bid.id, 'nit': bid.nit ,'label': bid.title, 'display_name': bid.displayName}
             this.bidList.push(object)
             this.bid = object
            }
          }
        }
      }).catch(err => {
         this.fail(this.getErrorMessage(err))
      });
    },
    onHide() {
      this.reset();
      this.mode='add'
    },
    reset() {
      this.site = this.newSite();
      this.bid = ref(null)
    }
  }
};
</script>