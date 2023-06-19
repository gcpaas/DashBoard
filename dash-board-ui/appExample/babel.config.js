const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)
const plugins = [
  // [
  //   'import',
  //   {
  //     libraryName: 'vant',
  //     libraryDirectory: 'es',
  //     style: true
  //   }
  // ]
]
if (IS_PROD) {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'usage', corejs: 3 }]],
  plugins
}
