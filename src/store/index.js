import { createStore } from "vuex";
import Login from "./login/login";
import shop from "./Shop/shop";
import search from "./activity/search";

const loginModule = {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    Login,
  },
};

const homeModule = {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
};

const activityModule = {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    search,
  },
};

const shopModule = {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { shop },
};

export default createStore({
  modules: {
    login: loginModule,
    home: homeModule,
    activity: activityModule,
    shop: shopModule,
  },
});
