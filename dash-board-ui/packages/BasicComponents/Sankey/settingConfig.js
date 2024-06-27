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
    dimensionField: {
      // 指标
      label: '起始节点',
      enable: true,
      multiple: false // 是否多选
    },
    metricField: {
      label: '目标节点', // 维度/查询字段
      enable: true,
      multiple: false // 是否多选
    },
    seriesField: {
      // 系列
      label: '权重',
      enable: true,
      multiple: false // 是否多选
    }
  }
}
const customConfig = {
  type: 'sankey',
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
    top: 20,
    bottom: 20,
    left: 20,
    right: 50,
    // 自定义样式
    normal: {
      labelPosition: 'right',
      labelColor: 'rgba(140, 140, 140, 1)',
      labelSize: 12,
      labelFontWeight: 'normal',
      itemBorderColor: '#aaa',
      itemBorderWidth: 1,
      itemBorderType: 'solid',
      lineColor: 'gradient',
      lineCurveness: 0.5
    },
    emphasis: {
      labelPosition: 'right',
      labelColor: 'rgba(140, 140, 140, 1)',
      labelSize: 12,
      labelFontWeight: 'bold',
      itemBorderColor: '#aaa',
      itemBorderWidth: 1,
      itemBorderType: 'solid',
      lineColor: 'gradient',
      lineCurveness: 0.5
    }
  }
}

export const dataConfig = {
  ...commonConfig(customConfig)
}

export const sankeyData = {
  name: '桑基图',
  title: '桑基图',
  icon: Icon.getNameList()[19],
  border: { type: '', titleHeight: 60, fontSize: 16, isTitle: true, padding: [0, 0, 0, 0] },
  className:
    'com.gccloud.dashboard.core.module.chart.components.DashboardSankeyChart',
  w: 12,
  h: 10,
  x: 0,
  y: 0,
  type: 'sankey',
  option: {
    ...cloneDeep(settingConfig)
  },
  setting: undefined, // 右侧面板自定义配置
  dataHandler: {}, // 数据自定义处理js脚本
  ...cloneDeep(dataConfig)
}
