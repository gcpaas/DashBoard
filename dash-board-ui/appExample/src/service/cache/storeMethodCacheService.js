/*
 * @description: 缓存操作
 * @Date: 2022-11-08 14:24:05
 * @LastEditTime: 2022-11-08 14:43:50
 */
/*!
 * 用于千行存储参数的方式判断
 */
import Cookies from 'vue-cookie'

const session = 'sessionStorage'
const local = 'localStorage'
const cookie = 'Cookie'

// 存储方式
const set = (method, key, value) => {
  switch (method) {
    case session:
      sessionStorage.setItem(key, value)
      break
    case local:
      localStorage.setItem(key, value)
      break
    case cookie:
      Cookies.set(key, value)
      break
    default:
      console.error(`cache：${key}配置错误`)
  }
}

// 获取方式
const get = (method, key) => {
  switch (method) {
    case session:
      return sessionStorage.getItem(key)
    case local:
      return localStorage.getItem(key)
    case cookie:
      return Cookies.get(key)
    default:
      console.error(`cache：${key}配置错误`)
  }
}

// 删除方式
const remove = (method, key) => {
  switch (method) {
    case session:
      sessionStorage.removeItem(key)
      break
    case local:
      localStorage.removeItem(key)
      break
    case cookie:
      Cookies.delete(key)
      break
    default:
      console.error(`cache：${key}配置错误`)
  }
}

export { set, get, remove }
