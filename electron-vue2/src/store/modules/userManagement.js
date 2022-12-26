import { permission_list_get, role_list_get, permission_listByPartyCode_get, basedictInfo_list_get } from '@/service/modules/setting.js'

import { getToken } from '@/assets/utils/userAccount.js'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    id: '',
    orgList: [], //组织列表
    curOrg: {}, //当前机构
    //
    tableData: [],
    treeData: [],
    userName: '',
    usergroupOptions: [],
    permissionIdlist: [],
    partOptions: [],
  }
}

const state = getDefaultState()

const getters = {
  renderTabledata (state) {
    return state.tableData
  },
  rendertreeData (state) {
    return state.treeData
  },
  remderUsergroupOptions (state) {
    return state.usergroupOptions
  },
  renderPermissionIdlist (state) {
    return state.permissionIdlist
  },
  renderPartyData (state) {
    // console.log(state.partOptions);
    return state.partOptions
  }
}

const mutations = {
  setTableData (state, params) {
    state.tableData = params
  },
  setTreeData (state, params) {
    state.treeData = params
  },
  setUsergroupOptions (state, params) {
    state.usergroupOptions = params
  },
  setPermissionIdlist (state, params) {
    state.permissionIdlist = params
  },
  setPartOptions (state, params) {
    state.partOptions = params
  },
}

const actions = {
  initTree ({ commit }, message) {
    permission_list_get().then(res => {
      commit('setTreeData', res.data)
    })
  },
  initUsergroupOptions ({ commit }, message) {
    role_list_get().then(res => {
      commit('setUsergroupOptions', res.data)
    })
  },
  getRolepermission ({ commit }, message) {
    permission_listByPartyCode_get({ partyCode: message }).then(res => {
      let arry = []
      for (let item of res.data) {
        arry.push(item.id)
      }
      commit('setPermissionIdlist', arry)
    })
  },
  getPartyData ({ commit }, message) {
    basedictInfo_list_get({ dictIndexValue: 'party' }).then(res => {
      commit('setPartOptions', res.data)
    })
  }
}

export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  mutations,
  actions,
  getters
}
