const path = require('path');

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        prependData: `@import "~@/scss/variables.scss";`
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
    // 设置目录别名
    config.resolve.alias
        .set('@', resolve('src'))
        .set('@assets',resolve('src/assets'))
        .set('@cpt',resolve('src/components'))
        .set('@entry',resolve('src/entry'))
  },
}