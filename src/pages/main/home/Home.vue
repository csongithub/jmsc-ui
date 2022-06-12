<template>
    <div class="q-ma-lg">
        <div class="text-h6 text-center text-italic text-bold text-primary q-mb-lg">
           Welcome Back {{client.displayName}}, How can I help you today?
        </div>
        <div class="row">
            <div class="col q-ma-lg">
                <q-card class="my-card text-white bg-primary">
                    <q-card-section>
                        <div class="text-weight-medium">Add Bank Account</div>
                        <div class="text-weight-thin text-italic">
                            Do yoy have a new bank account?? Ohh that's great!,
                            Please go here to add this account to your list
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn class="text-capitalize" flat to="/account">Lets Go</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col q-ma-lg">
                <q-card class="my-card text-white bg-primary">
                    <q-card-section>
                        <div class="text-weight-medium">Add Party</div>
                        <div class="text-weight-thin text-italic">
                        Do you have got a new party account to make payment,
                        Please go here and add the party bank account.</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn class="text-capitalize" flat to="/manage_party_accounts">Lets Go</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col q-ma-lg">
                <q-card class="my-card text-white bg-primary">
                    <q-card-section>
                        <div class="text-weight-medium">Make Payments</div>
                        <div class="text-weight-thin text-italic">
                        Do yo really think that you have some pending payments??
                        If yes please go here to payout.</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn class="text-capitalize" flat to="/create_payment">Lets Go</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
        </div>
        <div class="row">
            <div class="col q-ma-lg">
                <q-card class="my-card text-white bg-primary">
                    <q-card-section>
                        <div class="text-weight-medium">Manage Facilities</div>
                        <div class="text-weight-thin text-italic">
                            You might really have a good credit facility available.
                            To manage them all, please ho here
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn class="text-capitalize" flat to="/all_cf">Lets Go</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col q-ma-lg"></div>
            <div class="col q-ma-lg"></div>
        </div> 
    
    </div>
</template>

<script>
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

  },
  data() {
    return {
      client: this.getClient(),
    };
  },
  methods: {
    
  }
};
</script>

<style>
.pointer {
  cursor: pointer;
}
.my-card:hover {
  -ms-transform: scale(1.1); /* IE 9 */
  -webkit-transform: scale(1.1); /* Safari 3-8 */
  transform: scale(1.1);
}
</style>