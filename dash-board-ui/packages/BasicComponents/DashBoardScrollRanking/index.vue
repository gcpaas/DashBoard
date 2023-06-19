<template>
  <div class="design-wrap">
    <div
      v-if="config.option.data.length > 0"
      class="chart-list"
    >
      <ul
        v-for="(item,index) in config.option.data"
        :key="index"
        style="padding: 0;list-style: none;"
      >
        <li class="chart-right-list">
          <span
            v-if="index < config.customize.highlightNum"
            class="list-serial-top"
            :style="'background-color:'+config.customize.highlightStyle[index].highlightColor"
          >{{ index +1 }}</span>
          <span
            v-else
            class="list-serial"
          >{{ index +1 }}</span>
          <span class="list-name">{{ item.name }}</span>
          <span class="list-num">{{ item.value }}</span>
        </li>
      </ul>
    </div>
    <empty v-if="!config.option.data.length">
      暂无数据
    </empty>
  </div>
</template>
<script>
import _ from 'lodash'
import commonMixins from 'packages/js/mixins/commonMixins'
import paramsMixins from 'packages/js/mixins/paramsMixins'
import linkageMixins from 'packages/js/mixins/linkageMixins'
import Empty from './Empty'
export default {
  name: 'Rank',
  mixins: [paramsMixins, commonMixins, linkageMixins],
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  components: { Empty },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    this.chartInit()
  },
  methods: {
    buildOption (config, data) {
      let _x = null
      let _y = null
      let dataList = []
      if (data && data.success) {
        if (data && data.data && data.data.length) {
          // 返回数据不为空
          _x = config.dataSource.dimensionField
          _y = config.dataSource.metricField
          dataList = data.data.map(item => {
            return {
              ...item,
              name: item[_x],
              value: item[_y]
            }
          })
        } else {
          // 返回的数据为空
        }
      } else {
        // 数据请求状态失败时
        dataList = data.data.map(item => {
          return {
            ...item,
            name: item.name,
            value: item['sum(num)']
          }
        })
      }
      dataList = config.dataFlag
        ? dataList
        : _.cloneDeep(dataList).splice(0, 10)
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
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .design-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    .title-box{
      height: 40px;
      padding: 10px 10px 0 0;
      box-sizing: border-box;
      .title {
        font-size: 14px;
        color: #333;
        font-weight: bold;
        border-left: 3px solid #007aff;
        padding-left: 16px;
      }
      &:hover{
        cursor: move;
      }
    }
    .el-icon-warning{
      color: #FFD600;
    }
    .el-icon-warning{
      color: #FFD600;
    }
    .chart-list{
      width: 100%;
      padding: 0 16px 16px 16px;
      overflow-y: auto;
      height: calc(100% - 27px);
      .chart-right-list{
        display: flex;
        align-items: center;
        margin-top: 16px;
        zoom: 1;

        .list-serial-top{
          color: #fff;
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-top: 1.5px;
          margin-right: 16px;
          font-weight: 600;
          font-size: 12px;
          line-height: 20px;
          text-align: center;
          border-radius: 20px;
        }
        .list-serial{
          color: #314659;
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-top: 1.5px;
          margin-right: 16px;
          font-weight: 600;
          font-size: 12px;
          line-height: 20px;
          text-align: center;
          background-color: #fafafa;
          border-radius: 20px;
        }
        .list-name{
          flex: 1 1;
          margin-right: 8px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .list-num{
          color: rgba(0,0,0,.85);
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
    }
  .el-empty{
    position: absolute;
    top: 20%;
    height: 100%;
    width: 100%;
    margin-top: -60px;
    /deep/.el-empty__image{
      width: 60%;
      height: 60%;
    }
  }
</style>
