export default [
  {
    path: '',
    name: 'toolApps',
    component: () => import('@/views/ToolsPage/toolApps.vue'),
  },
  {
    path: 'FilterFile',
    name: 'FilterFile',
    component: () => import('@/views/ToolsPage/FilterFile.vue'),
  },
  {
    path: 'Tom3u8',
    name: 'Tom3u8',
    component: () => import('@/views/ToolsPage/Tom3u8.vue'),
  },
]
