/*!
 * 操作用户登录的token
 */
import * as storeMethodCacheService from './storeMethodCacheService'
/**
 * 获取token的key名称
 * @returns {string}
 */
const getMethod = () => {
  return window.SITE_CONFIG.starter.cache?.token?.storeMethod ?? 'Cookie'
}

const getKey = () => {
  // 这里的key值一定要和后端保持一致，否则获取获取其他key值，导致认证失败
  return window.SITE_CONFIG.starter?.cache?.token?.key ?? 'token'
}
/**
 * 获取当前用户登录的token
 * @returns string
 */
const get = () => {
  return storeMethodCacheService.get(getMethod(), getKey())
}
/**
 * 设置当前用户登录的token
 * @param token
 * @returns
 */
const set = token => {
  return storeMethodCacheService.set(getMethod(), getKey(), token)
}
/**
 * 删除当前登录用户的token
 * @returns
 */
const remove = () => {
  return storeMethodCacheService.remove(getMethod(), getKey())
}
export { getKey, get, set, remove }
