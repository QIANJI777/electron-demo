/**
 * @description element-ui message方法封装
 */

import { Message } from 'element-ui'

/**
  * @params {String} 提示信息
  * @params {Boolean} 允许多个消息提示
  * @params {Boolean} 是否显示关闭图标
  * @createTime: 2022/05/31, 16:42:00
  */
let error = (msg, allowMultiple, closeable) => {
  if (!allowMultiple) Message.closeAll()
  Message({
    message: msg,
    type: 'error',
    duration: 2000,
    showClose: closeable,
  })
}

/**
  * @params {String} 提示信息
  * @params {Boolean} 允许多个消息提示
  * @params {Boolean} 是否显示关闭图标
  * @createTime: 2022/05/31, 16:42:00
  */
let success = (msg, allowMultiple, closeable) => {
  if (!allowMultiple) Message.closeAll()
  Message({
    message: msg,
    type: 'success',
    duration: 2000,
    showClose: closeable,
  })
}

/**
  * @params {String} 提示信息
  * @params {Boolean} 允许多个消息提示
  * @params {Boolean} 是否显示关闭图标
  * @createTime: 2022/05/31, 16:42:00
  */
let warning = (msg, allowMultiple, closeable) => {
  if (!allowMultiple) Message.closeAll()
  Message({
    message: msg,
    type: 'warning',
    duration: 3000,
    showClose: closeable,
  })
}

let info = (msg, allowMultiple, closeable) => {
  if (!allowMultiple) Message.closeAll()
  Message({
    message: msg,
    duration: 3000,
    showClose: closeable,
  })
}

export { error, success, warning, info }
