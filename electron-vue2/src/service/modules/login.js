import http from '../http.js'

export function login(data) {
  return http({
    url: '/sys/login',
    method: 'post',
    data,
    noToken: true
  })
}

//获取当前用户的机构
export function getUserOrg() {
  return http({
    url: '/sys/sys/org/treeOrgByLogin',
    method: 'get',
  })
}

//获取当前用户的机构列表
export function getUserOrgList(code) {
  return http({
    url: `/sys/sys/org/treeAllOrg?orgCode=${code}`,
    method: 'get',
  })
}

export function logout(data) {
  return http({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return http({
    url: '/sys/sys/user/getLoginUser',
    method: 'GET',
  })
}
