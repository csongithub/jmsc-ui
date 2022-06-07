<template>
    <div>
      <q-dialog
        v-model="openDialog"
        persistent
        @before-show="beforeShow"
        @hide="onHide"
        ref="nefCfRef"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar class="bg-primary glossy">
            {{ dialogLabel }}
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section>
            <q-form @submit="addFacility" @reset="reset" class="q-gutter-md">
              <q-select
                dense
                outlined
                v-model="creditFacility.facilityType"
                :options="facilityList"
                label="Facility Type"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Facility Type i.e BG/FD or NSC'
                ]"
              />
              <q-input
                dense
                outlined
                v-model="creditFacility.accountNumber"
                label="Account Number"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Account number']"
              />
              <q-input
                dense
                outlined
                v-model="creditFacility.amount"
                label="Amount"
                full-width
                lazy-rules
                type="number"
                :rules="[val => (val && val.length > 0) || 'Enter Facility Amount']"
              />

              <div class="row">
                <div class="col q-mr-md">
                  <q-input filled v-model="creditFacility.openDate" :rules="['YYYY-MM-DD']"  label="Open Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="creditFacility.openDate" mask="YYYY-MM-DD">
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
                  <q-input filled v-model="creditFacility.maturityDate" :rules="['YYYY-MM-DD']" label="Maturity Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="creditFacility.maturityDate" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn class="text-capitalize" v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  </q-input>
                </div>
              </div>

              <q-select v-if="creditFacility.facilityType === 'BG' || creditFacility.facilityType === 'FD'"
                dense
                outlined
                v-model="creditFacility.issuerName"
                :options="issuerList"
                label="Issuer Name"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Enter Issuer Name'
                ]"
              />

              <q-input v-if="creditFacility.facilityType === 'NSC'"
                dense
                outlined
                disable
                 v-model="postOffice"
                label="Issuer Name"
                full-width
              />

              <q-input
                dense
                outlined
                v-model="creditFacility.issuerBranch"
                label="Issuer Branch"
                full-width
                lazy-rules
                :rules="[val => (val && val.length > 0) || 'Enter Issuer Branch']"
              />
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
import { commonMixin } from "../../../mixin/common"
import { ref } from 'vue'
export default {
  name: 'New FD',
  mixins: [commonMixin],
  props: {
   open: {default: true, type: Boolean},
   mode: {default: 'add', type: Text},
   dialogLabel: {default: '', type: Text},
   cf: {default: null, type: Object}
  },
  setup () {
    return {
      selected: ref([]),
    }
  },
  watch: {
    cf(val) {
      window.prompt('CATCHED' + JSON.stringify(this.cf))
      this.creditFacility = this.cf
    },
    open(val) {
      this.openDialog = this.open
    }
  },
  created() {},
  mounted() {
  },
  data() {
    return {
      openDialogue: false,
      postOffice: 'Post Office',
      creditFacility: this.newFacility(),
      facilityList: ['BG', 'FD', 'NSC'],
      issuerList: ['Indian Bank', 'SBI']
    };
  },
  methods: {
    newFacility(){
      return {
        accountNumber: null,
        amount: null,
        openDate: ref(this.getTodaysDate()),
        maturityDate: ref(this.getTodaysDate()),
        issuerType: null,
        issuerName: null,
        issuerBranch: null,
        facilityType: null,
        isPledged: null,
        pledgedId: null,
        pledgedType: null
      }
    },
    beforeShow() {
      //this.reset()
    },
    onHide () {
      // eslint-disable-next-line vue/no-mutating-props
      //this.open = false
      this.openDialog = false
      this.$emit('close')
    },
    addFacility() {
      if(this.creditFacility.facilityType === 'NSC') {
        this.creditFacility.issuerType = 'PO'
        this.creditFacility.issuerName = 'Post Office'
      } else {
         this.creditFacility.issuerType = 'BANK'
      }
       this.$emit('add', this.creditFacility)
    },
    reset() {
     this.creditFacility = this.newFacility()
    },
    // getTodaysDate() {
    //   var today = new Date()
    //   let year = today.getFullYear()
    //   let date = today.getDate()
    //   let month = today.getMonth() + 1

    //   if(date/10 < 1) {
    //     date = '0'+ date
    //   }

    //   if(month/10 < 1) {
    //     month = '0' + month
    //   }
    //   return (year + '-' + date + '-' + month)
    // }
  }
};
</script>