
<template>
  <div
    class="render-wrap render-theme-wrap"
    @drop="drop($event)"
    @dragover.prevent
  >
    <div
      v-for="card in layout"
      v-if="!['texts','horizontalLine','verticalLine'].includes(card.type)"
      :key="card.code"
      :class="{
        'render-item-small': ['bigNumber','currentTime','timeCountDown'].includes(card.type),
        'render-item-mid': ['picture', 'digitalFlop'].includes(card.type),
        'render-item-xmid': ['video'].includes(card.type),
      }"
      class="render-item-box render-item-big"
    >
      <Configuration
        v-if="isDesign"
        :config="card"
        @openRightPanel="openRightPanel"
      >
        <RenderCard
          :ref="'RenderCard' + card.code"
          :config="card"
          :is-design="isDesign"
        />
      </Configuration>
      <RenderCard
        v-else
        :ref="'RenderCard' + card.code"
        :config="card"
        :is-design="isDesign"
      />
    </div>
  </div>
</template>
<script>
import Configuration from 'packages/Render/Configuration.vue'
import RenderCard from './RenderCard'
import { mapActions, mapMutations, mapState } from 'vuex'
import { randomString } from '../../packages/js/utils'
import plotList from 'packages/G2Plots/plotList'
import { getThemeConfig } from '../../packages/js/api/bigScreenApi'
import { G2 } from '@antv/g2plot'
export default {
  name: 'DashboardAppRun',
  components: {
    Configuration,
    RenderCard
  },
  props: {
    isDesign: {
      type: Boolean,
      default: false

    }
  },
  data () {
    return {
      plotList,
      hoverId: null
    }
  },
  computed: {
    ...mapState({
      pageConfig: (state) => state.dashboard.pageInfo.pageConfig,
      pageInfo: (state) => state.dashboard.pageInfo,
      chartList: (state) => state.dashboard.pageInfo.chartList,
      activeCode: (state) => state.dashboard.activeCode,
      hoverCode: (state) => state.dashboard.hoverCode,
      themeJson: (state) => state.dashboard.pageInfo.pageConfig.themeJson,
      isInit: (state) => !state.dashboard.pageLoading
    }),
    pageCode () {
      return this.$route.query.code
    },
    layout: {
      get () {
        const list = this.chartList
        return list.sort((a, b) => {
          if (a.y === b.y) {
            return a.x - b.x
          }
          return a.y - b.y
        })
      },
      set (value) {
        // this.$store.commit('page/changeLayout', value)
      }
    }
  },
  created () {
    // 如果是预览态则调初始化方法
    if (!this.isDesign) {
      this.init()
    }
  },
  mounted () {
    // this.alertMassage()
  },
  methods: {
    ...mapActions('dashboard', [
      'initLayout' // -> this.initLayout()
    ]),
    ...mapMutations('dashboard', [
      'changeLayout',
      'changeActiveCode',
      'changeChartConfig',
      'addItem',
      'delItem',
      'resetPresetLine',
      'changeGridShow',
      'setPresetLine',
      'saveTimeLine',
      'changePageLoading'
    ]),
    init () {
      if (!this.pageCode) { return }
      this.changePageLoading(true)
      this.initLayout(this.pageCode).then(() => {
        const themeName = this.pageConfig.customTheme
        if (this.pageConfig.customTheme === 'custom') {
          getThemeConfig().then((res) => {
            // 初始化时如果就是自定义主题则统一注册
            const { registerTheme } = G2
            registerTheme(themeName, { ...res.chart })
            const pageConfig = this.pageConfig
            pageConfig.themeJson = res
            this.changePageConfig(pageConfig)
            this.styleSet()
            this.changePageLoading(false)
          })
        } else {
          this.changePageLoading(false)
        }
      })
    },
    drop (e) {
      e.preventDefault()
      // 解决：火狐拖放后，总会默认打开百度搜索，如果是图片，则会打开图片的问题。
      e.stopPropagation()
      const transferData = e.dataTransfer.getData('dragComponent')
      if (transferData) {
        this.addChart(transferData, { x: e?.x, y: e?.y })
      }
    },
    // 新增元素
    addChart (chart, position) {
      const { left, top } = this.$el.getBoundingClientRect()
      const _chart = !chart.code ? JSON.parse(chart) : chart
      let option = _chart.option
      if (_chart.type === 'customComponent') {
        option = {
          ...this.plotList?.find((plot) => plot.name === _chart.name)?.option,
          theme: this.pageConfig.customTheme
        }
      }
      const code = !chart.code ? randomString(8) : chart.code
      const config = {
        ..._chart,
        x: 0,
        y: 0,
        w: 12,
        h: 10,
        code,
        i: code,
        option
      }
      config.key = config.code
      this.addItem(config)
    },
    addSourceChart (chart, position) {
      const { left, top } = this.$el.getBoundingClientRect()
      const _chart = JSON.parse(chart)
      let option = _chart.option
      if (_chart.type === 'customComponent') {
        option = {
          ...this.plotList?.find((plot) => plot.name === _chart.name)?.option,
          theme: this.pageConfig.customTheme
        }
      }
      const code = !chart.code ? randomString(8) : chart.code
      const config = {
        ..._chart,
        x: 0,
        y: 0,
        w: 12,
        h: 10,
        code,
        i: code,
        option
      }
      config.key = config.code
      this.addItem(config)
    },
    // 点击当前组件时打开右侧面板
    openRightPanel (config) {
      this.$emit('openRightPanel', config)
    }
  }
}
</script>
<style lang="scss" scoped>
  .render-wrap {
    height: calc(100% - 46px);
    overflow-y: auto;
    background-color: #f5f7fa;
    box-sizing: border-box;
    /*display: flex;*/
    /*justify-content: center;*/
    flex-wrap: wrap;
    .render-item-big {
      position: relative;
      height: 300px;
    }
    .render-item-small {
      position: relative;
      height: 128px;
    }
    .render-item-mid {
      position: relative;
      height: 280px;
    }
    .render-item-xmid {
      position: relative;
      height: 200px;
    }
    .render-item-box {
      width: calc(100% - 16px);
      margin: 8px auto 0 auto;
      /*margin-top: 8px;*/
      background-color: #ffffff;
      &:last-of-type {
        margin-bottom: 8px;
      }
      .opt-icon-wrap {
        z-index: 100;
        display: flex;
        position: absolute;
        right: 10px;
        top: 10px;
        &:hover{
          cursor: pointer;
        }
        .obt-item{
          padding: 0 5px;
        }
      }
    }
  }

</style>
