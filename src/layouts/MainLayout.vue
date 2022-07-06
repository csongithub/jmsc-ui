<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar  class="glossy">
        <q-btn class="text-caitalize"
          flat
          dense
          glossy
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
         {{client !== null ? client.displayName : ''}}
        </q-toolbar-title>

        <q-space/>
        
        <q-btn class="" flat @click="$q.fullscreen.toggle()"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'">
          <q-tooltip v-if="$q.fullscreen.isActive">Exit Full Screen</q-tooltip>
          <q-tooltip v-else>Full Screen</q-tooltip>
        </q-btn>
        <div></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
     :width="200"
      :breakpoint="500"
      bordered
      content-class="bg-grey-3"
    >
      <q-scroll-area
        style="height: calc(100% - 150px);  border-right: 1px solid #ddd"
      >
        <q-list padding>
          <q-item exact clickable v-ripple to="/">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>Home</q-item-section>
            </q-item>
          <q-expansion-item
            dense
            dense-toggle
            expand-separator
            :icon="icons.loan"
            label="Banking"
          >
            <q-item exact clickable v-ripple to="/account" class="q-ml-md">
              <q-item-section avatar>
                <q-icon name="book" />
              </q-item-section>
              <q-item-section>Accounts</q-item-section>
            </q-item>
            <q-item exact clickable v-ripple to="/party_accounts" class="q-ml-md">
              <q-item-section avatar>
                <q-icon :name="icons.creditors" />
              </q-item-section>
              <q-item-section>Party</q-item-section>
            </q-item>
            <q-item exact clickable v-ripple to="/payment" class="q-ml-md">
              <q-item-section avatar>
                <q-icon :name="icons.plan" />
              </q-item-section>
              <q-item-section>Payments</q-item-section>
            </q-item>
            <q-item exact clickable v-ripple to="/credit_facility" class="q-ml-md">
              <q-item-section avatar>
                <q-icon :name="icons.cf" />
              </q-item-section>
              <q-item-section>Credit Facility</q-item-section>
            </q-item>
            <q-item exact clickable v-ripple to="/bg_group" class="q-ml-md">
              <q-item-section avatar>
                <q-icon :name="icons.bgGroup" />
              </q-item-section>
              <q-item-section>BG Group</q-item-section>
            </q-item>
            <q-item exact clickable v-ripple to="/loans" class="q-ml-md">
              <q-item-section avatar>
                <q-icon :name="icons.loan" />
              </q-item-section>
              <q-item-section>Loans</q-item-section>
            </q-item>
          </q-expansion-item>
          
          <q-separator></q-separator>
          <q-item exact clickable v-ripple to="/bidding">
            <q-item-section avatar>
              <q-icon :name="icons.bidding" />
            </q-item-section>
            <q-item-section>Bidding</q-item-section>
          </q-item>
          <q-item exact clickable v-ripple to="/site">
            <q-item-section avatar>
              <q-icon :name="icons.site" />
            </q-item-section>
            <q-item-section>Site</q-item-section>
          </q-item>
          <q-separator></q-separator>
           <q-item exact clickable v-ripple to="/profile">
            <q-item-section avatar>
              <q-icon :name="icons.profile" />
            </q-item-section>
            <q-item-section>Profile</q-item-section>
          </q-item>
          <q-item exact clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon :name="icons.logout" />
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog
			v-model="showWelcome"
			persistent
			@hide="reloadApp"
			ref="nefCfRef">
        <q-card class="my-card bg-primary text-white">
        <q-bar class="bg-primary">
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section>
            <div class="text-h6">Welcome Back{{' ' + client.displayName}}</div>
            <div class="text-weight-thin">Have a wonderful experience !</div>
          </q-card-section>
          <q-separator dark/>
          <q-card-section class="q-pt-none">
            <div class="text-italic text-weight-light q-mb-sm">{{'"' +selectedQuote.quote + '"'}}</div>
            <div class="text-italic text-right text-weight-regular">{{'By ' + selectedQuote.person}}</div>
          </q-card-section>
        </q-card>
      </q-dialog>
  </q-layout>
</template>

<script>
import { LocalStorage } from "quasar";
import { commonMixin } from "../mixin/common";

