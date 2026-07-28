import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: HomeView,
      children: [
        {
          path:'/',
          redirect:'/home'
        },
        {
          path:'/home',
          name:'home',
          component:()=> import("../views/Home.vue")
        },
        {
          path: '/tools',
          name: 'tools',
          component: () => import("../views/Tools.vue")
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import("../views/Settings.vue")
        },
      ]
    },

  ],
})

export default router
