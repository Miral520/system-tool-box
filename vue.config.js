const path = require('path');

function resolve (dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  devServer: {
    port: 8888, // 端口
    proxy: {
      '/12306': {
        target: 'https://kyfw.12306.cn/otn', // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite:{  // 路径重写，
          '^/12306': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
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
        .set('workers',resolve('src/workers'));
  },
}