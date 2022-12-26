import http from '../http.js'

// 执行增广
export function exeAugment(params) {
  return http({
    url: '/meishan/sampleOriginal/augmented?dataId=' + params.dataId + '&augmentedWayList=' + params.modelList,
    method: 'GET'
    // baseURL: process.env.NODE_ENV  == 'development' ? 'http://localhost:8080/enlarge' : 'http://10.10.11.153:5000',
  })
}

// GAN网络增广
export function exeGan_Guijiao(params) {
  return http({
    url: '/meishan/sampleOriginal/gungjenlarge?dataId=' + params.dataId,
    method: 'POST'
    // baseURL: process.env.NODE_ENV  == 'development' ? 'http://localhost:8080/enlarge' : 'http://10.10.11.153:5000',
  })
}

//数据增广保存
export function saveAugmentedRes(data) {
  return http({
    url: '/meishan/sampleOriginal/augmentedData',
    method: 'POST',
    data
  })
}