const { defineConfig } = require("@vue/cli-service");

//获取环境的变量 process.env.NODE_ENV

console.group('环境')
console.log(process.env);
console.groupEnd()

module.exports = defineConfig({
  publicPath:"./",
  transpileDependencies: true,
  lintOnSave: false,

});
