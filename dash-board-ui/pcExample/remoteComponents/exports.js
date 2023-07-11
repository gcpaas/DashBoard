/*
 * @description: 处理自定义远程的组件
 * @Date: 2023-06-02 10:18:46
 * @Author: xing.heng
 * @LastEditors: wujian
 * @LastEditTime: 2023-06-25 21:00:44
 */

const files = require.context('./', true, /index.vue$/)
const remoteComponents = []

files.keys().forEach(key => {
  const title = key.split('/')[1].replace('.vue', '')
  const img = require(`./${title}/component.png`)
  const config = require(`./${title}/config.js`).default
  remoteComponents.push({
    title: config.title || title,
    vueSysComponentDirName: title,
    vueFile: files(key).default,
    ...config,
    img
  })
})

export default remoteComponents
