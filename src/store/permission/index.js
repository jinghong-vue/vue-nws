// import * as api from "@/api/permission"

//引入路由
// import router from "@/utils/routerGuard"

export default {
  namespaced: true,
  state: {
    crumb: [],
  },
  getters: {},
  mutations: {
    //设置用户菜单
    // SET_USER_MENU(state,payload){
    //     state.userMenu = [...payload]
    //     //动态添加路由，使用router.addRoute这个方法
    //     dynamicRoutes.children = [...dynamicRoutes.children,...payload]
    //     router.addRoute(dynamicRoutes)

    // },
    //设置面包屑
    SET_CRUMB(state, payload) {
      state.crumb = payload;
    },
  },
  actions: {
    //获取远程菜单
    // FETCH_MENU_LIST({commit}){
    //     return api.getMenuListApi()
    //     .then(res => {
    //      console.log(res.data.menuList);
    //      let userMenu = recursionRoutes(res.data.menuList,routes.children)
    //      commit('SET_USER_MENU', userMenu)
    //     })
    //  }
  },
  modules: {},
};
