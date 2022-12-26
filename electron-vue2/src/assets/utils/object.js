/**
 * @description 将数组对象中, 某对象的children移到对象同级, 深度只有一层
 * @params {Object[]} arr:目标数组
 * @params {String} childKey: children的键值
 * @return: {Object[]} 
 * @createTime: 2022/05/26, 10:05:11
 */
import { cloneDeep } from 'lodash'
export function moveChildrenToSameLevel(arr, childKey) {
  let arr_clone = cloneDeep(arr)
  let childrenArrs = []
  arr_clone.map((cur, index) => {
    let childrenArr = cloneDeep(cur[childKey])
    cur[childKey] = []
    childrenArrs = childrenArrs.concat(childrenArr)
  }, [])
  let res = arr_clone.concat(childrenArrs)
  return res
}
