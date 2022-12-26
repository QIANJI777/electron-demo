import { org_department_pageList_get } from '@/service/modules/setting.js'

const state = {
  tableData: [],
  pageData: {
    total: null,
    allPage: null
  }
};
const getters ={
  renderTabledata(state){
    return state.tableData
  },
  renderPageData(state){
    return state.pageData
  }
};
const mutations = {
  setTableData (state, params) {
    state.tableData = params
  },
  setPageData (state, params) {
    state.pageData = params
  },
};
const actions = {
  initTabledata({commit},message){
    let obj = {
      departmentName: message.departmentName,
      pageNo: message.pageNo,
      pageSize: 8,
    }
    org_department_pageList_get(obj).then(res=>{
      commit('setTableData', res.data)
      commit('setPageData', {
        total: Number(res.totalCount),
        allPage: Number(res.totalPages),
      })
    })
  }
};
export default {
  namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
}
