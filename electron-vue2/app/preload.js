/**
 * @description 预加载. 将需要的方法暴露给window
 * @params {_platform} 当前平台
 * @params {ipc} ipcRenderer
 * @createTime: 2022/04/27, 17:14:54
 */
const { contextBridge, ipcRenderer } = require('electron')
// const Store = require('electron-store')
// const store = new Store()
// contextBridge.exposeInMainWorld('store', {
//   setStore: (storeName, val) => {
//     store.set(storeName, val)
//   },
//   getStore: (storeName) => {
//     store.get(storeName)
//   },
// })

contextBridge.exposeInMainWorld('_platform', process.platform)

/**
 * 通信方法挂载到window对象上
 * 在渲染进程中使用:
 * <script>
 * window.ipc.on('pong', (e, f) => console.log(e, f))
 * window.ipc.send('ping', val)
 * </script>
 */
contextBridge.exposeInMainWorld('ipc', {
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener)
  },
})
