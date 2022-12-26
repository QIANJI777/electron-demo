const { dialog, ipcMain, ipcRenderer, app } = require('electron')
const Store = require('electron-store')
const store = new Store()
const info = require('../package.json')
const path = require('path')
// 引入lowdb
const LodashId = require('lodash-id')
const fs = require('fs-extra')
const { join } = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const STORE_PATH = app.getPath('userData')
// 加密
const enc = require('./crypto.js')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}
// const adapter = new FileSync(join(STORE_PATH, '/data.json'))
// 加密
const adapter = new FileSync(join(STORE_PATH, '/data.json'), {
  serialize: (obj) => enc.encrypt(JSON.stringify(obj)),
  deserialize: (data) => JSON.parse(enc.decrypt(data)),
})
const db = low(adapter)
db._.mixin(LodashId)
const read = () => {
  return db.read()
}
// 数据库的初始结构
db.defaults({}).write()

const Utils = {
  ipcOn: () => {
    ipcMain.on('about', (event) => {
      dialog.showMessageBox({
        title: 'test',
        message: 'test',
        detail: `Version: ${info.version}`,
      })
    })

    // lowdb 写入, 都要用write()方法来保存
    ipcMain.on('dbSet', (event, key, val) => {
      read().set(key, val).write()
    })
    // 数组insert
    ipcMain.on('dbPush', (event, key, val) => {
      read().get(key).push(val).write()
    })
    // update, callback: (n) => n+1
    ipcMain.on('dbUpdate', (event, key, callback) => {
      read().update(key, callback).write()
    })
    // remove 可以通过remove()方法删除一个符合条件的项 { title: 'low!' }
    ipcMain.on('dbRemove', (event, key, val) => {
      read().get(key).remove(val).write()
    })
    // unset 删除一个属性 user.name
    ipcMain.on('dbUnset', (event, prop) => {
      read().unset(prop).write()
    })
    // lowdb 读取, 都要有value()方法来获取
    ipcMain.handle('dbGet', (event, key) => {
      const data = read().get(key).value()
      return data
    })

    // 通用方法用于保存本地数据
    ipcMain.on('saveStore', (event, { storeName, val }) => {
      store.set(storeName, val)
    })

    // 通用方法用于读取本地数据
    ipcMain.handle('getStore', (event, { storeName }) => {
      return store.get(storeName)
    })
  },
}
module.exports = Utils
