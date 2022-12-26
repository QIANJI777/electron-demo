import Vue from 'vue'
import VueRouter from 'vue-router'
import DataManage from '../views/dataManage/index.vue'
import Layout from '../layouts/index.vue'
import { getToken, setToken, removeToken } from '../assets/utils/userAccount'
import build_type from '../assets/utils/build_type.js'
import { getInfo, getUserOrg } from '@/service/modules/login'
import { moveChildrenToSameLevel } from '@/assets/utils/object'
import store from '@/store'

let requireFile = require.context('./modules', false, /\.js$/)
let requireMap = requireFile.keys().map(key => {
  return requireFile(key).default
})
let modules = requireMap.flat()
// console.log(modules)

Vue.use(VueRouter)

// 三个页面, 只有一个页面差距较大, 动态引入路由
// 其他两个页面, 在页面内部做差异化
const dynamic = {
  data_augment: {
    path: '/dataAugment',
    name: 'dataAugment',
    importPath: '/src/views/dataAugment/index.vue',
    title: '数据增广',
  },
  data_mark: {
    path: '/dataMark',
    name: 'dataMark',
    importPath: '/src/views/dataMark/index.vue',
    title: '数据标注',
  },
  data_filter: {
    path: '/dataFilter',
    name: 'dataFilter',
    importPath: '/src/views/dataFilter/index.vue',
    title: '数据筛选',
  },
}

const _type = build_type || '/dataAugment'

const routes = [
  ...modules,
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dataManage',
    showChildren: true,
    children: [
      {
        path: '/dataManage',
        name: 'dataManage',
        component: DataManage,
        meta: {
          title: '数据管理',
        },
      },
      {
        path: dynamic[_type].path,
        name: dynamic[_type].name,
        component: () => import(`../views/${dynamic[_type].name}/index.vue`),
        meta: {
          title: dynamic[_type].title,
        },
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('@/views/setting/index.vue'),
        redirect: '/setting/organization',
        showChildren: true,
        meta: {
          title: '系统设置',
        },
        children: [
          {
            path: '/organization',
            name: 'organization',
            meta: {
              title: '机构管理'
            },
            component: () => import('@/views/setting/organization.vue')
          },
          {
            path: '/department',
            name: 'department',
            meta: {
              title: '部门管理'
            },
            component: () => import('@/views/setting/department.vue')
          },
          {
            path: '/usergroup',
            name: 'usergroup',
            meta: {
              title: '用户组管理'
            },
            component: () => import('@/views/setting/usergroup.vue')
          },
          {
            path: '/user',
            name: 'user',
            meta: {
              title: '用户管理'
            },
            component: () => import('@/views/setting/user.vue')
          },
          {
            path: '/permission',
            name: 'permission',
            meta: {
              title: '权限管理'
            },
            component: () => import('@/views/setting/permission.vue')
          },
          {
            path: '/dataDictionary',
            name: 'dataDictionary',
            meta: {
              title: '数据字典'
            },
            component: () => import('@/views/setting/dataDictionary.vue')
          }
        ],
      },
    ],
  },
  {
    path: '*',
    name: '404',
    redirect: '/',
    notInMenu: true,
  },
]

const router = new VueRouter({
  routes,
})

let firstCome_2 = true
// let firstCome = true

router.beforeEach((to, from, next) => {
  let notFirstLogin = localStorage.getItem('notFirstLogin')
  // console.log(to)
  if (to.path !== '/login') {
    const token = getToken()
    if (token) {
      if (!notFirstLogin || firstCome_2) {  // 第一次进页面，请求用户信息及组织信息
        getInfo().then((res) => {
          const { data } = res
          if (!data) return reject('请求用户信息失败, 请重新登录')
          store.commit('user/setUserInfo', data)
          getUserOrg().then((res) => {
            const { data } = res
            if (!data) return reject('请求信息失败, 请重新登录')
            if (data.orgList && Object.prototype.toString.call(data.orgList).includes('Array')) store.commit('user/setUserOrg', data.orgList)
            let orgList = moveChildrenToSameLevel(data.orgList, 'childList')
            store.commit('user/setOrgList', orgList)
            store.commit('user/setCurOrg', data.orgList[0])
            next()
            localStorage.setItem('notFirstLogin', true)
            firstCome_2 = false
          }).catch((err) => {
            console.log(err)
            next('/login')
          })
        }).catch((err) => {
          console.log(err)
          next('/login')
        })
      } else {
        next()
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
