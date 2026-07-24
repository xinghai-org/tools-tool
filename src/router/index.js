import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
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
