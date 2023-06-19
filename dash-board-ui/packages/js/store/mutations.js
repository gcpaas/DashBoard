/*
 * @description: vuex mutations 事件
 * @Date: 2023-03-13 10:04:59
 * @Author: xing.heng
 * @LastEditors: wujian
 * @LastEditTime: 2023-06-16 15:04:33
 */

import Vue from 'vue'
import _ from 'lodash'
import { defaultData } from './state'
import moment from 'moment'
import { EventBus } from 'packages/js/utils/eventBus'
export default {
  // 改变页面基本信息，后端请求的页面信息存储到此处
  changePageInfo (state, pageInfo) {
    state.pageInfo = pageInfo
  },
  // 改变组件列表
  changeLayout (state, layout) {
    state.pageInfo.chartList = layout
  },
  //
  changeIframeDialog  (state, dialogVisible) {
    state.iframeDialog = dialogVisible
  },
  // 改变当前选择组件id
  changeActiveCode (state, code) {
    if (state.activeCode === code) {
      return
    }
    state.activeCode = code
    state.hoverCode = code

    const activeItem = _.cloneDeep(state.pageInfo.chartList?.find(
      item => item.code === code
    ))
    changeGroup(code, state)
    state.activeItemConfig = _.cloneDeep(activeItem)
  },
  changeActiveCodes (state, codes) {
    state.activeCodes = codes
    state.pageInfo.chartList = state.pageInfo.chartList?.map(chart => {
      return {
        ...chart,
        group: (codes.includes(chart.code) && !chart.group) ? 'tempGroup' : chart.group
      }
    })
  },
  // 改变当前hover组件id
  changeHoverCode (state, code) {
    state.hoverCode = code
  },
  changePageLoading (state, booleanValue) {
    state.pageLoading = booleanValue
  },
  // 改变当前组件配置
  changeChartConfig (state, itemConfig) {
    const index = state.pageInfo.chartList.findIndex(
      item => item.code === itemConfig.code
    )
    Vue.set(state.pageInfo.chartList, index, {
      ...state.pageInfo.chartList[index],
      ...itemConfig
    })
    // 对比之前的config和当前的itemConfig的xywh，如果有变化，就改变卡尺对齐线
    const oldConfig = state.pageInfo.chartList[index]
    if (
      oldConfig.x !== itemConfig.x ||
      oldConfig.y !== itemConfig.y ||
      oldConfig.w !== itemConfig.w ||
      oldConfig.h !== itemConfig.h
    ) {
      // 改变当前组件的卡尺对齐线
      changePresetLine(state, itemConfig)
    }
  },
  setPresetLine (state, { x, y, w, h }) {
    state.presetLine = [
      { type: 'h', site: y || 0 },
      { type: 'v', site: x || 0 }
    ]
  },
  changeActiveItemConfig (state, config) {
    state.activeItemConfig = _.cloneDeep(config)
  },
  // 改变当前组件的xywh
  changeActiveItemWH (state, chart) {
    if (chart.code === state.activeItemConfig.code) {
      state.activeItemConfig = {
        ...state.activeItemConfig,
        ...chart
      }
    }
  },
  // 新增一个组件
  addItem (state, itemConfig) {
    // 放到第一项
    state.pageInfo.chartList.unshift(itemConfig)
    changeZIndexFuc(state, state.pageInfo.chartList)
    saveTimeLineFunc(state, '新增组件' + itemConfig?.title)
  },
  // 删除组件/批量删除组件
  delItem (state, codes) {
    if (Array.isArray(codes)) {
      state.pageInfo.chartList = state.pageInfo.chartList.filter(chart => !codes.includes(chart.code))
      state.pageInfo.pageConfig.refreshConfig = state.pageInfo.pageConfig.refreshConfig.filter(timer => !codes.includes(timer.code))
    } else {
      state.pageInfo.chartList = state.pageInfo.chartList.filter(chart => codes !== chart.code)
      state.pageInfo.pageConfig.refreshConfig = state.pageInfo.pageConfig.refreshConfig.filter(item => item.code !== codes)
    }
    // 存储删除后的状态
    saveTimeLineFunc(state, '删除组件')
    // 删除后。关闭右侧面板
    EventBus.$emit('closeRightPanel')
  },
  changePageConfig (state, pageConfig) {
    Vue.set(state.pageInfo, 'pageConfig', _.cloneDeep(pageConfig))
    state.updateKey = new Date().getTime()
  },
  changeActiveItem (state, activeItem) {
    state.activeItem = _.cloneDeep(activeItem)
    state.activeId = activeItem.code
    // state.settingJson = _.cloneDeep(activeItem.settingConfig) || {}
  },
  // 清空卡尺对齐线
  resetPresetLine (state) {
    state.presetLine = []
  },
  // 改变组件的层级
  changeZIndex (state, list) {
    changeZIndexFuc(state, list)
  },
  // 改变锁定状态
  changeLocked (state, config) {
    const index = state.pageInfo.chartList.findIndex(
      item => item.code === config.code
    )
    Vue.set(state.pageInfo.chartList[index], 'locked', !config.locked)
    saveTimeLineFunc(state, !config.locked ? `解锁${config?.title}` : `锁定${config?.title}`)
  },
  // 改变网格显示状态
  changeGridShow (state, isShow) {
    state.hasGrid = isShow
  },
  // 改变组件的key
  changeChartKey (state, code) {
    const index = state.pageInfo.chartList.findIndex(
      item => item.code === code
    )
    if (index < 0) {
      return
    }
    const config = state.pageInfo.chartList[index]
    Vue.set(config, 'key', config.code + new Date().getTime())
  },
  // 改变shift是否被按下
  changeShiftDown (state, isDown) {
    state.shiftKeyDown = isDown
  },
  // 初始化store中的数据，防止污染
  resetStoreData (state) {
    for (const stateKey in state) {
      state[stateKey] = _.cloneDeep(defaultData[stateKey])
    }
  },
  changeZoom (state, zoom) {
    state.zoom = zoom
  },
  changeFitZoom (state, zoom) {
    state.fitZoom = zoom
  },
  changeRefreshConfig (state, refreshConfig) {
    state.pageInfo.pageConfig.refreshConfig = refreshConfig
  },
  changeActivePos (state, { diffX, diffY }) {
    const activeCodes = state.activeCodes
    activeCodes?.forEach(code => {
      const chart = state.pageInfo.chartList.find(item => item.code === code)
      if (chart) {
        chart.x += diffX
        chart.y += diffY
      }
      const index = state.pageInfo.chartList.findIndex(
        item => item.code === chart.code
      )
      if (index < 0) {
        return
      }
      Vue.set(state.pageInfo.chartList, index, {
        ...state.pageInfo.chartList[index],
        ...chart
      })
      changePresetLine(state, chart)
    })
  },
  // 保存当前状态
  saveTimeLine (state, title) {
    const date = new Date()
    const time = moment(date).format('HH:mm:ss')
    // title默认获取当前时间，时分秒
    if (!title) {
      const date = new Date()
      title = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
    saveTimeLineFunc(state, title, time)
  },
  // 撤回/反撤回当前事件线 （undo和redo放到一个函数中，用isUndo区分）
  undoTimeLine (state, isUndo = true) {
    let currentStore = {}
    // 撤回
    if (isUndo) {
      if (state.timelineStore.length > 0 && state.currentTimeLine > 1) {
        // 时间线往前推一个
        state.currentTimeLine = state.currentTimeLine - 1
        currentStore = state.timelineStore[state.currentTimeLine - 1]
        if (currentStore?.chartList) {
          state.pageInfo.chartList = _.cloneDeep(currentStore?.chartList)
        }
      }
    }
    // 反撤回 redo
    if (!isUndo) {
      if (state.currentTimeLine < state.timelineStore.length) {
        // 时间线往后推一个
        state.currentTimeLine = state.currentTimeLine + 1
        currentStore = state.timelineStore[state.currentTimeLine - 1]
        state.pageInfo.chartList = _.cloneDeep(currentStore?.chartList || [])
      }
    }
  },
  clearTimeline (state) {
    // 最后一个状态
    const lastStore = state.timelineStore[state.timelineStore.length - 1]
    // 将最后一个状态作为初始状态，否则下次拖拽后无法回到之前
    state.timelineStore = [
      {
        ...lastStore,
        timelineTitle: '初始状态',
        updateTime: moment(new Date()).format('HH:mm:ss')
      }
    ]
    state.currentTimeLine = 1
  },
  // 回退到指定时间线
  rollbackTimeline (state, index) {
    state.pageInfo.chartList = _.cloneDeep(state.timelineStore[index]?.chartList || [])
    state.currentTimeLine = index + 1
  }
}
function changeZIndexFuc (state, list) {
  const len = list?.length - 1 || 0
  list.forEach((item, i) => {
    const index = state.pageInfo.chartList.findIndex(
      _item => _item.code === item.code
    )
    Vue.set(state.pageInfo.chartList[len - index], 'z', i)
  })
}

// 改变当前组件的卡尺对齐线
function changePresetLine (state, { x, y, w, h }) {
  state.presetLine = [
    { type: 'h', site: y || 0 },
    { type: 'v', site: x || 0 }
  ]
}

function changeGroup (code, state) {
  if (code) {
    // 找到和此组件group相同的组件，并添加到activeCodes中
    const group = state.pageInfo.chartList?.find(item => item.code === code)?.group
    if (group) {
      state.activeCodes = state.pageInfo.chartList?.filter(chart => chart.group === group && chart.group).map(item => item.code)
    }
    if (state.shiftKeyDown) {
      state.activeCodes = _.uniq([...state.activeCodes, code])
      // eslint-disable-next-line no-unused-expressions
      state.pageInfo.chartList?.forEach(chart => {
        if (state.activeCodes.includes(chart.code)) {
          chart.group = 'tempGroup'
        }
      })
    } else {
      if (!group) {
        state.activeCodes = [code]
      }
    }
  } else {
    state.activeCodes = []
    state.pageInfo.chartList = state.pageInfo.chartList?.map(chart => ({
      ...chart,
      group: chart.group === 'tempGroup' ? '' : chart.group
    }))
  }
}

function saveTimeLineFunc (state, title, time) {
  // 最多保存10个状态
  const MAX_TIME_LINE = 10
  const stateCopy = _.cloneDeep(state.pageInfo)
  const date = new Date()
  time = time || moment(date).format('HH:mm:ss')
  stateCopy.timelineTitle = title
  stateCopy.updateTime = time

  if (!Array.isArray(state.timelineStore)) {
    state.timelineStore = []
  }
  if (!Number.isInteger(state.currentTimeLine)) {
    state.currentTimeLine = 0
  }
  if (state.timelineStore.length >= MAX_TIME_LINE) {
    // 去掉最早的一个
    state.timelineStore.shift()
  }
  state.timelineStore?.push(stateCopy)
  state.currentTimeLine = state.timelineStore?.length
}
