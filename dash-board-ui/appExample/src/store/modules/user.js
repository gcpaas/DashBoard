/* eslint-disable no-unused-vars */
/*
 * @description:
 * @Author: wujian
 * @Date: 2022-10-11 14:17:48
 * @LastEditors: wujian
 * @LastEditTime: 2023-06-05 16:51:51
 */
import * as userService from '@/service/UserService'
import * as loginService from '@/service/LoginService'
import * as tokenCacheService from '@/http/cache/tokenCacheService'
import Vue from 'vue'

const state = {
  loginUser: {}
}

const mutations = {
  SET_LOGIN_USER: (state, loginUser) => {
    state.loginUser = loginUser
  }
}

const actions = {
  // 获取当前登录用户信息
  getCurrentUser({ commit, state }) {
    return new Promise((resolve, reject) => {
      userService
        .getCurrentUser({})
        .then(response => {
          commit('SET_LOGIN_USER', response)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 当前登录用户退出
  logout({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      loginService
        .logout()
        .then(res => {
          commit('SET_LOGIN_USER', {})
          tokenCacheService.remove()
          dispatch('core/clear', {}, { root: true })
          // 重置路由
          Vue.prototype.$resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // remove token
  resetToken({ commit, dispatch, state }) {
    return new Promise(resolve => {
      tokenCacheService.remove()
      // dispatch('core/clear', {}, { root: true })
      // 重置路由
      Vue.prototype.$resetRouter()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
