// import { store } from 'quasar/wrappers'
import Vue from 'vue'
import Vuex  from 'vuex'

import party from './party'
// Vue.use(Vuex)

const modules = {
  party
}

//load our store with our modules
const store = new Vuex.Store({modules})


// Automitically run the init action if available for every module
for(const moduleName of Object.keys(modules)) {
  if(modules[moduleName].actions.init) {
    store.dispathc(`${moduleName}/init`)
  }
}

export default store
