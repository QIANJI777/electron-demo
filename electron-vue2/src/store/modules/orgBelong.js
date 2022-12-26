import { org_treeOrgByLogin_get } from '@/service/modules/setting.js'

const state = {
    treeOrgList: [],
    showDom: false,
    isRouter: false
}
const getters = {
    getIsRouter () {
        return state.isRouter
    },
    getTreeList (state) {
        return state.treeOrgList
    },
    getShowDom (state) {
        return state.showDom
    }
}
const mutations = {
    setIsRouter (state, params) {
        state.isRouter = params
    },
    setTreeOrgList (state, params) {
        state.treeOrgList = params
    },
    changeShowDom (state) {
        state.showDom = true
    }
}
const actions = {
    initTreeList ({ commit }, message) {
        org_treeOrgByLogin_get().then(res => {
            commit('setIsRouter', true)
            if (res.data === null) {
                return false
            }
            if (res.data.orgList[0].childList.length === 0) {
                commit('setTreeOrgList', res.data.orgList)
                sessionStorage.setItem('seachPartyCode', JSON.stringify(res.data.orgList[0].partyCode))
            } else if (res.data.orgList[0].childList.length >= 1) {
                let newArry = []
                let object = {
                    partyName: '全部',
                    partyCode: '',
                    childList: res.data.orgList
                }
                newArry.push(object)
                commit('setTreeOrgList', res.data.orgList)
                sessionStorage.setItem('seachPartyCode', JSON.stringify(''))
            }
        })

    }
}
export default {
    namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
    state,
    getters,
    mutations,
    actions
}
