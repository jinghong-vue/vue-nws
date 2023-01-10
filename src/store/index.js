import Vue from "vue";
import Vuex from "vuex";
import permission from "./permission";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    collapse: false,
  },
  getters: {},
  mutations: {
    //收起菜单
    SET_COLLAPSE(state, payload) {
      state.collapse = !state.collapse;
    },
  },
  actions: {},
  modules: {
    permission,
  },
});
