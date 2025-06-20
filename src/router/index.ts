import { Router, createRouter, createWebHistory } from 'vue-router'
// import Cookies from 'js-cookie'
import Home from '@/pages/home/index.vue'
import Login from '@/pages/login/index.vue'
// 获取微服务路由
const basePath = import.meta.env.VITE_BASE
// console.log(microRoutes);
// 创建路由实例
export const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: `${basePath}`,
      redirect: `${basePath}index`,
    },
    {
      path: `${basePath}index`,
      component: Home,
      name: 'index',
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition
      }
      if (from.meta.saveSrollTop) {
        const top: number = document.documentElement.scrollTop || document.body.scrollTop
        resolve({ left: 0, top })
      }
    })
  },
})
router.beforeEach((to, from, next) => {
  // 可做登录拦截
  if (to.path === '/login') {
    router.push(`${basePath}`)
  } else {
    document.title = to.name as string
    next()
  }
})
export default router