import {
  fasCreditCard,
  fasUserFriends,
  fasPowerOff,
  fasIdCard,
  fasMoneyBillAlt,
  fasGavel,
  fasPiggyBank,
  fasBook,
  fasProjectDiagram
} from "@quasar/extras/fontawesome-v5";
import {
  matCurrencyRupee
} from "@quasar/extras/material-icons";
export default {
  name: "MainLayout",
  mixins: [commonMixin],
  components: {
    // NewPost
  },

  created() {
    this.inactivityTime()
  },
  unmounted() {
    // LocalStorage.clear()
  },
  mounted() {
    //if client has not logged in, then rout to login page, else open landing page
    if (!this.getClient()) {
      this.openLoginLayout();
    }
  },
  setup () {
  },
  data() {
    return {
      showWelcome: false,
      leftDrawerOpen: true,
      client: null,
      tab: "home",
      icons: {
        plan: fasCreditCard,
        creditors: fasUserFriends,
        profile: fasIdCard,
        logout: fasPowerOff,
        cf: fasMoneyBillAlt,
        bidding: fasGavel,
        bank:fasPiggyBank,
        bgGroup: fasBook,
        loan: matCurrencyRupee,
        site: fasProjectDiagram
      },
      quotes: [
        {
          person: 'Rashtrapita Mahatma Gandhi',
          quote: 'Freedom is never dear at any price. It is the breath of life. What would a man not pay for living?'
        },
        {
          person: 'BR Ambedkar',
          quote: 'Freedom of mind is the real freedom. A person whose mind is not free though he may not be in chains, is a slave, not a free man. One whose mind is not free, though he may not be in prison, is a prisoner and not a free man. One whose mind is not free though alive, is no better than dead. Freedom of mind is the proof of one’s existence.'
        },
        {
          person: 'Dr. APJ Abdul Kalam',
          quote: 'Don’t take rest after your first victory because if you fail in second, more lips are waiting to say that your first victory was just luck.'
        },
        {
          person: 'Dr. APJ Abdul Kalam',
          quote: 'Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.'
        },
        {
          person: 'Dr. APJ Abdul Kalam',
          quote: 'To succeed in your mission, you must have single-minded devotion to your goal.'
        },
        {
          person: 'Dr. APJ Abdul Kalam',
          quote: 'If you fail, never give up because FAIL means "First Attempt In Learning.'
        },
        {
          person: 'Dr. APJ Abdul Kalam',
          quote: 'Creativity is seeing the same thing but thinking differently.'
        },
        {
          person: 'Dr. APJ Abdul Kalam',
          quote: 'Failure will never overtake me if my determination to succeed is strong enough.'
        },
        {
          person: 'Dr. APJ Abdul Kalam',
          quote: 'All of us do not have equal talent. But , all of us have an equal opportunity to develop our talents.'
        },
        {
          person: 'Netaji Subhas Chandra Bose',
          quote: 'Life loses half its interest if there is no struggle — if there are no risks to be taken.'
        },
        {
          person: 'Netaji Subhas Chandra Bose',
          quote: 'One individual may die for an idea, but that idea will, after his death, incarnate itself in a thousand lives.'
        },
        {
          person: 'Netaji Subhas Chandra Bose',
          quote: 'Reality is, after all, too big for our frail understanding to fully comprehend. Nevertheless, we have to build our life on the theory which contains the maximum truth.'
        },
        {
          person: 'Netaji Subhas Chandra Bose',
          quote: 'Never lose your faith in the destiny of India. There is no power on Earth that can keep India in bondage. India will be free, that too, soon.'
        },
        {
          person: 'Netaji Subhas Chandra Bose',
          quote: 'It is blood alone that can pay the price of freedom. Give me blood and I will give you freedom.'
        },
      ],
      selectedQuote: {
        person: null,
        quote: null
      }
    };
  },
  methods: {
    openWelcome() {
      this.showWelcome = true;
    },
    reloadApp() {
      this.showWelcome = false
      this.$router.go()
    },
    getClient() {
      //Check if client has already logged in, then get client form local storage
      if (this.client === null && LocalStorage.getItem("auth")) {
        let auth =  LocalStorage.getItem("auth")
        this.client = auth.client
        
        // this if block is workaround of not loading app after login
        if(auth.newlogin){
          auth.newlogin = false
          LocalStorage.set('auth', auth);
          let x = Math.floor((Math.random() * (this.quotes.length-1)) + 0);
          this.selectedQuote = this.quotes[x]
          this.showWelcome = true
        }
        // console.log(JSON.stringify(this.client))
        return true
      } else {
        return false
      }
    },
    handleLogout() {
      this.$q.dialog({
        title: 'Are You Sure?',
        message: '',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.logout()
      }).onOk(() => {
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    logout () {
      LocalStorage.clear()
      this.openLoginLayout()
    },
    rout(path) {
      this.$router.push({ path: path })
    },
    inactivityTime() {
      var time;
      var self = this
      window.onload = resetTimer;
      // DOM Events
      document.onmousemove = resetTimer;
      document.onkeydown = resetTimer;
      document.onload = resetTimer;
      document.onmousemove = resetTimer;
      document.onmousedown = resetTimer; // touchscreen presses
      document.ontouchstart = resetTimer;
      document.onclick = resetTimer;     // touchpad clicks
      document.onkeydown = resetTimer;   // onkeypress is deprectaed
      document.addEventListener('scroll', resetTimer, true); // improved; see comments

      function handleLogout() {
        LocalStorage.clear()
        self.logout()
      }

      function resetTimer() {
        clearTimeout(time);
        time = setTimeout(handleLogout, 1800000) //Timeout 30 mins
        // 1000 milliseconds = 1 second
      }
    }
  }
};
</script>
