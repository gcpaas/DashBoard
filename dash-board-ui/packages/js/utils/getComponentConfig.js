import Icon from 'packages/assets/images/bigScreenIcon/export'
// import _ from 'lodash'
export default function getComponentConfig (type) {
  // const _type = _.upperFirst(type)
  // const className = `com.gccloud.starter.lowcode.page.bigscreen.components.${_type}Chart`
  switch (type) {
    case 'bigNumber':
      return {
        name: '数字图',
        title: '数字',
        icon: Icon.getNameList()[16],
        className: 'com.gccloud.dashboard.core.module.chart.components.DashboardBigNumberChart',
        w: 12,
        h: 6,
        x: 0,
        y: 0,
        type
      }
    case 'multipleNumberChart':
      return {
        name: '数字卡片',
        title: '数字卡片',
        icon: Icon.getNameList()[17],
        className:
          'com.gccloud.dashboard.core.module.chart.components.MultipleNumberChart',
        w: 12,
        h: 8,
        x: 0,
        y: 0,
        type
      }
    case 'iconLink':
      return {
        name: '跳转链接',
        title: '跳转链接',
        icon: Icon.getNameList()[15],
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardIconLinkChart',
        w: 12,
        h: 8,
        x: 0,
        y: 0,
        type
      }
    case 'picture':
      return {
        name: '图片',
        title: '图片',
        icon: Icon.getNameList()[1],
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardPictureChart',
        w: 12,
        h: 10,
        x: 0,
        y: 0,
        type
      }
    case 'dashBoardScrollRanking':
      return {
        name: '排名表',
        title: '排名表',
        icon: Icon.getNameList()[3],
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardScrollRankingChart',
        w: 12,
        h: 10,
        x: 0,
        y: 0,
        type
      }
    case 'tables':
      return {
        name: '表格',
        title: '表格',
        icon: Icon.getNameList()[4],
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardTablesChart',
        w: 12,
        h: 10,
        x: 0,
        y: 0,
        type
      }
    case 'currentTime':
      return {
        name: '当前时间',
        title: '当前时间',
        icon: Icon.getNameList()[6],
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardCurrentTimeChart',
        w: 12,
        h: 5,
        x: 0,
        y: 0,
        type
      }
    case 'timeCountDown':
      return {
        name: '倒计时',
        title: '倒计时',
        icon: Icon.getNameList()[7],
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardTimeCountDownChart',
        w: 12,
        h: 5,
        x: 0,
        y: 0,
        type
      }
    case 'iframeChart':
      return {
        name: '外链',
        title: '外链',
        icon: Icon.getNameList()[8],
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardIframeChart',
        w: 12,
        h: 10,
        x: 0,
        y: 0,
        type
      }
    case 'digitalFlop':
      return {
        name: '翻牌器',
        title: '翻牌器',
        icon: null,
        img: require('packages/BasicComponents/DigitalFlop/images/fanpaiqi.png'),
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardDigitalFlopChart',
        w: 12,
        h: 10,
        x: 0,
        y: 0,
        type
      }
    case 'video':
      return {
        name: '播放器',
        title: '播放器',
        icon: Icon.getNameList()[12],
        className:
          'com.gccloud.dashboard.core.module.chart.components.DashboardVideoChart',
        w: 12,
        h: 10,
        x: 0,
        y: 0,
        type
      }
    //
    // case 'input':
    //   return {
    //     name: '输入框',
    //     title: '输入框',
    //     icon: Icon.getNameList()[13],
    //     className: 'com.gccloud.dashboard.core.module.chart.components.DashboardInputChart',
    //     w: 3,
    //     h: 4,
    //     x: 0,
    //     y: 0,
    //     type
    //   }
    // case 'button':
    //   return {
    //     name: '按钮',
    //     title: '按钮',
    //     icon: Icon.getNameList()[14],
    //     className: 'com.gccloud.dashboard.core.module.chart.components.DashboardButtonChart',
    //     w: 3,
    //     h: 4,
    //     x: 0,
    //     y: 0,
    //     type
    //   }
    default:
      return {}
  }
}
