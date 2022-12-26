import http from '../http.js'
import qs from 'qs'

// 机构管理
export function org_add (data) {
  return http({
    url: '/sys/sys/org/add',
    method: 'post',
    data
  })
}

export function org_list_get () {
  return http({
    url: '/sys/sys/org/list',
    method: 'get',
  })
}

export function org_pageList_get (params) {
  return http({
    url: '/sys/sys/org/pageList',
    method: 'get',
    params
  })
}

export function org_delete (data) {
  return http({
    url: '/sys/sys/org/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function org_update (data) {
  return http({
    url: '/sys/sys/org/update',
    method: 'post',
    data
  })
}

// 部门管理
export function org_department_pageList_get (params) {
  return http({
    url: '/sys/sys/org/department/pageList',
    method: 'get',
    params
  })
}

export function org_treeOrgByLogin_get () {
  return http({
    url: '/sys/sys/org/treeOrgByLogin',
    method: 'get',
  })
}

export function org_department_delete (data) {
  return http({
    url: '/sys/sys/org/department/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function org_department_add (data) {
  return http({
    url: '/sys/sys/org/department/add',
    method: 'post',
    data
  })
}

export function org_department_update (data) {
  return http({
    url: '/sys/sys/org/department/update',
    method: 'post',
    data
  })
}

// 用户组管理

export function role_update (data) {
  return http({
    url: '/sys/sys/role/update',
    method: 'post',
    data
  })
}

export function role_delete (data) {
  return http({
    url: '/sys/sys/role/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function role_add (data) {
  return http({
    url: '/sys/sys/role/insert',
    method: 'post',
    data
  })
}

export function role_addpermission ({ url, data }) {
  return http({
    url: '/sys/sys/role/insertRolePermission/' + url,
    method: 'post',
    data
  })
}

export function role_pageList_get (params) {
  return http({
    url: '/sys/sys/role/pageList',
    method: 'get',
    params
  })
}

export function permission_list_get () {
  return http({
    url: '/sys/sys/permission/list',
    method: 'get'
  })
}

export function permission_listByRoleId_get (params) {
  return http({
    url: '/sys/sys/permission/listByRoleId',
    method: 'get',
    params
  })
}
// 用户管理
export function role_list_get (params) {
  return http({
    url: '/sys/sys/role/list',
    method: 'get',
    params
  })
}

export function permission_listByPartyCode_get (params) {
  return http({
    url: '/sys/sys/permission/listByPartyCode',
    method: 'get',
    params
  })
}

export function basedictInfo_list_get (params) {
  return http({
    url: '/sys/sys/base/dictInfo/list',
    method: 'get',
    params
  })
}

export function orgdepartment_list_get (data) {
  return http({
    url: '/sys/sys/org/department/list?orgCode=' + data,
    method: 'get',
  })
}

export function org_user_pageList_get (params) {
  return http({
    url: '/sys/sys/user/pageList',
    method: 'get',
    params
  })
}

export function user_delete (params) {
  return http({
    url: '/sys/sys/user/delete',
    method: 'post',
    params
  })
}

export function user_update (data) {
  return http({
    url: '/sys/sys/user/update',
    method: 'post',
    data
  })
}

export function user_add (data) {
  return http({
    url: '/sys/sys/user/add',
    method: 'post',
    data
  })
}
// 权限管理

export function permission_update (data) {
  return http({
    url: '/sys/sys/permission/update',
    method: 'post',
    data
  })
}

export function permission_insert (data) {
  return http({
    url: '/sys/sys/permission/insert',
    method: 'post',
    data
  })
}

// 数据字典

export function base_dictIndex_update (data) {
  return http({
    url: '/sys/sys/base/dictIndex/update',
    method: 'post',
    data
  })
}

export function base_dictInfo_update (data) {
  return http({
    url: '/sys/sys/base/dictInfo/update',
    method: 'post',
    data
  })
}

export function base_dictIndex_save (data) {
  return http({
    url: '/sys/sys/base/dictIndex/save',
    method: 'post',
    data
  })
}

export function base_dictInfo_save (data) {
  return http({
    url: '/sys/sys/base/dictInfo/save',
    method: 'post',
    data
  })
}

export function base_dictIndex_list_get (params) {
  return http({
    url: '/sys/sys/base/dictIndex/list',
    method: 'get',
    params
  })
}