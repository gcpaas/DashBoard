/* eslint-disable no-unused-vars */
export default {
  namespaced: true,
  state: {
    // 当前用户可访问的菜单集合,是tree类型、所有的菜单
    menuTreeList: [],
    // key 为顶级目录ID,value为该目录下的所有菜单tree，用于点击一级目录时左侧切换使用，根据一级目录的id进行获取返回
    rootMenuTreeMap: {},
    // 用于控制顶部一级目录激活
    currentRootMenuId: '',
    // 当前激活的菜单
    currentMenuId: '',
    // 菜单映射，key 菜单id,value 菜单
    menuMap: {}
  },
  mutations: {
    // 清空store
    CLEAR(state) {
      state.menuTreeList = []
      state.rootMenuTreeMap = {}
      state.currentRootMenuId = ''
      state.currentMenuId = ''
      state.menuMap = {}
    }
  },
  actions: {
    clear(context) {
      return new Promise((resolve, reject) => {
        context.commit('CLEAR')
        resolve()
      })
    }
  }
}
