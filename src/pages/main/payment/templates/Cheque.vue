<template>
  <div>
  <q-layout view="lHh lpr lFf" container style="height: 50px" class="">
      <q-header elevated>
        <q-toolbar>
          <q-avatar>
          </q-avatar>
          <q-toolbar-title>
            <div class="q-gutter-sm">
              <q-checkbox size="xs" v-model="branch" val="xs" label="Branch" color="yellow"/>
              <q-checkbox size="xs" v-model="date" val="xs" label="Date" color="yellow"/>
            </div>
          </q-toolbar-title>
            <q-btn class="q-mr-sm text-capitalize" color="primary" glossy size="sm"   label="Print" v-print="printObj"/>
            <q-btn class="text-capitalize" color="primary" glossy size="sm"   label="Close" @click="cancelPrint"/>
        </q-toolbar>
      </q-header>
    </q-layout>

    <div class="print-row" id="printMe">
     
        <div class="row">
            <div class="col text-bold text-right">
                {{dd + '   ' + mm  + '   ' + yyyy}}
            </div>
        </div>
        <br>
        <div class="row q-mb-sm">
            <div class="col-1 text-bold">
                {{''}}
            </div>
            <div class="col text-bold">
                {{'Your Self'}}
            </div>
        </div>
        <div class="row">
            <div class="col-2 text-bold">
                {{''}}
            </div>
            <div class="col text-bold">
               {{payments[0].amount_in_words}}
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import print from 'vue3-print-nb'
import { ref } from 'vue'

export default {
  setup () {
    return {
       
    }
  },
  directives: {
    print   
  },
  props: {
      payments: {default:null, type: Array},
      done: {default: true, type: Boolean}
  },
  created() {},
  mounted() {
    this.currentDate()
  },
  data() {
    return {
      branch: true,
      tab: ref('create'),
      printObj: {
              id: "printMe",
              preview: false,
              previewTitle: 'Preview',
              popTitle: '.',
              url: '',
              previewBeforeOpenCallback (vue) {
              },
              previewOpenCallback (vue) {
                
              },
              beforeOpenCallback (vue) {
              },
              openCallback (vue) {
              },
              closeCallback (vue) {
              }
      },
      dd: null,
      mm: null,
      yyyy: null

    };
  },
  methods: {
    currentDate() {
      const current = new Date();
      this.dd = current.getDate().toString();
      this.mm = (current.getMonth()+1).toString();

      if(this.dd.length === 1)
        this.dd = '0' + this.dd
      this.dd = this.dd[0] + ' ' + this.dd[1]
        
      if(this.mm.length === 1)
        this.mm = '0' + this.mm
      this.mm = this.mm[0] + ' ' + this.mm[1]

      this.yyyy = current.getFullYear().toString()
      this.yyyy  = this.yyyy[0] + '  ' + this.yyyy[1] + '  ' + this.yyyy[2] + '  ' + this.yyyy[3]
    },
    cancelPrint() {
      this.$emit('clsoe')
    }
  }
};
</script>

<style>


.param{
   font-size:10px;
}

.branch{
  font-size:10px;
}
</style>
