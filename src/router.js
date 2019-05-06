import Vue from 'vue'
import Router from 'vue-router'
import { LoadingBar } from "iview";

const Home = () => import("./views/Home.vue");
const login = () => import("./views/Login.vue");

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ],
  scrollBehavior (to, from, savedPosition) {//滚动条 ，
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  LoadingBar.start();
  // 根据 token 和 path.name 确定路由跳转行为
  // const token = localStorage.getItem("token");
  // if (token) {
  //   if (to.name == "login") {
  //     next({
  //       name: "home"
  //     });
  //   } else {
      next();
  //   }
  // } else {
  //   if (["login", "modifyPwd", "firstPwd"].includes(to.name)) {
  //     next();
  //   } else {
  //     next({
  //       name: "login"
  //     });
  //   }
  // }
});

router.afterEach(to => {
  LoadingBar.finish();
  // window.scrollTo(0, 0);
});

export default router;