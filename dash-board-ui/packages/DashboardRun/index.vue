<template>
  <div
    v-if="!pageLoading"
    class="db-preview-wrap"
    :style="previewWrapStyle"
  >
    <div
      class="db-render-wrap render-theme-wrap db-scrollbar"
      :style="renderStyle"
    >
      <grid-layout
        ref="gridlayout"
        :layout.sync="chartList"
        :col-num="24"
        :row-height="10"
        :responsive="true"
        :is-resizable="false"
        :vertical-compact="true"
        :use-css-transforms="true"
        :is-draggable="false"
        :margin="[20, 20]"
        :cols="{ lg: 24, md: 24, sm: 24, xs: 12, xxs: 12 }"
      >
        <grid-item
          v-for="(card) in chartList"
          :id="`${card.code}`"
          :ref="`layoutItem_${card.code}`"
          :key="card.code"
          class="grid-item-box"
          :min-w="1"
          :min-h="2"
          :x="card.x"
          :y="card.y"
          :w="card.w"
          :h="card.h"
          :i="card.i"
        >
          <RenderCard
            :ref="'RenderCard' + card.code"
            :config="card"
          />
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>
<script>
import { get } from 'packages/js/utils/http'
import RenderCard from 'packages/Render/RenderCard.vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import { getThemeConfig } from 'packages/js/api/bigScreenApi'
import { compile } from 'tiny-sass-compiler/dist/tiny-sass-compiler.esm-browser.prod.js'
import { G2 } from '@antv/g2plot'
import VueGridLayout from 'vue-grid-layout'
export default {
  name: 'DashboardRun',
  components: {
    RenderCard,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        code: '',
        fitSelector: '.inner-preview-wrap',
        fitMode: 'auto'
      })
    }
  },
  data () {
    return {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      // 定时器
      timer: null
    }
  },
  computed: {
    ...mapState({
      pageInfo: state => state.dashboard.pageInfo,
      pageConfig: state => state.dashboard.pageInfo.pageConfig,
      stateFitMode: state => state.dashboard.pageInfo.pageConfig.fitMode,
      isInit: (state) => !state.dashboard.pageLoading
    }),
    chartList: {
      get () {
        return this.pageInfo.chartList
      },
      set () {}
    },
    pageCode () {
      // 内部系统取到外部iframe上src链接的code参数
      const iframeCode = this.getIframeCode()
      // 兼容外部网页上的code,iframe上的code以及传入的code
      return this.$route.query.code ||
             iframeCode ||
             this.config.code
    },
    fitMode () {
      return this.config.fitMode || this.stateFitMode
    },
    fitSelector () {
      return this.config.fitSelector
    },
    pageLoading () {
      return this.$store.state.dashboard.pageLoading
    },
    fitPageConfig () {
      return this.resolvePageConfig(this.pageConfig)
    },
    previewWrapStyle () {
      const bg = this.fitMode !== 'none'
        ? {
            backgroundColor: this.fitPageConfig.bgColor,
            backgroundImage: `url(${this.fitPageConfig.bg})`,
            backgroundSize: 'cover'
          }
        : {}

      return {
        overflowX: `${this.fitPageConfig.overflowX}`,
        overflowY: `${this.fitPageConfig.overflowY}`,
        ...bg
      }
    },

    renderStyle () {
      const style = {
        width: '100%',
        height: '100%'
      }

      const bg = this.fitMode === 'none'
        ? {
            backgroundColor: this.fitPageConfig.bgColor,
            backgroundImage: `url(${this.fitPageConfig.bg})`,
            backgroundSize: 'cover'
          }
        : {}

      return {
        ...style,
        ...bg
      }
    }
  },
  watch: {
    pageCode (val) {
      if (val) {
        this.init()
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // 判断进入预览页面前是否有访问权限
    const code = to.query.code
    get(`/dashboard/permission/check/${code}`).then(res => {
      if (res) {
        next(vm => {
          // 重置仪表盘的vuex store
          vm.$store.commit('dashboard/resetStoreData')
        })
      } else {
        next('/notPermission')
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    // 离开的时候 重置仪表盘的vuex store
    this.$store.commit('dashboard/resetStoreData')
    next()
  },
  created () {
    this.init()
    this.getParentWH()
    this.windowSize()
  },
  mounted () {
    this.$nextTick(() => {
      this.startTimer()
    })
  },
  beforeDestroy () {
    this.clearTimer()
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
        this.getParentWH()
      })
    },
    // 设置定时器
    startTimer () {
      let time = 1
      const that = this
      // 使用setTimeout代替setInterval，并在每次循环结束后重新设置定时器。这样可以避免定时器的堆积和性能问题
      // 同时，为了方便清除定时器，可以将定时器的引用保存在变量中，以便后续清除
      this.timer = setTimeout(function refresh () {
        that.pageInfo.pageConfig.refreshConfig.forEach(item => {
          if (item.code) {
            if (time === 1) {
              item.originTime = item.time
            }
            that.chartList.forEach((chart, index) => {
              if (item.code === chart.code && item.time === time) {
                item.time = item.time + item.originTime
                that.$refs['RenderCard' + chart.code][0].$refs[chart.code].updateData()
              }
            })
          }
        })
        time += 1
        that.timer = setTimeout(refresh, 1000)
      }, 1000)
    },
    // 清除定时器
    clearTimer () {
      clearTimeout(this.timer)
    },
    getIframeCode () {
      // 获取当前页面的URL
      const url = window.location.href

      // 解析URL的参数
      let code = null
      // 检查URL中是否包含哈希值
      if (url.indexOf('#') !== -1) {
        // 获取哈希部分的URL
        const hashUrl = url.split('#')[1]
        // 解析哈希部分URL的参数
        const hashParams = new URLSearchParams(hashUrl)
        code = hashParams.get('code')
      } else {
        // 获取URL的查询字符串部分
        const searchParams = new URLSearchParams(url.split('?')[1])
        code = searchParams.get('code')
      }
      return code
    },
    windowSize () {
      window.onresize = () => {
        this.getParentWH()
      }
    },
    getParentWH () {
      this.$nextTick(() => {
        const parent = document.querySelector(this.fitSelector)
        // 如果设置了自适应的选择器
        if (parent) {
          this.innerHeight = parent.offsetHeight
          this.innerWidth = parent.offsetWidth
        } else {
          this.innerHeight = window.innerHeight
          this.innerWidth = window.innerWidth
        }
        // 设置db-preview-wrap的高度为父元素的高度
        const previewWrap = document.querySelector('.db-preview-wrap')
        if (previewWrap) {
          previewWrap.style.height = this.innerHeight + 'px'
          previewWrap.style.width = this.innerWidth + 'px'
        }
      })
    },
    // 获取到后端传来的主题样式并进行修改
    styleSet () {
      const style = document.createElement('style')
      if (this.pageConfig.themeJson && this.pageConfig.themeJson.themeCss) {
        const styleStr = this.pageConfig.themeJson.themeCss
        const themeCss = compile(styleStr).code
        style.type = 'text/css'
        style.innerText = themeCss
        document.getElementsByTagName('head')[0].appendChild(style)
      } else {
        style.remove()
      }
    },
    // 处理自适应下的页面配置
    resolvePageConfig (pageConfig) {
      const { w, h } = pageConfig
      let scaleX = 1
      let scaleY = 1
      let translate = '0px, 0px'
      let overflowX = 'auto'
      let overflowY = 'auto'
      // 自适应模式, 画布等比例自适应后保持一屏展示，会存在某一个方向两边留白，留白部分颜色背景和画布中的背景色一致
      if (this.fitMode === 'auto') {
        const scaleW = this.innerWidth / w
        const scaleH = this.innerHeight / h
        scaleX = Math.min(scaleW, scaleH)
        scaleY = Math.min(scaleW, scaleH)
        translate = `${((this.innerWidth - w) / 2) / scaleX}px, ${((this.innerHeight - h) / 2) / scaleY}px`
        overflowX = 'hidden'
        overflowY = 'hidden'
      }

      // 宽度铺满 预览时画布横向铺满，纵向超出时出现滚动条
      if (this.fitMode === 'fitWidth') {
        scaleX = this.innerWidth / w
        // 如果实际高度小于屏幕，纵向居中
        if (this.innerHeight > h) {
          translate = `${((this.innerWidth - w) / 2) / scaleX}px, ${((this.innerHeight - h) / 2) / scaleY}px`
        } else {
          translate = `${((this.innerWidth - w) / 2) / scaleX}px, 0px`
        }
        overflowX = 'hidden'
      }

      // 高度铺满 预览时画布纵向铺满，横向超出时出现滚动条
      if (this.fitMode === 'fitHeight') {
        scaleY = this.innerHeight / h
        // 如果实际宽度小于屏幕，横向居中
        if (this.innerWidth > w) {
          translate = `${((this.innerWidth - w) / 2) / scaleX}px, ${((this.innerHeight - h) / 2) / scaleY}px`
        } else {
          translate = `0px, ${((this.innerHeight - h) / 2) / scaleY}px`
        }
        overflowY = 'hidden'
      }

      // 双向铺满 预览时画布横向纵向铺满，无滚动条，但是元素可能会出现拉伸情况
      if (this.fitMode === 'cover') {
        scaleX = this.innerWidth / w
        scaleY = this.innerHeight / h
        translate = `${((this.innerWidth - w) / 2) / scaleX}px, ${((this.innerHeight - h) / 2) / scaleY}px`
        overflowX = 'hidden'
        overflowY = 'hidden'
      }
      // 无
      const newPageConfig = {
        ...pageConfig,
        w: w + 'px',
        h: h + 'px',
        scaleX,
        scaleY,
        translate,
        overflowX,
        overflowY
      }
      return newPageConfig
    }
  }
}
</script>

<style lang="scss" scoped>
.db-preview-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;

  .db-render-wrap {
    position: relative;
    background-size: cover;
    overflow: auto
  }
  .grid-item-box{
    border: 1px solid #e8e8e8
  }
}
/deep/.vue-grid-placeholder {
  background: #C6C8CA !important;
}
</style>
