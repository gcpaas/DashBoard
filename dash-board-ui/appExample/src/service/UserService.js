/*
 * 用户管理
 */
import * as http from '@/http'
/**
 * 用户管理分页
 * 如果入参传orgId，则查询该机构以及所有子机构（包含子机构的子机构的...）下的用户列表
 * @param params
 * @param flag
 * @returns {Promise<*>}
 */
const getUserPage = (params = {}, flag = false) => http.get('/sys/user', params, flag)

/**
 * 获取我的机构用户分页列表
 * @param params
 * @param flag
 * @returns {*}
 */
const getMyOrgUserPage = (params = {}, flag = false) => http.get('/sys/user/myOrg', params, flag)

/**
 * 获取当前登录的用户信息
 * @param params
 * @param flag
 * @returns {Promise<*>}
 */
const getCurrentUser = (params = {}, flag = false) => http.get('/sys/user/current', params, flag)

/**
 * 用户字段查重
 * @param params
 * @param flag
 * @returns {*}
 */
const checkUserRepeat = (params = {}, flag = false) => http.post('/sys/user/repeat', params, flag)

/**
 * 根据角色id获取与其关联的用户列表
 * @param roleId
 * @param flag
 * @returns {*}
 */
const getUserListByRoleId = (roleId = undefined, flag = false) => http.get(`/sys/user/userList/${roleId}`, {}, flag)

/**
 * 新增用户
 * @param params
 * @param flag
 */
const addUser = (params = {}, flag = false) => http.post('/sys/user', params, flag)

/**
 * 更新用户
 * @param params
 * @param flag
 */
const updateUser = (params = {}, flag = false) => http.put('/sys/user', params, flag)
/**
 * 更新用户账号状态
 * @param params
 * @param flag
 */
const updateUserStatus = (params = {}, flag = false) => http.put('/sys/user/updateStatus', params, flag)
/**
 * 删除用户
 * @param id
 * @param flag
 */
const deleteUser = (userIdList = [], flag = false) => http.post(`/sys/user/delete`, userIdList, flag)

/**
 * 重置密码
 * @param id
 * @param params
 * @param flag
 */
const resetPassword = (userIdList = {}, flag = false) => http.post(`/sys/user/reset/password`, userIdList, flag)

/**
 * 登录
 * @param params
 * @param flag
 * @returns {*}
 */
const login = (params = {}, flag = false) => http.post('/sys/login', params, flag)
/**
 * 注册信息判重，传入需要判重的字段和值
 * @param params
 * @param flag
 * @returns {*}
 */
const checkRegisterUserRepeat = (params = {}, flag = false) => http.post('/sys/user/repeatResgit', params, flag)

/**
 * 修改用户信息
 * @param params
 * @param flag
 * @returns {Promise<*>}
 */
const updateUserInfo = (params = {}, flag = false) => http.put(`/sys/user/info`, params, flag)

export {
  getUserPage,
  getCurrentUser,
  checkUserRepeat,
  addUser,
  deleteUser,
  updateUser,
  resetPassword,
  updateUserStatus,
  getUserListByRoleId,
  getMyOrgUserPage,
  login,
  checkRegisterUserRepeat,
  updateUserInfo
}
