<template>
  <div class="db-overall-wrap">
    <div class="db-overall-setting-wrap">
      <el-form
        ref="form"
        v-model="form"
        label-width="100px"
        label-position="left"
        class="setting-body"
      >
        <el-form-item label="背景图">
          <el-button
            v-if="!form.bg"
            type="primary"
            @click="$refs.bgImg.init()"
          >
            选择背景图
          </el-button>
          <el-image
            v-show="form.bg"
            class="bg-img db-el-img"
            :src="form.bg"
            fit="cover"
            @click="$refs.bgImg.init()"
          />
          <div
            v-show="form.bg"
            @click="form.bg = ''"
          >
            <i class="el-icon-circle-close close-icon" />
          </div>
          <span
            v-if="form.bg"
            class="description"
          >（背景图优先级高于背景色，设置后将覆盖背景色）</span>
          <BgImg
            ref="bgImg"
            :form="form"
            @imgUrl="form.bg = $event"
          />
        </el-form-item>
        <el-form-item label="背景色">
          <ColorPicker
            v-model="form.bgColor"
            :placeholder="form.bg ? '' : '请选择背景色'"
            :predefine-colors="predefineColors"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ColorPicker from 'packages/ColorPicker/index.vue'
import BgImg from './BgImgDialog.vue'
import { mapState, mapMutations } from 'vuex'
import { getThemeConfig } from 'packages/js/api/bigScreenApi'
import _ from 'lodash'
import { G2 } from '@antv/g2plot'
export default {
  name: 'OverallSetting',
  components: {
    ColorPicker,
    BgImg
  },
  directives: {
    block: {
      bind (el, binding) {
        el.style.width = binding.value || '100%'
      }
    }
  },
  data () {
    return {
      resolutionRatioValue: '',
      // 自适应模式  无(none) 、自动(auto)、宽度铺满(fitWidth)、高度铺满(fitHeight)和 双向铺满（cover） 5 种自适应模式
      autoModeOptions: [
        {
          value: 'none',
          label: '无'
        },
        {
          value: 'auto',
          label: '自动'
        },
        {
          value: 'fitWidth',
          label: '宽度铺满'
        },
        {
          value: 'fitHeight',
          label: '高度铺满'
        },
        {
          value: 'cover',
          label: '双向铺满'
        }
      ],
      drawerVisible: false,
      resolutionRatioOptions: [
        {
          value: '1024*768',
          label: '1024*768'
        },
        {
          value: '1280*720',
          label: '1280*720'
        },
        {
          value: '1920*1080',
          label: '1920*1080'
        },
        {
          value: '2560*1440',
          label: '2560*1440'
        },
        {
          value: '3840*2160',
          label: '3840*2160'
        },
        {
          value: '5120*2880',
          label: '5120*2880'
        },
        {
          value: '7680*4320',
          label: '7680*4320'
        }
      ],
      themeOptions: [
        {
          value: 'dark',
          label: '暗黑'
        },
        {
          value: 'light',
          label: '明亮'
        },
        {
          value: 'auto',
          label: '透明'
        },
        {
          value: 'custom',
          label: '自定义'
        }
      ],
      form: {
        w: 1920,
        h: 1080,
        bg: '',
        bgColor: '#F5F7FA', // 背景色
        opacity: 100,
        customTheme: 'light',
        themeJson: {},
        fitMode: 'none'
      },
      // 预设主题色
      predefineColors: [
        '#007aff',
        '#1aa97b',
        '#ff4d53',
        '#1890FF',
        '#DF0E1B',
        '#0086CC',
        '#2B74CF',
        '#00BC9D',
        '#ED7D32'
      ]
    }
  },
  computed: {
    ...mapState({
      pageInfo: state => state.dashboard.pageInfo,
      config: state => state.dashboard.activeItemConfig
    })
  },
  watch: {
    form: {
      handler (val) {
        this.changePageConfig(val)
        // 改变仪表盘的整体配置后，需要判断元素是否在仪表盘内，如果不在仪表盘内，需要将元素尽量往内部靠拢
        this.pageInfo.chartList.forEach(item => {
          if (item.x + item.w > this.form.w) {
            item.x = this.form.w - item.w
          }
          if (item.y + item.h > this.form.h) {
            item.y = this.form.h - item.h
          }
        })
      },
      deep: true
    }
  },

  created () { },
  mounted () {
    this.initResolution()
    this.init()
  },
  methods: {
    ...mapMutations('dashboard', [
      'changePageLoading',
      'changePageConfig',
      'changeLayout',
      'changeChartKey'
    ]),
    resolutionRatioValueHandel (val) {
      if (val) {
        this.form.w = Number(val.split('*')[0])
        this.form.h = Number(val.split('*')[1])
      } else {
        this.form.w = this.pageInfo.type === 'component' ? 1024 : 1920
        this.form.h = this.pageInfo.type === 'component' ? 768 : 1080
      }
    },
    initResolution () {
      this.resolutionRatioValue = this.pageInfo.pageConfig.w + '*' + this.pageInfo.pageConfig.h
    },
    getThemeConfig (themeName) {
      // this.changePageLoading(true)
      if (!['dark', 'light', 'auto'].includes(themeName)) {
        getThemeConfig().then(res => {
          this.form.themeJson = res
          this.changePageConfig(_.cloneDeep(this.form))
          // 统一注册主题
          const { registerTheme } = G2
          registerTheme(themeName, { ...res.chart })
          this.changeChart(themeName)
        })
      } else {
        this.form.themeJson = {}
        this.changePageConfig(this.form)
        this.changeChart(themeName)
      }
    },
    // 改变
    changeChart (themeName) {
      // 统一改变组件的主题
      const newChartList = _.cloneDeep(this.pageInfo.chartList)
      const chartList = newChartList.map(chart => {
        chart.option.theme = themeName
        chart.key = new Date().getTime()
        // this.changeChartKey(chart.code)
        return chart
      })
      // 可能需要强制性更新chartList
      this.changeLayout(chartList)
    },
    init () {
      this.form = { ...this.pageInfo.pageConfig }
      this.drawerVisible = true
    },
    close () {
      this.drawerVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~packages/assets/style/bsTheme.scss';
.db-overall-wrap {
  position: relative;
  height: 100%;
  background: var(--db-background-2);

  .db-overall-setting-wrap {
    padding: 16px;
  }

  /deep/ .el-input__inner,
  /deep/ .el-color-picker__color-inner,
  /deep/ .el-radio__inner,
  /deep/ .el-input-number--mini,
  /deep/ .el-textarea__inner,
  /deep/ .el-input-group__append,
  /deep/ .el-radio__label {
    // background: var(--db-el-background-1);
    // color: var(--db-el-text);
    // border: 0 !important;
  }

  /deep/ .el-form-item__label {
    color: var(--db-el-title);
    font-size: 12px;
  }

  /deep/ .el-radio {
    margin-right: 10px
  }

  /deep/ .el-table {
    background: var(--db-el-background-1);
    // border-bottom: 1px solid var(--db-el-title);
  }

  /deep/ .el-table__cell {
    background: var(--db-el-background-1) !important;
    color: var(--db-el-title) !important;
    // border-color: var(--db-el-text) !important;
  }

  /deep/ .el-input__inner{
    &:placeholder{
      color: var(--db-el-text);
    }
  }
}

.bg-img {
  width: 200px;
  height: 150px;
  cursor: pointer;
  position: relative;
}

.close-icon {
  left: 170px;
  top: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #ffffff;
  position: absolute;
}

.select {
  display: table-footer-group;
}

.description {
  display: block;
  margin-top: 8px;
  font-size: 12px;
}

.toolbar {
  width: 320px;
  height: 50px;
  bottom: 0;
  z-index: 10;
  position: fixed;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--db-background-1);

  .el-button {
    margin-right: 10px;
  }
}

/deep/ .el-drawer__wrapper {
  z-index: 2000 !important;

  .setting-body {
    padding: 16px;
  }
}

/deep/ .el-drawer__body {
  padding: 0;
  margin-bottom: 0;
  overflow: hidden;
}

/deep/ .el-drawer__container {
  height: calc(100% - 40px) !important;
  top: 40px !important;
  position: relative;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}

.select-item {
  display: flex;
  margin-bottom: 8px;
  cursor: pointer;
  align-items: center;
  border: 1px solid #fff;
  padding: 4px;

  .input-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
    margin-right: 2px;
    color: #36474f;

    /deep/.el-form-item {
      margin-bottom: 0 !important;
    }

    .el-input-number--mini {
      width: 90px !important;
    }
  }

  .input-wrap-right {
    width: 30px;
    flex: unset;
  }

  .input-wrap_left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: left;
  }

  .select-line-icon {
    width: 30px;
    font-size: 18px;
    cursor: pointer;
    text-align: center;
  }

  .option-delete {
    color: #f56c6c;
  }
}

/deep/ .el-color-picker--mini .el-color-picker__trigger {
  height: 32px;
  width: 32px;
  border: 1px solid var(--db-el-background-1);
  background: var(--db-el-background-1);

  .el-color-picker__color {
    background: var(--db-el-background-1);
    // border: 0 !important;
  }
}

// 颜色选择器
</style>
