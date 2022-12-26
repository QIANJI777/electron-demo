import http from '../http.js'

// 树状分类[不带数量]
export function getTree(params) {
  return http({
    // dictCode=${params.dictCode}&depthCode=${params.depthCode}
    url: '/sys/category/categoryTree',
    method: 'get',
    params,
  })
}

// 树状分类[带数量]
export function getTreeFolder(data) {
  return http({
    url: `/meishan/tag/tree/aggregation`,
    method: 'post',
    data,
  })
}

// 数据标注getTree
export function tree_mark_get(data) {
  return http({
    url: `meishan/falseAlarm/tag/tree`,
    method: 'POST',
    data
  })
}
// 数据管理-获取数据
export function getImgPage(data) {
  return http({
    url: `/meishan/img/page`,
    method: 'POST',
    data,
  })
}

// 数据管理-数据标注-获取数据
export function getImg_mark(data) {
  return http({
    url: `meishan/falseAlarm/getFalseAlarm`,
    method: 'POST',
    data: data
  })
}

// 数据管理-数据标注-删除
export function delImg_mark(data) {
  return http({
    // url: `meishan/falseAlarm/delectList?${data}`,
    url: `meishan/falseAlarm/delectImg`,
    method: 'POST',
    data
    // data: qs.stringify(data)
  })
}

// 批量删除样本数据
export function batchDelete(dataIds) {
  return http({
    url: `/meishan/img/batchDelete/${dataIds}`,
    method: 'DELETE'
  })
}

//上传样本数据
export function uploadSample(data) {
  return http({
    url: `/meishan/img/upload/sample`,
    method: 'POST',
    data
  })
}