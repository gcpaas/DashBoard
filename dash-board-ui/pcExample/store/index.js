import Vue from 'vue'
import Vuex from 'vuex'
import dashboard from 'packages/js/store/index.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    dashboard
  }
})

export default store
