<template>
  <div class="design-wrap">
    <div
      v-if="option.data"
      class="value"
      :style="'font-size:'+ config.customize.fontSize +'px;font-weight:'+ config.customize.fontWeight"
    >
      {{ option.data }}
    </div>
    <div
      v-else
      class="value"
    >
      暂无数据
    </div>
  </div>
</template>
<script>
import { refreshComponentMixin } from 'packages/js/mixins/refreshComponent'
import commonMixins from 'packages/js/mixins/commonMixins'
import paramsMixins from 'packages/js/mixins/paramsMixins'
import linkageMixins from 'packages/js/mixins/linkageMixins'

function numberToCurrencyNo (value) {
  if (!value || isNaN(value)) return '--'
  if (typeof value === 'string' && value.indexOf(',') !== -1) {
    return value
  }
  // 获取整数部分
  const intPart = Math.trunc(value)
  // 整数部分处理，增加,
  const intPartFormat = intPart
    .toString()
    .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  // 预定义小数部分
  let floatPart = ''
  // 将数值截取为小数部分和整数部分
  const valueArray = value.toString().split('.')
  if (valueArray.length === 2) {
    // 有小数部分
    floatPart = valueArray[1].toString()// 取得小数部分
    return intPartFormat + '.' + floatPart
  }
  return intPartFormat + floatPart
}

export default {
  name: 'BigNumber',
  components: {
  },
  mixins: [refreshComponentMixin, paramsMixins, commonMixins, linkageMixins],
  props: {
    // 卡片的属性
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {}
  },
  computed: {
    option: {
      get () {
        if (!this.config.option.data) return { ...this.config.customize, data: null }
        const a =
        this.config.customize.numberFormat === 'kilobit'
          ? numberToCurrencyNo(this.config.option.data)
          : this.config.option.data
        return {
          ...this.config.customize,
          data: a
        }
      },
      set (val) {
      }
    }
  },
  watch: {},
  mounted () {
    this.chartInit()
  },
  methods: {
    buildOption (config, data) {
      let dataList = ''
      if (data.data instanceof Array) {
        dataList = config.dataSource.metricField
          ? data.data[0][config.dataSource.metricField]
          : data.data[0]['sum(num)']
      } else {
        dataList = data.data[config.dataSource.metricField]
      }
      config.option = {
        ...config.option,
        data: dataList
      }
      return config
    },
    updateData () {
      this.getCurrentOption().then(({ data, config }) => {
        if (data.success) {
          const _config = this.buildOption(config, data)
          this.config.option.data = _config.option.data
          this.config.customize.numberFormat = _config.customize.numberFormat
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './font/iconFont/dashBoardIconFont.css';
  @import "./font/font.css";
.design-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  .value {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: calc(100% - 30px);
    font-size: 20px;
    font-weight: bold;
    font-family:MyFont;
    overflow: auto;
  }
  .el-icon-warning{
    color: #FFD600;
  }
}
.title-hover{
  &:hover{
    cursor: move;
  }
}
/*滚动条样式*/
/deep/::-webkit-scrollbar {
  width: 4px;
  border-radius: 4px;
  height: 4px;
}
/deep/::-webkit-scrollbar-thumb {
  background: var(--gc-scroll) !important;
  border-radius: 10px;
}
</style>
