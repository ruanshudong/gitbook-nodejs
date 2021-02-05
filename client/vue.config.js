const path = require("path")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const server_port = process.env.SERVER_PORT || '6080'
module.exports = {
  outputDir: "./dist",
  assetsDir: "static",
  publicPath: "/",
  productionSourceMap: false,
  runtimeCompiler: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: "gitbook",
    },
  },
  configureWebpack: {
    plugins: [new CopyWebpackPlugin([{
      from: path.resolve(__dirname, './public'),
      to: path.resolve(__dirname, './dist/static'),
      ignore: ['.*']
    }])]
  },
  devServer: {
    //是否自动在浏览器中打开
    open: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    //web-dev-server地址
    port: 6001,
    //ajax请求代理
    proxy: {
      "/": {
        target: `http://127.0.0.1:${server_port}`,
        changeOrigin: false
      },
      "/pages/api": {
        target: `http://127.0.0.1:${server_port}`,
        changeOrigin: false
      },
      "/favicon.ico": {
        target: `http://localhost:${server_port}`,
        changeOrigin: false
      }
    }
  }
}