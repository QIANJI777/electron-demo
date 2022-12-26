import { role_pageList_get, permission_list_get, permission_listByRoleId_get } from '@/service/modules/setting.js'

// import router from '../../router'
// import weburl from '../../config'
// import {Message} from 'element-ui'
const state = {
  tableData: [],
  treeData: [],
  //
  btnPermissList: [],
  //
  usergroupName: '',
  usergroupId: null,
  permissionIdlist: [],
  pageData: {
    total: null,
    allPage: null
  }
};
const getters = {
  renderTabledata (state) {
    return state.tableData
  },
  rendertreeData (state) {
    return state.treeData
  },
  renderPermissionIdlist (state) {
    return state.permissionIdlist
  },
  renderPageData (state) {
    return state.pageData
  }
};
const mutations = {
  setPermissionIdlist (state, params) {
    state.permissionIdlist = params
  },
  setTreeData (state, params) {
    state.treeData = params
  },
  setTableData (state, params) {
    state.tableData = params
  },
  setPageData (state, params) {
    state.pageData = params
  },
  changechecked (state, message) {
    console.log(message);
    state.permissionIdlist = message
  },
  updatauserGroup (state, message) {
    state.usergroupName = message.value
  },
};
const actions = {
  initTable ({ commit }, message) {
    let obj = {
      roleName: message.groupName,
      pageNo: message.pageNo,
      pageSize: 8,
    }
    role_pageList_get(obj).then(res => {
      commit('setTableData', res.data)
      commit('setPageData', {
        total: Number(res.totalCount),
        allPage: Number(res.totalPages),
      })
    })
  },
  updatauserGroup (context, message) {
    context.commit('updatauserGroup', message)
  },
  initTree ({ commit }, message) {
    permission_list_get().then(res => {
      for (let item of res.data) {
        for (let item2 of item.childList) {
          for (let item3 of item2.childList) {
            if (item3.permissionType === 'element') {
              item2.childList = []
            }
          }
        }
      }
      commit('setTreeData', res.data)
    })
  },
  updataPermissionIdlist (context, message) {
    context.commit('setPermissionIdlist', message)
  },
  getRolepermission ({ commit }, message) {
    permission_listByRoleId_get({ roleId: message }).then(res => {
      let arry = [];
      for (let item of res.data) {
        arry.push(item.id)
      }
      commit('setPermissionIdlist', arry)
    })
  },
  changechecked (context, message) {
    context.commit('changechecked', message)
  }
};
export default {
  namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
}
