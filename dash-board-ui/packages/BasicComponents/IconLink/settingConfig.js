/*
 * @description: 跳转配置
 * @Date: 2022-09-02 09:32:00
 * @Author: xingheng
 */

import { commonConfig } from 'packages/js/config'

export const settingConfig = {
  displayOption: {
    dataAllocation: {
      // 是否存在数据配置
      enable: false
    }
  }
}
const customConfig = {
  type: "iconLink",
  root: {
    contribution: false
  },
  customize: {
    linkList: [
      {
        name: "模块1",
        url: "http://www.gccloud.com",
        target: "_blank", // _blank:新窗口打开，_self:当前窗口打开
        icon: "17A发送", // 图标
        iconColor: "#007aff" // 图标颜色
      },
      {
        name: "模块2",
        url: "http://www.gccloud.com",
        target: "_blank", // _blank:新窗口打开，_self:当前窗口打开
        icon: "17A发送", // 图标
        iconColor: "#007aff" // 图标颜色
      },
      {
        name: "模块3",
        url: "http://www.gccloud.com",
        target: "_blank", // _blank:新窗口打开，_self:当前窗口打开
        icon: "17A发送", // 图标
        iconColor: "#007aff" // 图标颜色
      },
      {
        name: "模块4",
        url: "http://www.gccloud.com",
        target: "_blank", // _blank:新窗口打开，_self:当前窗口打开
        icon: "17A发送", // 图标
        iconColor: "#007aff" // 图标颜色
      }
    ]
  }
}
export const dataConfig = {
  ...commonConfig(customConfig)
}
