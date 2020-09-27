const path = require('path');
const webpack = require('webpack');

function resolve (dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  devServer: {
    port: 8888, // 端口
    proxy: {
      '/kyfw': {
        target: 'https://kyfw.12306.cn/otn',
        changeOrigin: true,
        pathRewrite:{
          '^/kyfw': '',
        },
      },
      '/12306': {
        target: 'https://www.12306.cn',
        changeOrigin: true,
        pathRewrite:{
          '^/12306': '',
        },
      },
    },
  },
  publicPath: './',
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        prependData: `@import "~scss/common.scss";`
      },
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#25c7f5',
            'success-color': '#4cec88',
            'warning-color': '#ffa955',
            'error-color': '#ff5555',
          },
          javascriptEnabled: true,
        },
      },
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        moment: 'moment'
      })
    ]
  },
  chainWebpack: (config) => {
    // 添加 worker-loader
    config.module
        .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker-loader')
        .loader('worker-loader')
        .end();

    // 设置目录别名
    config.resolve.alias
        .set('@', resolve('src'))
        .set('assets',resolve('src/assets'))
        .set('cpt',resolve('src/components'))
        .set('entry',resolve('src/entry'))
        .set('router',resolve('src/router'))
        .set('scss',resolve('src/scss'))
        .set('store',resolve('src/store'))
        .set('utils',resolve('src/utils'))
        .set('views',resolve('src/views'))
        .set('workers',resolve('src/workers'))
  },
}