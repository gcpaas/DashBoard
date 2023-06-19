import { mapMutations, mapState } from 'vuex'
import _ from 'lodash'
import { randomString } from 'packages/js/utils'
import Contextmenu from 'vue-contextmenujs'
import Vue from 'vue'
Vue.use(Contextmenu)
export default {
  computed: {
    ...mapState({
      activeCode: state => state.dashboard.activeCode,
      activeCodes: state => state.dashboard.activeCodes,
      hoverCode: state => state.dashboard.hoverCode,
      activeItemConfig: state => state.dashboard.activeItemConfig,
      chartList: state => state.dashboard.pageInfo.chartList,
      presetLine: state => state.dashboard.presetLine
    })
  },
  data () {
    return {

    }
  },
  mounted () {},
  methods: {
    ...mapMutations('dashboard', [
      'changeHoverCode',
      'changeActiveCode',
      'changeChartConfig',
      'addItem',
      'delItem',
      'resetPresetLine',
      'changeLayout',
      'changeZIndex',
      'changeLocked',
      'saveTimeLine'
    ]),
    // 改变hover的组件
    changeHover (code) {
      this.changeHoverCode(code)
    },
    // 改变激活的组件
    changeActive (code) {
      this.changeActiveCode(code)
    },
    // 打开右侧面板
    openRightPanel (config) {
      this.changeActiveCode(config.code)
      this.$emit('openRightPanel', config)
    },
    // 复制组件
    copyItem (config) {
      const newConfig = _.cloneDeep(config)
      const newCode = randomString(8)
      newConfig.code = newCode
      newConfig.i = newCode
      newConfig.title = newConfig.title + '_副本'
      // 区分是从左侧添加还是复制的组件
      newConfig.isCopy = true
      if (config.group) {
        newConfig.group = 'copy_' + config.group
      }
      this.addItem(newConfig)
    },
    // 删除单个组件
    deleteItem (config) {
      this.$confirm('确定删除该组件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      }).then(() => {
        this.delItem(config.code)
      }).catch(() => {})
    },
    // 批量删除组合元素
    deleteGroupItem (config) {
      this.$confirm('确定批量删除选中的组件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      }).then(() => {
        // 找到和本组件group相同的组件 删除
        const codes = this.chartList.filter(_chart => _chart.group === config.group && config.group).map(_chart => _chart.code)
        if (!_.isEmpty(codes)) {
          this.delItem(codes)
        } else {
          this.delItem(config.code)
        }
      })
    },
    // 获取组件的坐标字符串，取整 （100， 100）
    getPoint ({ x, y }) {
      return `(${Math.round(x)}, ${Math.round(y)})`
    },
    // 组合/取消组合图表
    groupChart (chart) {
      if (!chart.group || chart.group === 'tempGroup') {
        // 添加组合
        // eslint-disable-next-line no-unused-expressions
        this.activeCodes?.forEach(code => {
          const config = this.chartList.find(item => item.code === code)
          this.changeChartConfig({
            ...config,
            group: `group_${chart.code}`
          })
        })
        this.saveTimeLine('组合图表')
      } else {
        // 取消组合
        // 找到和本组件group相同的组件 取消group
        this.chartList.forEach(_chart => {
          if (_chart.group === chart.group) {
            this.changeChartConfig({
              ..._chart,
              group: ''
            })
          }
        })
        this.saveTimeLine('取消组合图表')
      }
    },
    // 右键菜单
    onContextmenu (event, chart) {
      event.preventDefault()
      this.$contextmenu({
        items: [
          {
            label: '配置',
            icon: 'el-icon-setting',
            onClick: () => {
              this.openRightPanel(chart)
            }
          },
          {
            label: '删除',
            icon: 'el-icon-delete',
            onClick: () => {
              this.deleteItem(chart)
            }
          },
          {
            label: '复制',
            icon: 'el-icon-copy-document',
            onClick: () => {
              this.copyItem(chart)
            }
          }
        ],
        event, // 鼠标事件信息
        customClass: 'db-context-menu-class', // 自定义菜单 class
        zIndex: 999, // 菜单样式 z-index
        minWidth: 150 // 主菜单最小宽度
      })
      return false
    }
  }
}
