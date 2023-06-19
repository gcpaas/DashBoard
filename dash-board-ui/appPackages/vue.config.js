/*
 * @description: app打包的配置
 * @Author: xing.heng
 */
const path = require('path')
const { ProvidePlugin } = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  css: {
    extract: true
  },
  configureWebpack: {
    externals: {
      vuex: 'vuex',
      vue: 'vue',
      vueRouter: 'vue-router',
      '@antv/g2plot': '@antv/g2plot',
      axios: 'axios',
      'insert-css': 'insert-css',
      jquery: 'jquery',
      lodash: 'lodash',
      moment: 'moment',
      qs: 'qs',
      sortablejs: 'sortablejs'
    },
    resolve: {
      alias: {
        '@': resolve('../pcExample'),
        packages: resolve('../packages'),
        app: resolve('../appPackages')
      },
      fallback: {
        path: false,
        fs: false,
        assert: false
      }
    },
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
        threshold: 10240, // 归档需要进行压缩的文件大小最小值，10K以上的进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      }),
      new ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        'window.jQuery': 'jquery'
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ]
  },
  chainWebpack: config => {
    const imagesRule = config.module.rule('images')
    imagesRule.uses.clear()

    config.module
      .rule('images')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 1024 * 1024
        }
      })
      .end()

    // 处理font
    config.module
      .rule('font')
      .test(/\.(ttf|woff|woff2)$/)
      .set('parser', {
        dataUrlCondition: {
          maxSize: 1024 * 1024
        }
      })
      .end()
  }
}
