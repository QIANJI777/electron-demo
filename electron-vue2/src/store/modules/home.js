import axios from 'axios'
import build_type from '@/assets/utils/build_type.js'
import BASE_URL from '@/assets/utils/config'
const state = {
  jurisdiction: [],
  orgList: [],
  orgTreeData: [],
  orgTreeValue: [],
  orgNameValue: '',
  loginOrgTreeData: [],
  isOwnPartyName: null,
  ownBelong: null
};
const getters = {
  getOrgNameValue (state) {
    return state.orgNameValue
  },
  getOwnBelong (state) {
    return state.ownBelong
  },
  initJuridiction (state) {
    return state.jurisdiction
  },
  initAllorg (state) {
    return state.orgList
  },
  getOrgTreeData (state) {
    return state.orgTreeData
  },
  getOrgTreeValue (state) {
    return state.orgTreeValue
  },
  getLoginTreeData (state) {
    return state.loginOrgTreeData
  },
  getIsOwnPartyName (state) {
    return state.isOwnPartyName
  }
};
const mutations = {
  initOrgNameValue (state, message) {
    state.orgNameValue = message
  },
  initOwnBelong (state) {
    state.ownBelong = null
  },
  changeOwnBelong (state, messaage) {
    if (messaage === true) {
      state.ownBelong = 1
    } else if (messaage === false) {
      state.ownBelong = 0
    }
  },
  getJurisdiction (state) {
    axios.get(BASE_URL[build_type] + '/sys/sys/permission/listByUser').then(res => {
      console.log(res)
    })
  },
  getAllorg (state) {
    axios.get(BASE_URL[build_type] + '/sys/sys/org/treeAllOrg').then(res => {
      function getTureOptions (value) {
        if (state.isOwnPartyName === true) {
          for (let item of value) {
            if (item.status !== 'normal') {
              item.disabled = true
            }
            item.disabled = true
            if (item.childList.length !== 0) {
              getTureOptions(item.childList)
            }
          }
        } else {
          for (let item of value) {
            if (item.status !== 'normal') {
              item.disabled = true
            }
            item.disabled = false
            if (item.childList.length !== 0) {
              getTureOptions(item.childList)
            }
          }
        }
        return value
      }
      state.orgList = getTureOptions(res.data.orgList)
      state.orgTreeData = JSON.parse(JSON.stringify(res.data.orgList))
      state.ownBelong = res.data.includeAllChildOrgFlag
      state.orgTreeValue = res.data.orgList[0].partyCode
    })
  },
  changeIsBelong (state, message) {
    if (message === true) {
      // state.orgTreeData = state.orgList
      state.isOwnPartyName = false
    } else {
      // state.orgTreeData = JSON.parse(JSON.stringify(state.orgList))
      // for(let item of state.orgTreeData){
      //   item.childList = []
      // }
      //机构选项禁用
      state.isOwnPartyName = true
    }
  },
  initLoginTreeData (state, message) {
    if (message.orgList[0].childList.length !== 0) {
      let newArry = []
      let object = {
        partyName: '全部',
        partyCode: '',
        childList: message.orgList
      }
      newArry.push(object)
      state.loginOrgTreeData = newArry
      state.isOwnPartyName = false
    } else {
      state.loginOrgTreeData = message.orgList
      state.isOwnPartyName = true
    }
    // // 初始包含上下级选中状态
    // if(state.ownBelong === 0 && state.loginOrgTreeData[0].childList.length !==0){
    //   sessionStorage.setItem('seachPartyCode',JSON.stringify(state.loginOrgTreeData[0].partyCode))
    // }else if(state.ownBelong === 1 && state.loginOrgTreeData[0].childList.length !==0){
    //   sessionStorage.setItem('seachPartyCode',JSON.stringify(''))
    // }else if(state.loginOrgTreeData[0].childList.length === 0) {
    //   sessionStorage.setItem('seachPartyCode',JSON.stringify(state.loginOrgTreeData[0].partyCode))
    // }
  }
};
const actions = {
  getJurisdiction (context, message) {
    context.commit('getJurisdiction', message)
  },
  getAllorg (context, message) {
    context.commit('getAllorg', message)
  },
  // changeOrgTreeData(context,message){
  //   context.commit('changeOrgTreeData',message)
  // },
  changeOrgTreeValue (context, message) {
    context.commit('changeOrgTreeValue', message)
  },
  changeIsBelong (context, message) {
    context.commit('changeIsBelong', message)
  },
  initLoginTreeData (context, message) {
    context.commit('initLoginTreeData', message)
  },
  changeOwnBelong (context, message) {
    context.commit('changeOwnBelong', message)
  },
  initOwnBelong (context, message) {
    context.commit('initOwnBelong', message)
  },
  initOrgNameValue (context, message) {
    context.commit('initOrgNameValue', message)
  }
};
export default {
  namespaced: true,//用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
}
