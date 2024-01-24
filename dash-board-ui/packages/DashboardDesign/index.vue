<template>
  <div
    v-if="hasPermission"
    class="db-page-design-wrap"
  >
    <PageTopSetting
      v-show="headerShow"
      ref="PageTopSetting"
      :right-fold="rightVisiable"
      :terminal="terminal"
      @updateRightVisiable="updateRightVisiable"
      @showPageInfo="showPageInfo"
      @empty="empty"
      @chooseTerminal="chooseTerminal"
    />
    <div class="drag-wrap">
      <!-- 左侧面板 -->
      <LeftPanel
        :header-show="headerShow"
        :height="height"
        @openRightPanel="openRightPanel"
        @openResource="initDialog"
        @openComponent="openComponent"
        @toggleLeftSidebar="toggleLeftSidebar"
        @addComponent="addComponent"
      />
      <!-- 中间组件展示面板 -->
      <div
        v-loading="pageLoading"
        class="grid-wrap-box"
        :style="{
          height: 'calc(100vh - 40px)'
        }"
        tabindex="1000"
        @keydown="designKeydown"
      >
        <Render
          v-if="terminal === 'pc'"
          ref="Render"
          :class="{
            'grid-bg': hasGrid
          }"
          @openRightPanel="openRightPanel"
        />
        <!-- 移动端 -->
        <div
          v-else-if="terminal === 'app'"
          class="app-wrap-box"
        >
          <div
            id="app-dom"
            class="app-wrap app-display-wrapper"
          >
            <div class="app-container app-design-wrap">
              <AppDashBoard
                ref="Render"
                :is-design="true"
                @openRightPanel="openRightPanel"
              />
            </div>
          </div>
        </div>
        <!-- <div class="footer-tools-bar" /> -->
      </div>
      <!-- 右侧折叠设置面板   -->
      <SettingPanel
        :header-show="headerShow"
        :height="height"
        :right-visiable.sync="rightVisiable"
        :page-info-visiable="pageInfoVisiable"
        @updateSetting="updateSetting"
        @updateDataSetting="updateDataSetting"
        @updatePage="updatePage"
      >
        <template #dataSetSelect="{value}">
          <slot
            name="dataSetSelect"
            :value="value"
          />
        </template>
      </SettingPanel>
      <!-- 添加资源面板 -->
      <SourceDialog
        ref="SourceDialog"
        @getImg="setImg"
      />
      <ComponentDialog
        ref="componentDialog"
        @setComponent="setComponent"
        @setRemoteComponent="setRemoteComponent"
      />
      <iframe-dialog
        v-if="iframeDialog"
        ref="iframeDialog"
      />
    </div>
  </div>
  <NotPermission v-else-if="!hasPermission" />
