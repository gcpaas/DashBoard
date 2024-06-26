import { commonConfig, displayOption } from 'dashPackages/js/config'
import Icon from 'dashPackages/assets/images/bigScreenIcon/export'
import cloneDeep from 'lodash/cloneDeep'

export const settingConfig = {
  padding: [10, 10, 10, 10],
  legend: false,
  isGroup: true,
  data: [],
  color: '',
  theme: 'dark',
  displayOption: {
    ...displayOption,
    params: {
      enable: true
    },
    headerField: {
      enable: false
    }
  }
}
const customConfig = {
  type: 'candlestick',
  root: {
    version: '2023071001',
    contribution: false,
    // 绕x轴旋转角度
    rotateX: 0,
    // 绕y轴旋转角度
    rotateY: 0,
    // 绕z轴旋转角度
    rotateZ: 0,
    // 透视距离
    perspective: 0,
    skewX: 0,
    skewY: 0
  },
  customize: {
    // 自定义样式
    highColor: '#c23531',
    lowColor: '#314656',
    gridShow: true,
    gridColor: 'rgba(208, 208, 208, 1)',
    gridWidth: 1,
    left: 50,
    right: 20,
    top: 20,
    bottom: 60,
    xAxis: {
      name: '',
      nameGap: 30,
      nameColor: 'rgba(140, 140, 140, 1)',
      nameSize: 16,
      position: 'center',
      tickWidth: 1,
      tickColor: 'rgba(208, 208, 208, 1)',
      labelColor: 'rgba(140, 140, 140, 1)',
      labelSize: 12,
      lineColor: 'rgba(208, 208, 208, 1)',
      lineWidth: 1
    },
    yAxis: {
      name: '',
      nameGap: 10,
      nameColor: 'rgba(140, 140, 140, 1)',
      nameSize: 16,
      position: 'center',
      tickWidth: 1,
      tickColor: 'rgba(208, 208, 208, 1)',
      labelColor: 'rgba(140, 140, 140, 1)',
      labelSize: 12,
      lineColor: 'rgba(208, 208, 208, 1)',
      lineWidth: 1
    }
  }
}

export const dataConfig = {
  ...commonConfig(customConfig)
}

export const candlestickData = {
  name: 'K线图',
  title: 'K线图',
  icon: Icon.getNameList()[18],
  border: { type: '', titleHeight: 60, fontSize: 16, isTitle: true, padding: [0, 0, 0, 0] },
  className:
    'com.gccloud.dashboard.core.module.chart.components.DashboardCandlestickChart',
  w: 12,
  h: 10,
  x: 0,
  y: 0,
  type: 'candlestick',
  option: {
    ...cloneDeep(settingConfig)
  },
  setting: undefined, // 右侧面板自定义配置
  dataHandler: {}, // 数据自定义处理js脚本
  ...cloneDeep(dataConfig),
  dataSource: {
    ...cloneDeep(dataConfig.dataSource),
    xfield: '',
    openField: '',
    closeField: '',
    lowField: '',
    highField: ''
  }
}
