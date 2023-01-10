const { defineConfig } = require("@vue/cli-service");

//获取环境的变量 process.env.NODE_ENV

console.group('环境')
console.log(process.env);
console.groupEnd()

//vue-cli 内置了Node服务器，我们的页面运行在这个Node服务器里面，页面跟Node服务器(localhost:8080)同源

//代理：页面发送请求，由同源的node服务器进行转发，请求目标服务器，目标服务器将结果返回给node服务器，
//  node服务器再返回给页面

//代理会带来什么问题?(项目构建之后，代理还能不能生效?)不能 怎么解决 nginx配置代理

module.exports = defineConfig({
  publicPath:"./",//配置静态资源为当前目录
  transpileDependencies: true,
  lintOnSave: false,

});
