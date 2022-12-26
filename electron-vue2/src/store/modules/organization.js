import { org_pageList_get } from '@/service/modules/setting.js'

// import url from '../../config'
// import {Message} from 'element-ui'
// import Cookies from 'js-cookie';
const state = {
  InstitutionalCode: '',
  tableData: [],
  pageData: {
    total: null,
    allPage: null,
  },
  pageNum: 1,
}
const getters = {
  renderPageData () {
    return state.pageData
  },
  renderTabledata () {
    return state.tableData
  },
  renderPageNum () {
    return state.pageNum
  },
}
const mutations = {
  setTableData (state, params) {
    state.tableData = params
  },
  setPageData (state, params) {
    state.pageData = params
  },
  updataInstitutionalCode (state, message) {
    state.InstitutionalCode = message.value
  },
  initPageNum (state, message) {
    state.pageNum = message
  },
}
const actions = {
  initTabledata ({ commit }, message) {
    let obj = {
      partyName: state.InstitutionalCode,
      pageNo: message.pageNum,
      pageSize: 8,
    }
    org_pageList_get(obj).then(res => {
      commit('setTableData', res.data)
      commit('setPageData', {
        total: Number(res.totalCount),
        allPage: Number(res.totalPages),
      })
      if (state.pageData.total === (message.pageNum - 1) * 8 && state.pageData.total !== 0) {
        state.pageNum = state.pageNum - 1
        org_pageList_get(obj).then(res => {
          commit('setTableData', res.data)
          commit('setPageData', {
            total: Number(res.totalCount),
            allPage: Number(res.totalPages),
          })
        })
      }
    })
  },
  updataInstitutionalCode (context, message) {
    context.commit('updataInstitutionalCode', message)
  },
  initPageNum (context, message) {
    context.commit('initPageNum', message)
  },
}
export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions,
}
