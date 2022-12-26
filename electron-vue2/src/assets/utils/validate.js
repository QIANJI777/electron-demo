/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
/**
 *
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateMobile = (rule, value, callback) => {
  const mobile = /^[0-9]{11}$/
  if (!mobile.test(value)) {
    callback(new Error('手机号码格式不正确'))
  } else {
    callback()
  }
}
/**
 *
 * @param {string} str
 * 获取str的字节数
 */
 export const getChars = (str) =>  {
  var i = 0
  var c = 0.0
  var unicode = 0
  var len = 0
  if (str == '' || str == null) {
    return 0
  }

  len = str.length
  for (i = 0; i < len; i++) {
    unicode = str.charCodeAt(i)
    if (unicode < 127) {
      //判断是单字符还是双字符
      c += 1
    } else {
      //chinese
      c += 4
    }
  }
  return c
}
