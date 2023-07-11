import { commonConfig, displayOption } from 'dashPackages/js/config'

export const settingConfig = {
  headFontSize: '16',
  subFontSize: '14',
  data: [],
  // 设置面板属性的显隐
  displayOption: {
    ...displayOption,
    params: {
      enable: false
    },
    headerField: {
      enable: false
    },
    dimensionField: {
      // 维度
      label: '维度', // 维度/查询字段
      enable: false,
      multiple: false // 是否多选
    },
    metricField: {
      // 指标
      label: '指标',
      enable: false,
      multiple: false // 是否多选
    }
  }
}
const customConfig = {
  type: 'multipleNumberChart',
  root: {
    version: '2023071101',
    contribution: false
  },
  customize: {
    customizeList: [
    ]
  }
}
export const dataConfig = {
  ...commonConfig(customConfig)
}
