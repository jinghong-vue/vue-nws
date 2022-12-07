//配置axios

import axios from "axios";

//引入elemetui的弹框
// import aa,{ MessageBox } from 'element-ui';
import aa, { MessageBox, Message, Loading } from "element-ui";
// console.log(aa);
//引入storage方法
import storage from "@/api/storage";

//引入进度条
import nprogress from "nprogress";
import "nprogress/nprogress.css";

let http = axios.create({
  baseURL: "/api",
  timeout: 15000, //超时设置
  // withCredentials: true,//携带本地凭据 比如cookie
});

//全局的请求拦截器 对接口的请求批量进行统一处理

let fullScreenLoading = null;

http.interceptors.request.use((config) => {
  nprogress.start();
  //先获取本地的token，然后携带给后端
  // let token = storage.get('qf-token')
  // // console.log(token);
  // config.headers['authorization'] = token;
  // config就是所有的请求配置

  //登入的时候打开加载动画
  // console.log(config);

  //关键字 login wechatLogin
  // if (config.url.indexOf('login') !== - 1 || config.url.indexOf('wechatLogin') !== -1) {
  if (config.url.indexOf("NjnuService") !== -1) {
    fullScreenLoading = Loading.service({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
  }

  return config; //放行 不return 那么不能将请求真正的发送出去
});

//全局响应拦截 统一对错误进行处理

http.interceptors.response.use((config) => {
  nprogress.done();

  setTimeout(() => {
    if (fullScreenLoading) {
      // console.log(123);
      fullScreenLoading.close();
      fullScreenLoading = null;
    }
  }, 300);

  // console.log('config', config);
  var reg = /成功/i;
  var res = reg.test(config.data);
  // console.log(res);//true
  let { state, msg } = config.data;
  // console.log(config);
  // console.log(config.url);
  if (!res) {
    //后台响应了错误的结果
    MessageBox({
      message: msg,
      title: "错误提示",
      type: "error",
    });
  }

  // 10022 1004 这两个状态码分别对应了token过期和session过期
  // 10026 没有权限
  // 清掉本地缓存 清掉token
  let { code } = config.data;

  if (code === "10022" || code === "10026") {
    Message.error("登入过期，请重新登入");
    storage.rm("qf-token");
    location.reload();
  }
  return config; //如果不return axios请求就拿不到响应结果
});

export default http;
