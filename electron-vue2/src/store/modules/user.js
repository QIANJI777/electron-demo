import build_type from '@/assets/utils/build_type.js'

const state = {
  userInfo: {},
  userOrg: [],
  orgList: [],
  curOrg: {},
  test: 0,
  build_type() {
    return build_type || 'data_augment'
  },
}

const mutations = {
  setUserInfo(state, params) {
    state.userInfo = params
  },
  setUserOrg(state, params) {
    state.userOrg = params
  },
  setOrgList(state, params) {
    state.orgList = params
  },
  setCurOrg(state, params) {
    state.curOrg = params
  },
  setTest(state, params) {
    state.test = params
  },
}

const getters = {
  StateUserInfo(state) {
    return state.userInfo
  },
  StateUserOrg(state) {
    return state.userOrg
  },
  StateOrgList(state) {
    return state.orgList
  },
  StateCurOrg(state) {
    return state.curOrg
  },
  StateBuild_type(state) {
    return state.build_type()
  },
  StateTest(state) {
    return state.test
  },
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
}
