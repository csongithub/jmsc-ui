<template>
<div>
  
        <div class="row q-mt-md">
            <div class="col">{{'Total: INR ' + totalExpense.toLocaleString('en-IN')}}</div>
        </div>
       
    
    <div>
        <div class="row q-mt-md ">
            <div class="col"><b>S No</b></div>
            <div class="col"><b>Item</b></div>
            <div class="col"><b>Cost</b></div>
            <div class="col"></div>
            <div class="col"></div>
        </div>
        <div class="row q-mb-sm" v-for="(expense, index) in expenseList" :key="index">
            <div class="col">{{index + 1}}</div>
            <div class="col"><input type="text" v-model="expense.item"/></div>
            <div class="col"><input type="text" v-model="expense.cost" style="max-width:100px"/></div>
            <div class="col"><span style="cursor:pointer; color:red" @click="removeExpense(index)">X</span></div>
            <div class="col"></div>
        </div>
    </div>
    <q-separator class="q-mb-sm"/>
    <button type="button" @click="addExpense" class="q-mr-sm">Add Item</button>
    <button type="button" @click="saveCost">Save</button>
</div>
</template>

<script>
import { ref } from 'vue'
import { date } from 'quasar'
import { commonMixin } from "../../../mixin/common"
import BidService from "../../../services/BidService"
export default {
  name: 'FeeDetails',
  mixins: [commonMixin],
  props: {
    bid: {
      type: Object,
      default: null
    },
  },
  watch: {
  },
  setup () {
    return {
        
    }
  },
  created() {

  },
  mounted() {
    this.getBidCost()
  },
  components: {
  },
  data() {
    return {
        expense: this.getNewExpense(),
        expenseList: [{item: '', cost: 0}],
        totalExpense: 0
    };
  },
  methods: {
      getNewExpense(){
          return {
              item: '',
              cost: 0
          }
      },
      addExpense(){
          let expense = this.getNewExpense()
          this.expenseList.push(expense)
      },
      removeExpense(index){
          this.expenseList.splice(index, 1)
      },
      saveCost(){
        let otherCostJson = JSON.stringify(this.expenseList)
        let otherCost = {
            clientId: this.bid.clientId,
            bidId: this.bid.id,
            otherCostJson: otherCostJson
        }
        console.log(otherCost)
        BidService.saveOtherCost(otherCost)
        .then(response => {
        this.getBidCost()
        this.success('Expense Saved')
      }).catch(err => {
      });
    },
    getBidCost(){
      let self = this
      self.totalExpense = 0
      BidService.getBidCost(this.bid.id)
        .then(response => {
        let bidCost = response
        let otherCostJson = bidCost.otherCost
        if(otherCostJson != null){
           this.expenseList = JSON.parse(otherCostJson)
           //window.alert('OK' + JSON.stringify(this.expenseList))
           for(let e of self.expenseList){
               self.totalExpense = self.totalExpense + parseInt(e.cost)
           }
        }
      }).catch(err => {
      });
    },
  }
};
</script>
