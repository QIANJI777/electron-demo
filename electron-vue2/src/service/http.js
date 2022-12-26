/**
 * @description 请求封装
 */

import axios from 'axios'
import router from '../router/index'
import BASE_URL from '../assets/utils/config.js'
import build_type from '../assets/utils/build_type.js'
import { getToken, getUserInfo, removeToken, removeUserInfo } from '../assets/utils/userAccount'
import { showLoading, hideLoading } from '@/assets/utils/axiosLoading.js'

const { error } = require('../assets/utils/message.js')

const http = axios.create({
  baseURL: BASE_URL[build_type],
  // timeout: 20000,
})

http.interceptors.request.use(
  config => {
    if (!config.noToken) {
      config.headers.token = getToken()
    }
    // 某些请求的_BASE_URL
    if (config._BASE_URL) {
      config.baseURL = config._BASE_URL
    }
    // 特殊配置：设置下载获取 excel 接口的返回值为 blob。这在异步下载文件时有时会显得很有用。
    // if (config.url === '/api/excel/download') {
    //   config.responseType = 'blob'
    // }
    // if (!config.noNeedToken) {
    //   // if (getUserInfo()) {
    //   // 需要携带用户信息的操作
    //   // }
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  response => {
    hideLoading()
    let res = response.data
    // 下载图片
    if (response.config.responseType === 'arraybuffer') {
      if (response.status === 200) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(new Error(response.statusText || 'Error'))
      }
    }

    if (res.code == 401 || res.msg === '会话已过期，请重新登录') {
      removeToken()
      // removeUserInfo()
      router.push('/login')
    }
    if (res.code !== 'SUCCESS' && res.status !== 200) {
      error(res.msg)
      return Promise.reject(new Error((res && res.msg) || 'Error'))
    }
    return Promise.resolve(res)
  },
  err => {
    return Promise.reject(err)
  }
)
export default http
