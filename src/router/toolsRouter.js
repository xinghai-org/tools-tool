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
    }

]