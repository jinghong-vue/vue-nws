import Vue from "vue";
import ElementUI from "element-ui";
import "@/assets/styles/common.less";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./utils/routerGuard";
import store from "./store";

import x2js from "x2js";
Vue.prototype.$x2js = new x2js();
// Vue.config.productionTip = false;
Vue.use(ElementUI);

//引入
import moment from "moment";
//挂载到原型
Vue.prototype.$moment = moment;
//汉化，否则显示日期格式是国外的日期格式
moment.locale("zh-CN");

//引入字体图标
import "@/assets/iconfont/iconfont.css";
import "@/assets/iconfont/iconfont.js";
import "@/assets/styles/iconfont.css";

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
