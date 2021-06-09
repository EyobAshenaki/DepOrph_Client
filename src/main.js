import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

axios.defaults.baseURL="http://EA:3000";
// axios.defaults.baseURL="http://EA:3001";
// axios.defaults.withCredentials = true;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
