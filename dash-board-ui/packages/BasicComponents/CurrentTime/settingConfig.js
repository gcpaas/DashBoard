import { commonConfig } from '../../js/config'

export const settingConfig = {
  time: '',
  theme: 'dark',
  // 设置面板属性的显隐
  displayOption: {
    dataAllocation: {
      // 是否存在数据配置
      enable: false
    }
  }
}
const customConfig = {

  type: 'currentTime',
  root: {
    dateFormat: 'YYYY-MM-DD HH:mm:ss'
  },
  customize: {
    fontSize: 24,
    fontWeight: 700,
    color: '#36474f'
  }

}
export const dataConfig = {
  ...commonConfig(customConfig)
}
