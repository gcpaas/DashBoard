import { commonConfig, displayOption } from 'dashPackages/js/config'

export const settingConfig = {
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
      enable: true,
      multiple: false // 是否多选
    },
    dimensionField: {
      // 维度
      label: '维度', // 维度/查询字段
      enable: true,
      multiple: false // 是否多选
    }
  }
}
const customConfig = {
  type: 'dashboardScrollRanking',
  root: {
    contribution: false
  },
  customize: {
    highlightNum: 4, // 高亮显示数量
    highlightStyle: [
      // 高亮显示自定义样式
      { highlightColor: '#314659', mark: 0 },
      { highlightColor: '#314659', mark: 1 },
      { highlightColor: '#314659', mark: 2 },
      { highlightColor: '#314659', mark: 3 }
    ]
  }
}
export const dataConfig = {
  ...commonConfig(customConfig)
}
