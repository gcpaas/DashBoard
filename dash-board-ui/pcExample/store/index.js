import Vue from 'vue'
import Vuex from 'vuex'
import dashboard from 'dashPackages/js/store/index.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    dashboard
  }
})

export default store
