<template>
  <div class="design-wrap">
    <div class="card-wrap"  v-if="option.data.length">
      <div v-for="(data,index) in option.data" :key="index" class="card-item-wrap">
        <div v-if="option.customizeList[index]" class="value-box"  :style="'font-size:'+ option.customizeList[index].metricFontSize+'px;font-weight:'+ option.customizeList[index].metricFontWeight+';color:'+option.customizeList[index].metricColor">{{option.customizeList[index].numberFormat=='kilobit'?numberToCurrencyNo(data.value):data.value ||'--'}}</div>
        <div v-if="option.customizeList[index]" class="label-box" :style="'font-size:'+ option.customizeList[index].descriptionFontSize+'px;font-weight:'+ option.customizeList[index].descriptionWeight+';color:'+option.customizeList[index].descriptionColor">{{data.label}}</div>
      </div>
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



export default {
  name: 'MultipleNumberChart',
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
    option () {
      // if (!this.config.option.data) return { ...this.config.customize, data: null }
      // const a =
      //   this.config.customize.numberFormat === 'kilobit'
      //     ? numberToCurrencyNo(this.config.option.data)
      //     : this.config.option.data
      return {
        ...this.config.customize,
        data: this.config.option.data
      }
    }
  },
  watch: {},
  mounted () {
    this.chartInit()
  },
  methods: {
    numberToCurrencyNo (value) {
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
    },
    buildOption (config, data) {
      const metricFieldList = config.dataSource.metricFieldList || []
      let multipleDataList = []
      // 当返回的数据状态为成功时
      if (data && data.success) {
        if (data.data && data.data.length) {
          // 返回数据不为空
          metricFieldList.forEach((metric, index) => {
            multipleDataList.push({
              ...data.data[0],
              label: config.customize.customizeList[index].descriptionField,
              value: data.data[0][data.columnData[metric]?.alias]
            })
          })
        } else {
          // 返回的数据为空
          multipleDataList = []
        }
      } else {
        // 返回的模拟数据
        config.customize.customizeList = []
        for (let col in data.columnData) {
          const val = data.columnData[col]
          multipleDataList.push({
            label: val.remark || val.alias,
            value: data.data[0][val.alias]
          })
          config.customize.customizeList.push({
            metric: data.data[0][val.alias], // 指标
            descriptionField: val.remark || val.alias, // 指标名称
            metricFontSize: 30, // 指标字体大小
            metricFontWeight: 700, // 指标字体权重
            metricColor: '', // 指标字体颜色
            descriptionFontSize: 16, // 描述字体大小
            descriptionWeight: 400, // 描述字体权重
            descriptionColor: '', // 描述字体颜色
            numberFormat: 'kilobit' // 指标格式
          })
        }
      }
      // 对返回的数据进行统一处理
      multipleDataList.forEach(data => {
        // 非数字的情况下用其他符号代替
        data.value = isNaN(Number(data.value)) ? '--' : data.value
      })
      config.option = {
        ...config.option,
        data: multipleDataList
      }
      return config
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
  .card-wrap{
    height: calc(100% - 30px);
    display: grid;
    box-sizing: border-box;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    align-items: center;
    justify-items: center;
    grid-gap:20px 20px;
    padding: 0 20px;
    overflow: auto;
  }
  .card-item-wrap{
    width: 100%;
    box-sizing: border-box;
    &:hover{
      cursor: pointer;
    }
  }
  .value-box{
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family:MyFont;
    font-size: 30px;
    font-weight: bold;
  }
  .label-box{
    width: 100%;
    text-align: center;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
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
