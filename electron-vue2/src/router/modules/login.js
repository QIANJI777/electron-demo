const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../../views/login/login.vue'),
    notInMenu: true,
    meta: {
      title: '登录'
    }
  },
]

export default routes
