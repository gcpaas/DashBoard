/*
 * @description: bigScreen公共方法
 * @Date: 2023-03-24 17:10:43
 * @Author: xing.heng
 */
import { mapMutations, mapState } from 'vuex'
import { getChatInfo, getUpdateChartInfo } from '../api/bigScreenApi'
import axiosFormatting from '../../js/utils/httpParamsFormatting'
import _ from 'lodash'
export default {
  data () {
    return {
      filterList: [],
      treeParentId: 0,
      dataLoading: false
    }
  },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      pageCode: state => state.dashboard.pageInfo.code
    }),
    isPreview () {
      return this.$route.path !== window?.DS_CONFIG?.routers?.designUrl
    },
    chatId () {
      let prefix = 'chart_'
      if (this.isDialog) {
        prefix = 'isDialog_chart_'
      } else {
        if (this.$route.path === window?.DS_CONFIG?.routers?.previewUrl) {
          prefix = 'preview_chart_'
        }

        if (this.$route.path === window?.DS_CONFIG?.routers?.designUrl) {
          prefix = 'design_chart_'
        }

        if (this.$route.path === window?.DS_CONFIG?.routers?.pageListUrl) {
          prefix = 'management_chart_'
        }
      }

      return prefix + this.config.code
    }
  },
  mounted () {
    this.chartInit()
  },
  methods: {
    ...mapMutations({
      changeChartConfig: 'dashboard/changeChartConfig',
      changeActiveItemConfig: 'dashboard/changeActiveItemConfig'
    }),
    /**
     * 初始化组件
     */
    chartInit () {
      let config = this.config
      // key和code相等，说明是一进来刷新，调用list接口
      if (this.isPreview) {
        // 改变样式
        config = this.changeStyle(config) ? this.changeStyle(config) : config
        // 改变数据
        config = this.changeDataByCode(config)
      } else {
        // 否则说明是更新，这里的更新只指更新数据（改变样式时是直接调取changeStyle方法），因为更新数据会改变key,调用chart接口
        // eslint-disable-next-line no-unused-vars
        config = this.changeData(config)
      }
    },
    /**
     * 初始化组件时获取后端返回的数据, 返回数据和当前组件的配置_list
     * @param settingConfig 设置时的配置。不传则为当前组件的配置
     * @returns {Promise<unknown>}
     */
    changeDataByCode (config) {
      let currentPage = 1
      let size = 10
      if (config?.option?.pagination) {
        currentPage = config.option.pagination.currentPage
        size = config.option.pagination.pageSize
      }
      return new Promise((resolve, reject) => {
        getChatInfo({
          // innerChartCode: this.pageCode ? config.code : undefined,
          chartCode: config.code,
          current: currentPage,
          pageCode: this.pageCode,
          size: size,
          type: config.type
        }).then(async (data) => {
          let _res = _.cloneDeep(data)
          if (data.executionByFrontend) {
            if (data.data.datasetType === 'http') {
              _res = await axiosFormatting(data.data)
              _res = this.httpDataFormatting(data, _res)
            }
            if (data.data.datasetType === 'js') {
              try {
                const scriptAfterReplacement = data.data.script.replace(/\${(.*?)}/g, (match, p) => {
                  const value = this.config.dataSource?.params[p]
                  if (!isNaN(value)) {
                    return value || p
                  } else {
                    return `'${value}' || '${p}'`
                  }
                })
                // eslint-disable-next-line no-new-func
                const scriptMethod = new Function(scriptAfterReplacement)
                _res.data = scriptMethod()
              } catch (error) {
                console.error('数据集脚本执行失败', error)
              }
            }
          }
          config = this.dataFormatting(config, _res)
          this.changeChartConfig(config)
        }).catch((err) => {
          console.info(err)
        }).finally(() => {
          resolve(config)
        })
      })
    },
    /**
     * @description: 更新chart
     * @param {Object} config
     */
    changeData (config, filterList) {
      const params = {
        chart: {
          ...config,
          option: undefined
        },
        current: 1,
        pageCode: this.pageCode,
        type: config.type,
        filterList: filterList || this.filterList
      }
      return new Promise((resolve, reject) => {
        getUpdateChartInfo(params).then(async (data) => {
          let _res = _.cloneDeep(data)
          if (data.executionByFrontend) {
            if (data.data.datasetType === 'http') {
              _res = await axiosFormatting(data.data)
              _res = this.httpDataFormatting(data, _res)
            }
            if (data.data.datasetType === 'js') {
              try {
                const scriptAfterReplacement = data.data.script.replace(/\${(.*?)}/g, (match, p) => {
                  const value = this.config.dataSource?.params[p]
                  if (!isNaN(value)) {
                    return value || p
                  } else {
                    return `'${value}' || '${p}'`
                  }
                })
                // eslint-disable-next-line no-new-func
                const scriptMethod = new Function(scriptAfterReplacement)
                _res.data = scriptMethod()
              } catch (error) {
                console.error('数据集脚本执行失败', error)
              }
            }
          }
          config = this.dataFormatting(config, _res)
          // this.changeChartConfig(config)
          if (this.chart) {
            // 单指标组件和多指标组件的changeData传参不同
            if (['Liquid', 'Gauge', 'RingProgress'].includes(config.chartType)) {
              this.chart.changeData(config.option.percent)
            } else {
              this.chart.changeData(config.option.data)
            }
          }
          if (['candlestick', 'sankey'].includes(this.config.type) && this.charts) {
            this.updateChartData(config, _res)
          }
        }).catch(err => {
          console.info(err)
        }).finally(() => {
          resolve(config)
        })
      })
    },
    // http前台代理需要对返回的数据进行重新组装
    httpDataFormatting (chartRes, httpRes) {
      let result = {}
      result = {
        columnData: chartRes.columnData,
        data: httpRes,
        success: chartRes.success

      }
      return result
    },
    dataFormatting (config, data) {
      // 覆盖
    },
    newChart (option) {
      // 覆盖
    },
    changeStyle (config) {
      // this.changeChartConfig(config)
      // return config
    }
  }
}
