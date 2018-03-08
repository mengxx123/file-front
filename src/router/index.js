import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const Temp = resolve => require(['@/views/Temp'], resolve)
const About = resolve => require(['@/views/About'], resolve)
const Login = resolve => require(['@/views/Login'], resolve)

const Error404 = resolve => require(['@/views/error/Error404'], resolve)

// 文件
const File = resolve => require(['@/views/file/File'], resolve)
const File2 = resolve => require(['@/views/file/File2'], resolve)
const FileDetail = resolve => require(['@/views/file/FileDetail'], resolve)
const FileEdit = resolve => require(['@/views/file/FileEdit'], resolve)
const Trash = resolve => require(['@/views/file/Trash'], resolve)

Vue.use(Router)

const APP_NAME = '云设'

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/temp',
        component: Temp
    },
    {
        path: '/about',
        component: About,
        meta: {
            title: '关于'
        }
    },
    {
        path: '/trash',
        component: Trash,
        meta: {
            title: '回收站'
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            title: '登陆'
        }
    },
    {
        path: '/404',
        component: Error404,
        meta: {
            title: '页面找不到了'
        }
    },
    {
        path: '*',
        redirect: '/404'
    },
    // 文件相关
    {
        path: '/files',
        component: File
    },
    {
        path: '/files2',
        component: File2
    },
    {
        path: '/files/:path/edit',
        component: FileEdit
    }, {
        path: '/files/detail',
        component: FileDetail
    }
]

function getTitle(title) {
    if (title) {
        return title
    } else {
        return APP_NAME
    }
}

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
        document.title = getTitle(to.meta.title)
    } else {
        document.title = getTitle()
    }
    next()
})

export default router
