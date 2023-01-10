import router from "@/router";
// import Router from "router"
import storage from "../api/storage";

import store from "@/store";
//引入进度条
import nprogress from "nprogress";
import "nprogress/nprogress.css";

//判断本地是否有token，如果有，那么就放行

router.beforeEach((to, from, next) => {
  // console.log("to,from,next",to,from,next);
  // console.log("to.fullPath",to.fullPath);
  // if (to.fullPath == "/ReleaseManagement/Scheduling") {
  //       console.log("to.fullPath",111);
  // }

  nprogress.start();
  // let token = storage.get('qf-token')
  let userinfo = JSON.parse(localStorage.getItem("userinfo"));
  // console.log(userinfo);
  //to 目标路由对象
  //from 源路由对象
  //next是个函数，调用之后， 可以理解为放行
  //    console.log(to);
  if (userinfo) {
    // alert('存在')
    //要判断是否有用户菜单
    // if (!store.state.permission.userMenu.length) {
    //     console.log(store.state.permission.userMenu);
    //     //发起请求，获取权限菜单
    //     store.dispatch('permission/FETCH_MENU_LIST')
    //     .then(() => {
    //         //这里要注意, next里面要传参数即要进入的页面的路由信息，因为next传参数后，当前要进入的路由会被废止，转而进入参数对应的路由，虽然是同一个路由，这么做主要是为了确保addRoutes生效了,并且不产生历史记录
    //         next({path:to.path, replace:true, query:to.query})
    //     })
    // }else{
    //     next()
    // }
    next();
  } else {
    // alert('不存在')
    //没有token(userinfo)
    //1.访问的是登入页
    if (to.path === "/login") {
      next();
    } else {
      //2.访问的不是登入页，强行调回登入页
      next({ path: "/login" });
    }
  }
});

//全局后置钩子

router.afterEach((to, from) => {
  nprogress.done();
  // console.log('to',to);
  // console.log('from',from);
  //to里面有个属性叫matched 这里能够获取到匹配成功的路由对象
  //因为第0项匹配的是空字符串路径，我们并不需要，所以要进行处理
  let matched = to.matched.filter((item, index) => index > 0);
  // console.log(matched);
  store.commit("permission/SET_CRUMB", matched);
});

export default router;
