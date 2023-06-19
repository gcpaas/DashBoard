/*
 * @description:
 * @Author: wujian
 * @Date: 2022-10-11 14:17:48
 * @LastEditors: wujian
 * @LastEditTime: 2022-10-13 09:42:21
 */
/*
 * 登录相关业务方法 迁移自web端
 */
import * as http from '@/http'
/**
 * 系统退出
 * @param flag
 * @returns {Promise<*>}
 */
const logout = (flag = true) => http.del(`/sys/logout`, {}, flag)
/**
 * 账号登录
 * @param params
 * @param flag
 * @returns {Promise<*>}
 */
const accountLogin = (params = {}, flag = true) => http.post(`/sys/login`, params, flag)
/**
 * 手机登录
 * @param params
 * @param flag
 * @returns {*}
 */
const phoneLogin = (params = {}, flag = true) => http.post(`/sys/login/phone`, params, flag)
/**
 * 邮箱登录
 * @param params
 * @param flag
 * @returns {*}
 */
const emailLogin = (params = {}, flag = true) => http.post(`/sys/login/email`, params, flag)

export { logout, accountLogin, phoneLogin, emailLogin }
