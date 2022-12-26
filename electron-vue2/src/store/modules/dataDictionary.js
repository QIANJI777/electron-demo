import { Message } from 'element-ui'
import { base_dictIndex_list_get, basedictInfo_list_get, base_dictIndex_save } from '@/service/modules/setting.js'

const state = {
  dataIndex: [],
  dataInfo: [],
  dictIndexValue: '',
  addIndexshow: false,
};
const getters = {
  renderDataIndex (state) {
    return state.dataIndex
  },
  renderDataInfo (state) {
    return state.dataInfo
  },
  renderaddIndexshow (state) {
    return state.addIndexshow
  }
};
const mutations = {
  setDataInfo (state, params) {
    state.dataInfo = params
  },
  setDataIndex (state, params) {
    state.dataIndex = params
  },
  setDictIndexValue (state, params) {
    state.dictIndexValue = params
  },
  setAddIndexshow (state, params) {
    state.setAddIndexshow = params
  },
};
const actions = {
  initDataIndex ({ commit }, message) {
    base_dictIndex_list_get({
      dictIndexName: message.dictIndexName,
      dictType: message.dictType,
    }).then(res => {
      commit('setDataInfo', res.data)
    })
  },
  initDataInfo ({ commit }, message) {
    if (!message) message = 'undefined'
    basedictInfo_list_get({
      dictIndexValue: message
    }).then(res => {
      commit('setDataIndex', res.data)
    })
  },
  updatadictIndexValue ({ commit }, message) {
    commit('setDictIndexValue', message.value)
  },
  addIndexfrom ({ commit }, message) {
    let dictIndexDto = {
      dictIndexName: message.name,
      dictIndexValue: message.value
    };
    base_dictIndex_save(dictIndexDto).then(res => {
      Message({ message: res.msg });
      if (res.code === 'SUCCESS') {
        base_dictIndex_list_get().then(res => {
          commit('setDataInfo', res.data)
          commit('setAddIndexshow', false)
        })
      }
    })
  },
};
export default {
  namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
}