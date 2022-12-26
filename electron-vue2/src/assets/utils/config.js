// 内网 10.176.143.238
const BASE_URL = {
  data_augment: 'http://10.176.143.238:10300', // 数据增广
  data_mark: 'http://10.176.143.238:10500',    // 数据标注
  data_filter: 'http://10.176.143.238:10400',  // 数据筛选
}
// 测试环境
// const BASE_URL = {
//   data_augment: 'http://10.10.11.30:10300',
//   data_mark: 'http://10.10.11.30:10500',
//   data_filter: 'http://10.10.11.30:10400',
// }
// const BASE_URL = {
//   data_augment: 'http://10.10.11.24:10300',
//   data_mark: 'http://10.10.11.24:10500',
//   data_filter: 'http://10.10.11.24:10400',
// }

// 内网
export const websocketUrl = {
  data_augment: 'ws://10.176.143.238:10300/websocket/',
  data_mark: 'ws://10.176.143.238:10500/websocket/',
  data_filter: 'ws://10.176.143.238:10400/websocket/',
}
// 测试环境
// export const websocketUrl = {
//   data_augment: 'ws://10.10.11.30:10300/websocket/',
//   data_mark: 'ws://10.10.11.30:10500/websocket/',
//   data_filter: 'ws://10.10.11.30:10400/websocket/',
// }
// export const websocketUrl = {
//   data_augment: 'ws://10.10.11.24:10300/websocket/',
//   data_mark: 'ws://10.10.11.24:10500/websocket/',
//   data_filter: 'ws://10.10.11.24:10400/websocket/',
// }
export default BASE_URL