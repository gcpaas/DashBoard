import { commonConfig, displayOption } from 'dashPackages/js/config'

export const settingConfig = {
  data: [],
  color: '',
  displayOption: {
    ...displayOption,
    metricField: {
      // 指标
      label: '指标',
      enable: false,
      multiple: false // 是否多选
    },
    dimensionField: {
      // 表格列
      label: '表格列', // 维度/查询字段
      enable: true,
      multiple: true // 是否多选
    }
  }
}
const customConfig = {
  type: 'tables',
  root: {
    version: '2023071101',
    contribution: false
  },
  customize: {
    // 表格头部高度
    headerHeight: 38,
    // 表格头部背景颜色
    headerBackgroundColor: '#fafafa',
    // 表格头部字体颜色
    headerFontColor: '#909399',
    // 表格头部字体大小
    headerFontSize: 14,
    // 表格主体背景颜色
    bodyBackgroundColor: '',
    // 表格主体字体颜色
    bodyFontColor: '#606266',
    // 表格主体字体大小
    bodyFontSize: 14,
    // 表格是否需要斑马纹
    stripe: false,
    // 表格奇数行背景颜色
    oddRowBackgroundColor: '',
    // 表格偶数行背景颜色‘
    evenRowBackgroundColor: ''
    // 表格是否需要边框
    // border: false,
  }
}
export const dataConfig = {
  ...commonConfig(customConfig)
}
