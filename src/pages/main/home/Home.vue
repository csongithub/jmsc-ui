<template>
    <div class="q-ma-lg">
        <div class="text-h6 text-center text-italic text-bold text-primary q-mb-lg">
           Welcome Back {{client !== null ?  client.displayName : ''}}, What you want to do today?
        </div>
         <div class="row" v-for="(cardList, index) of listOfCardList" :key="index">
            <div class="col q-ma-lg" v-for="(card, index) of cardList" :key="index">
                <q-card class="my-card text-white bg-primary">
                    <q-card-section>
                        <div class="text-weight-medium">{{card.title}}</div>
                        <div class="text-weight-thin text-italic">{{card.description}}</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn class="text-capitalize" flat :to="card.url">Lets Go</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
         </div>
    </div>
</template>

<script>
import HomeService from "../../../services/HomeService"
import { commonMixin } from "../../../mixin/common"
import {matArrowForward} from "@quasar/extras/material-icons";
export default {
  name: 'Home',
  mixins: [commonMixin],
  setup () {
    return {
        icons: {
            go: matArrowForward
      },
    }
  },
  components: {
  },
  created() {},
  mounted() {
    if(this.client !== null){
      this.getAccessCards()
    }
  },
  data() {
    return {
      client: this.getClient(),
      listOfCardList: []
    };
  },
  methods: {
    getAccessCards(){
          let self = this
          HomeService.accessCards()
          .then(response => {
          self.listOfCardList = response
          console.log(JSON.stringify(self.listOfCardList))
        }).catch(err => {
          this.fail(this.getErrorMessage(err))
        });
      }
  }
};
</script>

<style lang="css" scoped>
.pointer {
  cursor: pointer;
}
.my-card:hover {
  -ms-transform: scale(1.1); /* IE 9 */
  -webkit-transform: scale(1.1); /* Safari 3-8 */
  transform: scale(1.1);
}
</style>