</template>
<script>
import SourceDialog from './SourceDialog/index.vue'
import ComponentDialog from './ComponentDialog/index.vue'
import iframeDialog from 'dashPackages/BasicComponents/SuperLinkChart/iframeDialog'
import {
  dataConfig,
  settingConfig
} from 'dashPackages/BasicComponents/Picture/settingConfig'
import LeftPanel from './LeftPanel.vue'
import SettingPanel from './SettingPanel.vue'
import PageTopSetting from './PageDesignTop.vue'
import Render from '../Render'
import { mapActions, mapMutations, mapState } from 'vuex'
import { G2 } from '@antv/g2plot'
import multipleSelectMixin from 'dashPackages/js/mixins/multipleSelectMixin'
import { getThemeConfig, getScreenInfo } from 'dashPackages/js/api/bigScreenApi'
import _ from 'lodash'
import { randomString } from '../js/utils'
import { isFirefox } from 'dashPackages/js/utils/userAgent'
import { handleResData } from 'dashPackages/js/store/actions.js'
import AppDashBoard from 'dashPackages/DashboardAppRun/index.vue'
import { EventBus } from 'dashPackages/js/utils/eventBus'
import NotPermission from 'dashPackages/NotPermission'
export default {
  name: 'DashboardDesign',
  components: {
    PageTopSetting,
    LeftPanel,
    Render,
    SettingPanel,
    SourceDialog,
    ComponentDialog,
    iframeDialog,
    AppDashBoard,
    NotPermission
  },
  mixins: [multipleSelectMixin],
  props: {
    code: {
      type: String,
      default: ''
    },
    headerShow: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: 'calc(100vh - 40px)'
    }
  },
  data () {
    return {
      hasPermission: true,
      terminal: 'pc', // 终端
      rightVisiable: false,
      pageInfoVisiable: false,
      ruleStartX: 100,
      ruleStartY: 100,
      zoomList: [
        {
          label: '自适应',
          value: 'auto'
        },
        {
          label: '100%',
          value: 100
        },
        {
          label: '80%',
          value: 80
        },
        {
          label: '50%',
          value: 50
        },
        {
          label: '20%',
          value: 20
        }
      ]
    }
  },
  watch: {
    fitZoom (zoom) {
      this.zoomList[0] = {
        label: `自适应(${zoom}%)`,
        value: zoom
      }
    }
  },
  computed: {
    ...mapState({
      pageInfo: (state) => state.dashboard.pageInfo,
      chartList: (state) => state.dashboard.pageInfo.chartList,
      pageConfig: (state) => state.dashboard.pageInfo.pageConfig,
      pageLoading: (state) => state.dashboard.pageLoading,
      hoverCode: (state) => state.dashboard.hoverCode,
      presetLine: (state) => state.dashboard.presetLine,
      updateKey: (state) => state.dashboard.updateKey,
      hasGrid: (state) => state.dashboard.hasGrid,
      zoom: (state) => state.dashboard.zoom,
      fitZoom: (state) => state.dashboard.fitZoom,
      iframeDialog: (state) => state.dashboard.iframeDialog
    }),
    pageCode () {
      return this.code || this.$route.query.code
    },
    offset () {
      return {
        x: 220 + 50 - this.ruleStartX,
        y: 55 + 50 - this.ruleStartY
      }
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   // 判断进入设计页面前是否有访问权限
  //   const code = to.query.code
  //   get(`/dashboard/permission/check/${code}`).then((res) => {
  //     if (res) {
  //       next((vm) => {
  //         // 重置仪表盘的vuex store
  //         vm.$store.commit('dashboard/resetStoreData')
  //       })
  //     } else {
  //       next('/notPermission')
  //     }
  //   })
  // },
  created () {
    // this.changePageLoading(true)
    this.changePageLoading(false)
    this.permission()
    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (isFirefox()) {
      document.body.ondrop = function (event) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  mounted () {
    EventBus.$on('closeRightPanel', () => { this.rightVisiable = false })
  },
  beforeDestroy () {
    this.clearTimeline()
    EventBus.$off('closeRightPanel')
  },
  methods: {
    ...mapActions('dashboard', ['initLayout']),
    ...mapMutations('dashboard', [
      'changeLayout',
      'changePageLoading',
      'resetPresetLine',
      'changeActiveCode',
      'changeActiveCodes',
      'changePageConfig',
      'changeChartConfig',
      'changeChartKey',
      'changeZoom',
      'clearTimeline',
      'saveTimeLine',
      'changeIframeDialog'
    ]),
    // 判断页面权限
    permission () {
      this.$dashboardAxios.get(`/dashboard/permission/check/${this.pageCode}`).then(res => {
        this.hasPermission = res
        if (res) {
          this.init()
        }
      })
    },
    // 切换终端
    chooseTerminal (terminal) {
      this.terminal = terminal
    },
    // 添加资源弹窗初始化
    initDialog () {
      this.$refs.SourceDialog.init()
    },
    openComponent () {
      this.$refs.componentDialog.init()
    },
    // 从组件库添加组件模板到当前画布
    setComponent (component) {
      // 根据component获取页面详情
      getScreenInfo(component.code).then(res => {
        // 给组件库导入的组件加入统一的前缀
        const randomStr = randomString(8)
        const pageInfo = handleResData(res)
        const chartList = pageInfo.chartList.reverse()
        chartList.forEach((chart) => {
          // 如果组件存在数据联动，则将数据联动的code也加上相同的前缀
          if (chart.linkage && chart.linkage.components && chart.linkage.components.length) {
            chart.linkage.components.forEach((com) => { com.componentKey = randomStr + com.componentKey })
          }
          const newChart = {
            ...chart,
            offsetX: 0,
            group: randomStr,
            code: randomStr + chart.code
          }
          this.$refs.Render.addChart(newChart, { x: chart.x, y: chart.y }, true)
          this.updateRightVisiable(false)
        })
      })
    },
    // 添加远程组件
    setRemoteComponent (component) {
      const newChart = {
        ...component,
        offsetX: 0,
        offsetY: 0,
        code: randomString(8)
      }
      this.$refs.Render.addChart(newChart, { x: 0, y: 0 })
    },
    setImg (val) {
      this.$refs.Render.addSourceChart(
        JSON.stringify({
          title: val.originalName,
          name: val.originalName,
          icon: null,
          className:
            'com.gccloud.dashboard.core.module.chart.components.DashboardPictureChart',
          w: 300,
          h: 300,
          x: 0,
          y: 0,
          type: 'picture',
          option: {
            ..._.cloneDeep(settingConfig)
          },
          setting: {}, // 右侧面板自定义配置
          dataHandler: {}, // 数据自定义处理js脚本
          ..._.cloneDeep(dataConfig),
          customize: {
            url: val.url,
            radius: 0,
            opacity: 100
          }
        }),
        { x: 150, y: 100 }
      )
    },
    init () {
      // this.changePageLoading(true)
      this.initLayout(this.$route.query.code || this.code)
        .then(() => {
          const themeName = this.pageConfig.customTheme
          if (!['dark', 'light', 'auto'].includes(themeName)) {
            // getThemeConfig().then((res) => {
            //   // 初始化时如果就是自定义主题则统一注册
            //   const { registerTheme } = G2
            //   registerTheme(themeName, { ...res.chart })
            //   const pageConfig = this.pageConfig
            //   pageConfig.themeJson = res
            //   this.changePageConfig(pageConfig)
            //   this.changePageLoading(false)
            // })
          } else {
            // this.changePageLoading(false)
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.resetPresetLine()
          }, 500)
        })
    },
    // 点击当前组件时打开右侧面板
    openRightPanel (card) {
      this.rightVisiable = true
      this.pageInfoVisiable = false
    },
    /**
     * @description: 清空页面
     */
    empty () {
      this.$confirm('确定清空页面吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      })
        .then(() => {
          this.changeLayout([])
          this.resetPresetLine()
          this.saveTimeLine('清空画布')
        })
        .catch(() => {
          console.info('取消清空画布')
        })
    },
    // 自定义属性更新
    updateSetting (config) {
      if (config.type === 'map'||config.type === 'video'||config.type==='iframeChart') {
        config.key = new Date().getTime()
      }
      this.changeChartConfig(_.cloneDeep(config))
      this.$refs.Render?.$refs['RenderCard' + config.code][0]?.$refs[
        config.code
      ]?.changeStyle(_.cloneDeep(config))
    },
    // 动态属性更新
    updateDataSetting (config) {
      config.key = new Date().getTime()
      this.changeChartConfig(config)
    },
    changeStart ({ x, y }) {
      this.ruleStartX = x
      this.ruleStartY = y
    },
    // 保存
    save () {
      this.$refs.PageTopSetting.save('saveLoading')
    },
    updateRightVisiable (visiable) {
      this.rightVisiable = visiable
      // this.$refs.Rules.initRuleHeight()
    },
    toggleLeftSidebar () {
      // this.$refs.Rules.initRuleHeight()
    },
    showPageInfo () {
      this.pageInfoVisiable = true
      this.rightVisiable = true
      this.changeActiveCode('')
    },
    // 页面信息更改
    updatePage () {
      this.$refs.Rules.initZoom()
    },
    addComponent (component) {
      this.$refs.Render.addChart(component, { x: 0, y: 0 })
    }
  }
}
</script>
<style lang="scss" scoped>
.db-page-design-wrap {
  overflow: auto;

  .drag-wrap {
    display: flex;
    background-color: #F5F7FA;
    height: calc(100vh - 40px);
    overflow: hidden;

    .grid-wrap-box {
      flex: 1;
      overflow: hidden;
      position: relative;
      // margin: 8px 0 0 8px;

      .footer-tools-bar {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        z-index: 1000;
        background-color: var(--db-background-2);

        .db-select-wrap {
          margin-right: 16px;
        }

        .select-zoom-text {
          color: var(--db-el-title);
          margin-right: 16px;
        }

        ::v-deep  .el-select {
          width: 150px !important;
        }
      }
    }

    ::v-deep  .el-loading-mask {
      background-color: transparent !important;
    }
    // 移动端样式
    .app-wrap-box{
      position: relative;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      justify-content: center;
      .app-display-wrapper {
        position: relative;
        padding: 8px;
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
      /*    position: absolute;
          top: 1rem;
          left: .6rem;
          right: .6rem;
          bottom: -2rem;*/
          height: 100%;
          overflow: auto;
          /*border-radius: 0 0 35px 35px;*/
          box-sizing: border-box;
        }
      }
    }
    ::v-deep ::-webkit-scrollbar {
      width: 8px;
      border-radius: 8px;
      height: 8px;
    }
    ::v-deep ::-webkit-scrollbar-thumb {
      background: #dddddd;
      border-radius: 10px;
    }

  }
}
</style>
