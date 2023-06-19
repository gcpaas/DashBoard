/* eslint-disable no-useless-escape */
/*
 * @description: 批量导入app端仪表盘组件
 */
const modules = {}
// 组件名称替换
const replaceName = {}
// 排除的组件
const excludeCommponents = ['Texts','HorizontalLine','VerticalLine','Button','Input','Picture','Tables',]
function importComponents (files,excludeCommponents) {
  files.keys().forEach(key => {
    // 正则，取到./和/之间的字符串
    const reg = new RegExp('(.\\/)(.*)(\\/)')
    let moduleName = key.match(reg)[0].replace(/(\.\/)|(\/)|(src)/g, '')
    // 替换组件名称
    if (replaceName[moduleName]) {
      moduleName = replaceName[moduleName]
    }
    if (!excludeCommponents.includes(moduleName)) {
      modules[moduleName] = files(key).default
    }
  })
}
importComponents(require.context('packages/BasicComponents', true, /\index.vue$/),excludeCommponents)
importComponents(require.context('packages/AppBasicComponents', true, /\index.vue$/),[])
export default modules
