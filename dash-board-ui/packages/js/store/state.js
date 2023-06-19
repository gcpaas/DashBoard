import _ from 'lodash'
export const defaultData = {
  // 仪表盘信息
  pageInfo: {
    className:
      'com.gccloud.dashboard.core.module.manage.dto.DashboardPageDTO',
    id: '',
    name: '测试bigScreen',
    code: '',
    icon: '',
    iconColor: '#007aff',
    orderNum: 0,
    remark: '',
    type: 'dashboard',
    style: '',
    parentCode: '0',

    // 仪表盘页面的配置
    pageConfig: {
      w: 1920,
      h: 1080,
      bgColor: '#F5F7FA', // 背景色
      bg: '', // 背景图
      opacity: 100,
      customTheme: 'light',
      themeJson: {}, // 自定义主题配置
      refreshConfig: [], // 刷新配置
      // 自适应模式  无(none) 、自动(auto)、宽度铺满(fitWidth)、高度铺满(fitHeight)和 双向铺满（cover） 5 种自适应模式
      fitMode: 'none'
    },

    // 图表的集合
    chartList: []
  },

  // 当前选中的组件code
  activeCode: null,
  // 当前鼠标悬浮的组件code
  hoverCode: null,
  // 页面初始化加载状态
  pageLoading: true,
  // 当前选中的组件的配置
  activeItemConfig: null,
  // 当前选中的组件的对齐线
  presetLine: [],
  //  强制更新键
  updateKey: null,

  // 是否显示网格
  hasGrid: false,

  // 多选的组件code数据
  activeCodes: [],
  // false 表示 shift 键没有被按下， true表示 shift 键被按下
  shiftKeyDown: false,
  // 缩放
  zoom: 100,
  // 自适应下的缩放比例
  fitZoom: 100,
  iframeDialog: false
}

export default () => ({
  // 存储的仪表盘timeline信息
  timelineStore: [],
  // 当前的timeline 的index
  currentTimeLine: 0,
  // 具体信息
  ..._.cloneDeep(defaultData)
})
