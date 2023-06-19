import Vue from 'vue'
import IconSvg from './SvgIcon.vue' // svg组件

// register globally
Vue.component('icon-svg', IconSvg)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
