import http from '../http.js'

// 识别任务数据
export function getImgs_manualCheck(params) {
  return http({
    url: '/meishan/identifyImg/audit/page',
    method: 'post',
    data:params,
  })
}

export function identifyImg_delete(identifyImgId) {
  return http({
    url: '/meishan/identifyImg/delete/' + identifyImgId,
    method: 'POST',
  })
}

export function getIdentifyImg(taskId) {
  return http({
    url: `/meishan/identifyImg/list/${taskId}`,
    method: 'GET',
  })
}

export function imgClean(taskId) {
  return http({
    url: `/meishan/identifyImg/clean/${taskId}`,
    method: 'POST',
  })
}

//批量上传图片(图片识别)
export function moreUploadImg(data) {
  return http({
    url: '/meishan/img/uploadImgBatch/defectIdentification',
    method: 'POST',
    data,
  })
}

//根据任务id获取任务基础信息
export function getCurTask(taskId) {
  return http({
    url: `/meishan/defectIdentificationTask/one/${taskId}`,
    method: 'GET',
  })
}

//缺陷识别任务开始识别
export function startDistinguish(data) {
  return http({
    url: `/meishan/defectIdentificationTask/begin?modelList=${data.modelList}&taskId=${data.taskId}&modelType=${data.modelType}`,
    method: 'GET',
    data,
  })
}

//缺陷识别任务列表分页
export function getTypeTask(data) {
  return http({
    url: '/meishan/defectIdentificationTask/page',
    method: 'POST',
    data
  })
}

//添加标注
export function addTag(data) {
  return http({
    url: `/meishan/tag/add`,
    method: 'POST',
    data
  })
}

// 数据标注-保存标注
export function keepLabel(data) {
  return http({
    url: `meishan/falseAlarm/add`,
    method: 'POST',
    data: data
  })
}