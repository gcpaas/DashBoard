
<template>
  <div class="dashboard-preview-wrap">
    <div
      id="app-box"
      class="app-wrap app-display-wrapper"
    >
      <div class="app-container app-design-wrap">
        <DashboardAppRun />
      </div>
    </div>
  </div>
</template>
<script>
import DashboardAppRun from 'dashPackages/DashboardAppRun/index.vue'
import { getThemeConfig } from '../js/api/bigScreenApi'
import { G2 } from '@antv/g2plot'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'AppPreview',
  components: {
    DashboardAppRun
  },
  props: {},
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      pageInfo: state => state.dashboard.pageInfo,
      pageConfig: state => state.dashboard.pageInfo.pageConfig,
      chartList: state => state.dashboard.pageInfo.chartList,
      stateFitMode: state => state.dashboard.pageInfo.pageConfig.fitMode,
      isInit: (state) => !state.dashboard.pageLoading
    }),
    pageCode () {
      return this.$route.query.code
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('dashboard', [
      'initLayout' // -> this.initLayout()
    ]),
    ...mapMutations('dashboard', [
      'changeLayout',
      'changePageLoading',
      'changePageConfig'
    ]),
    init () {
      if (!this.pageCode) { return }
      // this.changePageLoading(true)
      this.changePageLoading(false)
      this.initLayout(this.pageCode).then(() => {
        const themeName = this.pageConfig.customTheme
        if (this.pageConfig.customTheme === 'custom') {
          // getThemeConfig().then((res) => {
          //   // 初始化时如果就是自定义主题则统一注册
          //   const { registerTheme } = G2
          //   registerTheme(themeName, { ...res.chart })
          //   const pageConfig = this.pageConfig
          //   pageConfig.themeJson = res
          //   this.changePageConfig(pageConfig)
          //   this.styleSet()
          //   this.changePageLoading(false)
          // })
        } else {
          // this.changePageLoading(false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-preview-wrap {
    /*min-height: calc(100vh - 50px);*/
    height: 100vh;
    background-color: #f5f7fa;
    position: relative;
    display: flex;
    justify-content: center;
    overflow: auto;
  }
  /*滚动条样式*/
  ::v-deep ::-webkit-scrollbar {
    width: 6px;
    border-radius: 4px;
    /*height: 4px;*/
  }
  ::v-deep ::-webkit-scrollbar-thumb {
    background: #dddddd !important;
    border-radius: 10px;
  }
  // 为同时满足在pc端和移动端查看的效果，加入媒体查询
  @media (max-width: 600px) {
    .app-display-wrapper {
      position: relative;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 100%;
      height: 100%;
      box-shadow: 0px 0px 10px #dddddd;
      .app-design-wrap {
        // 缩放比例
        position: absolute;
        top: 1rem;
        left: .6rem;
        right: .6rem;
        bottom: -2rem;
        overflow: auto;
        border-radius: 0 0 35px 35px;
      }
    }
  }
  @media (min-width: 600px) {
    .app-display-wrapper {
      padding: 8px;
      position: relative;
      top: 0;
      bottom: 0;
      margin: 16px 0;
      width: 375px;
      height: calc(100% - 32px);
      background-size: 100% 100%;
      box-shadow: 0px 0px 10px #dddddd;
      box-sizing: border-box;
      .app-design-wrap {
        // 缩放比例
      /*  position: absolute;
        top: 1rem;
        left: .6rem;
        right: .6rem;
        bottom: -1rem;*/
        height: 100%;
        overflow: auto;
        /*border-radius: 0 0 35px 35px;*/
        box-sizing: border-box;
      }
    }
  }
</style>
