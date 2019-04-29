const path = require("path");

module.exports = {
  // 部署应用包时的基本 URL(默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径)
  publicPath: process.env.VUE_APP_Public_Path,

  // webpack-dev-server 的选项
  devServer: {
    port: 8888, // 调试端口号
    open: true, // 自动在浏览器中打开页面
    writeToDisk: true, // 开发过程中生成的文件写入磁盘（默认在内存中，看不到文件的变动）
    // public: 'myapp.test:80',
    // 当存在编译器错误或警告时，在浏览器中显示全屏覆盖
    https: false,
    hotOnly: true,
    overlay: {
      warnings: true,
      errors: true
    },
    // 当您拥有单独的API后端开发服务器并且希望在同一域上发送API请求时，代理某些URL会很有用
    proxy: {
      "/mock": {
        target: "http://192.168.30.184:9000/", // mock服务地址
        changeOrigin: true // 代理服务器会在请求头中加入相应Host首部
        // pathRewrite: {
        //   "^/mock": "/mock"
        // }
      },
      "/v1": {
        target: "http://10.80.127.23:13000/", // 开发服务地址
        changeOrigin: true
      }
    }
  },

  // 接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改
  chainWebpack: config => {
    // 自动化导入文件 (用于颜色、变量、mixin……)
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      config.module
        .rule("stylus")
        .oneOf(type)
        .use("style-resource")
        .loader("style-resources-loader")
        .options({
          patterns: [path.resolve(__dirname, "./src/assets/stylus/mixin.styl")]
        })
    );
  }
};
