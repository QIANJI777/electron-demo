// import { setToken } from '@/assets/utils/userAccount.js'

// import Cookies from 'js-cookie'

const TokenKey = 'token'
const userInfoKey = 'userInfo'
// localStorage

export function getToken() {
  // return localStorage.getItem(TokenKey)
  return sessionStorage.getItem(TokenKey)
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  // return localStorage.setItem(TokenKey, token)
  return sessionStorage.setItem(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // return localStorage.removeItem(TokenKey)
  return sessionStorage.removeItem(TokenKey)
  // return Cookies.remove(TokenKey)
}

// export function setUserInfo(userInfo) {
//   return localStorage.setItem(userInfoKey, JSON.stringify(userInfo))
// }

// export function getUserInfo() {
//   return localStorage.getItem(userInfoKey) && JSON.parse(localStorage.getItem(userInfoKey)) ||  ''
// }

// export function removeUserInfo() {
//   return localStorage.removeItem(userInfoKey)
// }

/**
* 树结构转换
* @createTime: 11/23/2021, 2:20:19 PM
*/
export function toTree(data) {
  let treeData = [];
  if (!Array.isArray(data)) return treeData;

  data.forEach(item => {
    // 删除item下的children，以防多次调用
    delete item.children;
  });

  let map = {};
  data.forEach(item => {
    map[item.id] = item;
  });

  data.forEach(item => {
    // 判断item的parentId是否存在map中
    let parent = map[item.parentId];
    if(parent) {  
      // 如果存在则表示item不是最顶层的数据
      (parent.children || (parent.children = [])).push(item)
    }else {
      // 如果不存在 则是顶层数据
      treeData.push(item)
    }
  });
  return treeData
}
