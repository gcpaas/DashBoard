const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// const resolve = dir => path.join(__dirname, dir)
// page title
// 生产环境，测试和正式
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

// 路径处理方法
function resolve (dir) {
  return path.join(__dirname, dir)
}
// 不进行打包的资源，需要用到从script进行cdn引入
const externals = [
  {
    vue: 'Vue'
  },
  {
    'vue-router': 'VueRouter'
  },
  {
    jquery: 'jQuery',
    $: 'jquery',
    'windows.jQuery': 'jquery'
  },
  {
    axios: 'axios'
  },
  {
    qs: 'Qs'
  }
]
const publicPath = process.env.VUE_APP_HISTORY === 'y' ? process.env.VUE_APP_BASE + '/' : ''
const cdn = {
  css: [],
  js: [
    publicPath + 'static/libs/vue/vue.min.js',
    publicPath + 'static/libs/vue-router/vue-router.min.js',
    publicPath + 'static/libs/axios/axios.min.js',
    publicPath + 'static/libs/jquery/jquery.min.js',
    publicPath + 'static/libs/qs/qs.min.js'
  ]
}

module.exports = defineConfig({
  publicPath: process.env.VUE_APP_HISTORY === 'y' ? process.env.VUE_APP_BASE : './', // 署应用包时的基本 URL。 vue-router hash 模式使用
  //  publicPath: '/app/', //署应用包时的基本 URL。  vue-router history模式使用
  outputDir: 'dist', //  生产环境构建文件的目录
  assetsDir: 'static', //  outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: !IS_PROD,
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  devServer: {
    port: 7522, // 端口
    open: false, // 启动后打开浏览器
    client: {
      overlay: {
        //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
        warnings: false,
        errors: true
      }
    }
  },
  css: {
    extract: IS_PROD, // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    sourceMap: false,
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            hack: `true; @import "${resolve('./src/assets/css/theme/vant.less')}";`
          }
        }
      }
    }
  },

  configureWebpack: {
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm', '.less', '.css'],
      // 路径别名 alias
      alias: {
        '@': resolve('src'),
        assets: resolve('src/assets'),
        views: resolve('src/views'),
        components: resolve('src/components'),
        'gc-starter-ui-plus': resolve('src/utils/gcCore.js'),
        packages: resolve('../packages'),
        app: resolve('../appPackages'),
        'gc-starter-dashboard-ui': resolve('../packages/index.js'),
        'gc-starter-dashboard-app-ui': resolve('../appPackages/index.js')
      },
      fallback: {
        path: false,
        fs: false,
        assert: false
      },
      modules: [resolve('src'), 'node_modules']
    },
    module: {},
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        'windows.jQuery': 'jquery'
      })
    ]
  },

  chainWebpack: config => {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // cdn 加速 将公用库改为cdn引入方式，加快访问速度，注入html的插件无需安装，已经内置。
    if (process.env.NODE_ENV === 'production') {
      config.externals(externals)
      // 通过 html-webpack-plugin 将 cdn 注入到 index.html 之中
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
    }
    // 代码分割
    config.optimization.splitChunks({
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(s?css|less|sass)$/,
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'chunk-common',
          chunks: 'all',
          minChunks: 2, // 拆分前必须共享模块的最小 chunks 数。
          maxInitialRequests: 5, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
          minSize: 0, // 生成 chunk 的最小体积（≈ 20kb)
          priority: 1, // 优化将优先考虑具有更高 priority（优先级）的缓存组
          reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 2,
          reuseExistingChunk: true
        }
      }
    })
    /**
     * 设置保留空格
     */
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(!IS_PROD, config => config.devtool('cheap-source-map'))

    config.when(IS_PROD, config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // 将 runtime 作为内联引入不单独存在
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: 'chunk-libs',
            chunks: 'initial', // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          vantUI: {
            name: 'chunk-vantUI', // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
})
