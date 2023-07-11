import { commonConfig, displayOption } from 'dashPackages/js/config'

export const settingConfig = {
  data: null,
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
      enable: true,
      multiple: false // 是否多选
    }
  }
}
const customConfig = {
  type: 'bigNumber',
  root: {
    version: '2023071101',
    contribution: false
  },
  customize: {
    fontSize: 30,
    fontWeight: 700,
    subHeaderFontSize: null,
    numberFormat: 'kilobit',
    dateFormat: null
  }
}
export const dataConfig = {
  ...commonConfig(customConfig)
}
