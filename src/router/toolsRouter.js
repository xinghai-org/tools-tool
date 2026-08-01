export default [
       {
        path: '',
        name: 'toolsApps',
        component: () => import("@/views/pages/toolApps.vue")
    },
    {
        path: 'filterfile',
        name: 'filterfile',
        component: () => import("@/views/pages/FilterFile.vue")
    },
    {
        path: 'Tom3u8',
        name: 'Tom3u8',
        component: () => import("@/views/pages/Tom3u8.vue")
    }

]