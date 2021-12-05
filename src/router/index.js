import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard/index',
        meta: {title: '控制台', icon: 'control'},
        children: [
            {
                path: '/dashboard/index',
                component: () => import('@/views/dashboard/index'),
                name: 'home',
                meta: {title: '首页', icon: 'forward'}
            }
        ]
    }, {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/tools',
        component: () => import('@/layout'),
        redirect: '/jsonViewer',
        name: 'tools',
        meta: {
            title: '工具箱',
            icon: 'tools'
        },
        children: [
            {
                path: '/tools/jsonViewer',
                component: () => import('@/views/tools/json-viewer'),
                name: 'jsonViewer',
                meta: {title: 'json美化', icon: 'json-viewer'}
            }, {
                path: '/tools/codeDiff',
                component: () => import('@/views/tools/code-diff'),
                name: 'codeDiff',
                meta: {title: '代码对比', icon: 'code-diff'}
            }
        ]
    },

    /*{
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },*/
    //
    // {
    //     path: '/nested',
    //     component: Layout,
    //     redirect: '/nested/menu1',
    //     name: 'Nested',
    //     meta: {
    //         title: 'Nested',
    //         icon: 'nested'
    //     },
    //     children: [
    //         {
    //             path: 'menu1',
    //             component: () => import('@/views/nested/menu1/index'), // Parent router-view
    //             name: 'Menu1',
    //             meta: {title: 'Menu1'},
    //             children: [
    //                 {
    //                     path: 'menu1-1',
    //                     component: () => import('@/views/nested/menu1/menu1-1'),
    //                     name: 'Menu1-1',
    //                     meta: {title: 'Menu1-1'}
    //                 },
    //                 {
    //                     path: 'menu1-2',
    //                     component: () => import('@/views/nested/menu1/menu1-2'),
    //                     name: 'Menu1-2',
    //                     meta: {title: 'Menu1-2'},
    //                     children: [
    //                         {
    //                             path: 'menu1-2-1',
    //                             component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
    //                             name: 'Menu1-2-1',
    //                             meta: {title: 'Menu1-2-1'}
    //                         },
    //                         {
    //                             path: 'menu1-2-2',
    //                             component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
    //                             name: 'Menu1-2-2',
    //                             meta: {title: 'Menu1-2-2'}
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     path: 'menu1-3',
    //                     component: () => import('@/views/nested/menu1/menu1-3'),
    //                     name: 'Menu1-3',
    //                     meta: {title: 'Menu1-3'}
    //                 }
    //             ]
    //         },
    //         {
    //             path: 'menu2',
    //             component: () => import('@/views/nested/menu2/index'),
    //             meta: {title: 'menu2'}
    //         }
    //     ]
    // },
    //
    // {
    //     path: 'external-link',
    //     component: Layout,
    //     name: 'external-link',
    //     meta: {
    //         title: '测试',
    //         icon: 'example'
    //     },
    //     children: [
    //         {
    //             path: 'https://www.baidu.com/',
    //             meta: {title: 'External Link', icon: 'link'}
    //         },
    //         {
    //             path: '/home',
    //             meta: {title: 'External Link', icon: 'eye-open'},
    //             component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
    //         }
    //     ]
    // },
    //
    // {
    //     path: '/system',
    //     component: () => import('@/layout'),
    //     redirect: '/dept',
    //     name: 'system',
    //     meta: {
    //         title: '系统管理',
    //         icon: 'system'
    //     },
    //     children: [
    //         {
    //             path: '/dept',
    //             component: () => import('@/views/system/dept'),
    //             name: 'dept',
    //             meta: {title: '部门管理', icon: 'dept'}
    //         }, {
    //             path: '/system/user',
    //             component: () => import('@/views/system/user'),
    //             name: 'user',
    //             meta: {title: '用户管理', icon: 'user'}
    //         }, {
    //             path: '/system/role',
    //             component: () => import('@/views/system/role'),
    //             name: 'role',
    //             meta: {title: '角色管理', icon: 'role'}
    //         }, {
    //             path: '/system/menu',
    //             component: () => import('@/views/system/menu'),
    //             name: 'menu',
    //             meta: {title: '菜单管理', icon: 'menu'}
    //         }
    //     ]
    // },
    //
    // {
    //     path: '/about',
    //     meta: {title: '我的', icon: 'dashboard'},
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // },

    // {path: '*', redirect: '/404', hidden: true}
]

/**
 * 结尾路由
 */
export const tailRoutes = [
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    }, {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]

/**
 * 递归生成路由
 */
export function generateRoutes(routers) {
    return routers.map(item => {
        // 一级菜单格式
        let rootModule = {
            path: item.path,
            component: Layout,
            redirect: item.path,
            children: []
        }

        // 子菜单格式
        let module = {
            path: item.path,
            name: item.name,
            meta: {
                title: item.title, icon: item.icon
            },
            hidden: item.hidden === '1',
            component: () => import('@/' + item.component),
        };

        // 如果为一级菜单, 返回一级菜单路由格式
        if (item.parentId === null && item.children === null) {
            rootModule.children.push(module)
            return rootModule
        }

        // 如果一级菜单下包含子菜单, 返回多级菜单格式
        if (item.children && item.children.length > 0) {
            module.children = generateRoutes(item.children)
            module.redirect = item.children[0].path
        }
        return module
    })
}

const router = new VueRouter({
    // mode: 'history',
    routes,
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})

export function resetRouter() {
    const newRouter = router
    router.matcher = newRouter.matcher
}


router.selfAddRoutes = function (params){
    router.matcher = new VueRouter().matcher;
    router.addRoutes(params)
}

export default router
