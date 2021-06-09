import Vue from "vue";
import VueRouter from "vue-router";
import Head_v2 from "@/views/Head_v2.vue";
import Login from "@/views/Login.vue";
import Donor from "@/views/Donor.vue";
import Coordinator from "@/views/Coordinator.vue";
import SocialWorker from "@/views/SocialWorker.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/head_v2",
    name: "Head_v2",
    component: Head_v2,
  },
  {
    path: "/donor",
    name: "Donor",
    component: Donor,
  },
  {
    // path: "/login",
    path: "",
    name: "login",
    component: Login,
  },
  {
    path: "/coordinator",
    name: "Coordinator",
    component: Coordinator,
  },
  {
    path: "/social_worker",
    name: "SocialWorker",
    component: SocialWorker
  },
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
