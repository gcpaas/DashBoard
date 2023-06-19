/*
 * @description: 模型编码缓存操作
 * @Date: 2022-11-08 14:31:09
 * @LastEditTime: 2022-11-10 10:56:03
 */
/*!
 * 菜单缓存，便于后期使用
 */
import * as storeMethodCacheService from './storeMethodCacheService'
/**
 * 获取缓存的key
 * @returns {string}
 */
const getMethod = () => {
  return window.SITE_CONFIG.starter.cache?.moduleCode?.storeMethod ?? 'localStorage'
}
const getKey = () => {
  return window.SITE_CONFIG.starter?.cache?.moduleCode?.key ?? 'gc-moduleCode'
}
/**
 * 获取本地存储的数据模型编码
 * @returns string
 */
const get = () => {
  let moduleCode = storeMethodCacheService.get(getMethod(), getKey()) ?? window['SITE_CONFIG'].starter.moduleCode
  return moduleCode
}

/**
 * 将数据模型编码存起来
 * @returns
 */
const set = moduleCode => {
  storeMethodCacheService.set(getMethod(), getKey(), moduleCode)
}

/**
 * 移除数据模型编码
 * @returns
 */
const remove = () => {
  storeMethodCacheService.remove(getMethod(), getKey())
}
export { get, set, remove }
