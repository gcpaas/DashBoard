/*!
 * 角色配置
 */
import * as http from '@/http'

/**
 *角色管理分页
 * @param params
 * @param flag
 * @returns {Promise<*>}
 */
const getRolePage = (params = {}, flag = false) => http.get('/sys/role', params, flag)
/**
 * 获取指定角色被授权的菜单
 * @param roleId
 * @param flag
 * @returns {Promise<*>}
 */
const getRoleMenuIdList = (roleId = undefined, flag = false) => http.get(`/sys/role/menu/ids/${roleId}`, {}, flag)

/**
 * 获取指定用户的角色列表
 * @param userId
 * @param flag
 * @returns {*}
 */
const getUserRoleList = (userId = undefined, flag = false) => http.get(`/sys/role/list/${userId}`, {}, flag)
/**
 * 新增角色
 * @param params
 * @param flag
 */
const addRole = (params = {}, flag = false) => http.post('/sys/role', params, flag)
/**
 * 给角色授权菜单
 * @param params
 * @param flag
 * @returns {Promise<*>}
 */
const authMenu = (params = {}, flag = false) => http.post('/sys/role/auth/menu', params, flag)
/**
 * 更新用户的角色
 * @param params
 * @param flag
 * @returns {*}
 */
const updateUserRole = (params = {}, flag = false) => http.post('/sys/role/update/userRoleList', params, flag)
/**
 * 更新角色
 * @param params
 * @param flag
 */
const updateRole = (params = {}, flag = false) => http.put('/sys/role', params, flag)
/**
 * 删除角色
 * @param id
 * @param flag
 */
const deleteRole = (id = undefined, flag = false) => http.del(`/sys/role/${id}`, flag)
/**
 * 更新角色的数据权限
 * @param params
 * @param flag
 * @returns {*}
 */
const updateRoleDataPermission = (params = {}, flag = false) => http.post('/sys/role/dataPermission', params, flag)
/**
 * 角色的数据权限类型为自定义时，获取角色数据权限关联的机构id列表
 * @param roleId
 * @param flag
 * @returns {*}
 */
const getRoleDataPermission = (roleId = undefined, flag = false) =>
  http.get(`/sys/role/dataPermission/${roleId}`, {}, flag)
/**
 * 为角色分配用户
 * @param params
 * @param flag
 * @returns {*}
 */
const authUserToRole = (params = {}, flag = false) => http.post('/sys/role/user/auth', params, flag)

/**
 * c参考指定用户用户授权
 * @param params
 * @param flag
 * @returns {*}
 */
const authRoleByOtherUser = (params = {}, flag = false) => http.post('/sys/role/auth/menu/other', params, flag)

export {
  getRolePage,
  getRoleMenuIdList,
  addRole,
  authMenu,
  updateRole,
  deleteRole,
  getUserRoleList,
  updateUserRole,
  updateRoleDataPermission,
  getRoleDataPermission,
  authUserToRole,
  authRoleByOtherUser
}
