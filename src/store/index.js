import Vue from 'vue'
import Vuex from 'vuex'
import alert from './alert.js'
import prevUrl from './prevUrl.js'
import auth from './auth.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    alert,
    prevUrl,
    auth
  }
})
