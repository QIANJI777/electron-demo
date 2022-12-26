import http from '../http.js'

export function addTask(data) {
  return http({
    url: `/meishan/sort/add`,
    method: 'POST',
    data
  })
}

// 批量上传
export function uploadBatch(data) {
  return http({
    url: `/meishan/sort/upload`,
    method: 'POST',
    // timeout: 10000000,
    data
  })
}

// 开始分类
export function sortDistinguish(data) {
  return http({
    url: `/meishan/sort/distinguish`,
    method: 'POST',
    data
  })
}


//获取当前任务识别信息
export function getTaskInfo(taskId) {
  return http({
    url: `/meishan/defectIdentificationTask/currentTask?taskId=${taskId}`,
    method: 'GET'
  })
}

// 分类保存
export function sortConfirm(data) {
  return http({
    url: `/meishan/sort/confirm`,
    method: 'POST',
    data
  })
}