<!--
 * @Descripttion:
 * @Author: liu.shiyi
 * @Date: 2022-10-13 10:28:55
 * @LastEditTime: 2023-06-14 14:21:40
-->
<template>
  <div class="dashboard-preview-box">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
    />
    <DashboardAppRun />
  </div>
</template>
<script>
// import { DashBoardAppRun } from 'gc-starter-dashboard-render-app'
import { DashboardAppRun } from 'gc-starter-dashboard-app-ui'
// import 'gc-starter-dashboard-render-app/lib/dashboardAppRender.css'
import Vue from 'vue'
import { NavBar } from 'vant'

Vue.use(NavBar)
export default {
  name: 'DashboardRun',
  components: {
    DashboardAppRun
  },
  props: {},
  data () {
    return {
      config: []
    }
  },
  computed: {
    title () {
      return this.$route.query.name
    }
  },
  created () {},
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard-preview-box {
  /*min-height: calc(100vh - 50px);*/
  height: 100%;
  background-color: #f5f7fa;
}
</style>
