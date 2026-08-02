import { createRouter, createWebHashHistory } from 'vue-router'
import ToolsRouterList from '@/router/toolsRouter.js'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '/',
          redirect: '/home',
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/Home.vue'),
        },
        {
          path: '/tools',
          name: 'tools',
          component: () => import('../views/Tools.vue'),
          children: [...ToolsRouterList],
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('../views/Settings.vue'),
        },
      ],
    },
  ],
})

export default router
