import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: "/home"
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/home/home1',
          name: 'home1',
          component: import("../views/pages/homes/home1.vue"),
        },
      ]
    },

    {
      path: '/route1',
      name: 'route1',
      component: import("../views/route1.vue"),
    }
  ],
})

export default router
