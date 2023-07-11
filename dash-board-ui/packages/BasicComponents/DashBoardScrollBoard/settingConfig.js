import { commonConfig, displayOption } from 'dashPackages/js/config'

export const settingConfig = {
  header: [],
  columnWidth: [],
  align: [],
  data: [],
  // 设置面板属性的显隐
  displayOption: {
    ...displayOption,
    headerField: {
      enable: false
    },
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
  type: 'dashBoardScrollBoard',
  root: {
    version: '2023071101',
    contribution: false
  },
  customize: {
    rowNum: 5,
    headerBGC: '#007aff',
    oddRowBGC: '',
    evenRowBGC: '',
    waitTime: 2000,
    headerHeight: 35,
    index: false,
    indexHeader: '#',
    carousel: 'single',
    hoverPause: true,
    columnConfig: []
  }
}
export const dataConfig = {
  ...commonConfig(customConfig)
}
