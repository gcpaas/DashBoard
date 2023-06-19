<template>
  <div
    v-if="!pageLoading"
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
          height: 'calc(100vh - 48px)'
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
                :isDesign="true"
                ref="Render"
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
      />
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
</template>
<script>
import SourceDialog from './SourceDialog/index.vue'
import ComponentDialog from './ComponentDialog/index.vue'
import iframeDialog from 'packages/BasicComponents/SuperLinkChart/iframeDialog'
import {
  dataConfig,
  settingConfig
} from 'packages/BasicComponents/Picture/settingConfig'
import LeftPanel from './LeftPanel.vue'
import SettingPanel from './SettingPanel.vue'
import PageTopSetting from './PageDesignTop.vue'
import Render from '../Render'
import { mapActions, mapMutations, mapState } from 'vuex'
import { G2 } from '@antv/g2plot'
import multipleSelectMixin from 'packages/js/mixins/multipleSelectMixin'
import { getThemeConfig, getScreenInfo } from 'packages/js/api/bigScreenApi'
import _ from 'lodash'
import { get } from 'packages/js/utils/http'
import { randomString } from '../js/utils'
import { isFirefox } from 'packages/js/utils/userAgent'
import { handleResData } from 'packages/js/store/actions.js'
import AppDashBoard from '../../appPackages/DashboardAppRun/index.vue'
import { EventBus } from 'packages/js/utils/eventBus'
export default {
  name: 'BigScreenDesign',
  components: {
    PageTopSetting,
    LeftPanel,
    Render,
    SettingPanel,
    SourceDialog,
    ComponentDialog,
    iframeDialog,
    AppDashBoard
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
    offset () {
      return {
        x: 220 + 50 - this.ruleStartX,
        y: 55 + 50 - this.ruleStartY
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // 判断进入设计页面前是否有访问权限
    const code = to.query.code
    get(`/dashboard/permission/check/${code}`).then((res) => {
      if (res) {
        next((vm) => {
          // 重置仪表盘的vuex store
          vm.$store.commit('dashboard/resetStoreData')
        })
      } else {
        next('/notPermission')
      }
    })
  },
  created () {
    this.init()
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
      this.changePageLoading(true)
      this.initLayout(this.$route.query.code || this.code)
        .then(() => {
          const themeName = this.pageConfig.customTheme
          if (!['dark', 'light', 'auto'].includes(themeName)) {
            getThemeConfig().then((res) => {
              // 初始化时如果就是自定义主题则统一注册
              const { registerTheme } = G2
              registerTheme(themeName, { ...res.chart })
              const pageConfig = this.pageConfig
              pageConfig.themeJson = res
              this.changePageConfig(pageConfig)
              this.changePageLoading(false)
            })
          } else {
            this.changePageLoading(false)
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
      config.key = new Date().getTime()
      this.changeChartConfig(_.cloneDeep(config))
    },
    // 动态属性更新
    updateDataSetting (config) {
      if (
        this.$refs.Render?.$refs['RenderCard' + config.code][0] &&
        this.$refs.Render?.$refs['RenderCard' + config.code][0]?.$refs[config.code] &&
        this.$refs.Render?.$refs['RenderCard' + config.code][0]?.$refs[config.code]?.updateChartData
      ) {
        this.$refs.Render?.$refs['RenderCard' + config.code][0]?.$refs[
          config.code
        ]?.updateChartData(_.cloneDeep(config))
      }
    },
    onSelectArea (area) {
      const { startX, startY, endX, endY } = area
      // 计算所有在此区域中的组件，如果在此区域中，将其code添加到activeCodes数组中
      const activeCodes = this.chartList
        ?.filter((chart) => {
          const { x, y, w, h } = chart
          return startX <= x && x + w <= endX && startY <= y && y + h <= endY
        })
        ?.map((chart) => chart.code)
      this.changeActiveCodes(activeCodes)
    },
    changeStart ({ x, y }) {
      this.ruleStartX = x
      this.ruleStartY = y
    },
    // 保存并预览
    saveAndPreview () {
      this.$refs.PageTopSetting.execRun()
    },
    // 保存
    save () {
      this.$refs.PageTopSetting.save('saveLoading')
    },
    changeScreenZoom (zoom) {
      // 自适应
      if (zoom === 'auto') {
        this.$refs.Rules.initZoom()
      } else {
        this.changeZoom(zoom)
      }
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

        /deep/ .el-select {
          width: 150px !important;
        }
      }
    }

    /deep/ .el-loading-mask {
      background-color: transparent !important;
    }
    // 移动端样式
    .app-wrap-box{
      position: relative;
      /*width: calc(100% - 210px);*/
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      justify-content: center;
      /*align-items: center;*/
      .app-display-wrapper {
        margin-top: 5%;
        position: relative;
        // 水平垂直居中
        width: 366.318px;
        height: 80%;
        min-height: 600px;
        background: url(packages/DashboardDesign/images/iphone.png) no-repeat center 0;
        background-size: 100% 100%;

        .app-design-wrap {
          // 缩放比例
          position: absolute;
          top: 4rem;
          left: 1.6rem;
          right: 1.6rem;
          bottom: 30px;
          overflow: auto;
          border-radius: 0 0 35px 35px;
        }
      }
    }
    /deep/::-webkit-scrollbar {
      width: 8px;
      border-radius: 8px;
      height: 8px;
    }
    /deep/::-webkit-scrollbar-thumb {
      background: #dddddd;
      border-radius: 10px;
    }

  }
}
</style>
