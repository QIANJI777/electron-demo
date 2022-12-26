<template>
  <div class="mechanismCom" tabindex="0" @focus="focusOn" @blur="blurfns" style="outline:none">
    <div class="checkBox" @click="changeOrg">
      <a :title="orgName" class="nameBox">
        <div class="isDistable" v-if="isOwnPartyName"></div>
        <div class="nameBox"><span :title="orgName">{{orgName}}</span></div>
      </a>
      <div v-bind:class="{'el-icon-arrow-up': displayOrgDialog,'el-icon-arrow-down': displayOrgDialog===false}"></div>
    </div>
    <div v-show="displayOrgDialog" class="diogrep" @mousedown="focusOnT">
      <el-scrollbar style="height:100%">
        <el-tree
            :data="treeOrglistData"
            :expand-on-click-node="false"
            node-key="partyCode"
            ref="treeForms"
            @node-click="handleNodeClick"
            :default-expanded-keys="defaultShowNodes"
            check-strictly
            :props="defaultProps">
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
// import url from "@/config";
// function flatten(array) {
//   return [].concat(...array.map(item => [].concat(item,...flatten(item.childList))))
// }
export default {
  name: "mechanismCom",
  props: ['searchOrg'],
  watch:{
    treeOrglistData(newData,oldData){
      if(this.treeOrglistData[0].childList.length === 0){
        this.isOwnPartyName = true
        this.displayOrgDialog = false
        this.orgName = this.treeOrglistData[0].partyName
        this.checkedId = this.treeOrglistData[0].partyCode
        // //  初始显示
        // if(this.treeOrglistData[0].partyCode !== sessionStorage.getItem('seachPartyCode')){
        //   this.initTreeList()
        // }
      }else if (this.treeOrglistData[0].childList.length >= 1){
        this.isOwnPartyName = false
        this.orgName = this.treeOrglistData[0].partyName
        this.checkedId = this.treeOrglistData[0].partyCode
        // //  初始显示
        // console.log(this.treeOrglistData[0].childList[0].partyCode,sessionStorage.getItem('seachPartyCode'))
        // if(this.treeOrglistData[0].childList[0].partyCode !== sessionStorage.getItem('seachPartyCode')){
        //   this.initTreeList()
        // }
      }
      if(oldData.length !== 0){
        // if(this.treeOrglistData[0].childList.length === 0){
        //   sessionStorage.setItem('seachPartyCode',JSON.stringify(this.checkedId))
        // }else {
        //   sessionStorage.setItem('seachPartyCode',JSON.stringify(''))
        // }
        this.$emit('changeOrgParent',this.$route.path)
      }
    //切换机构判断

    //
    }
  },
  computed:{
    ...mapGetters('orgBelong',{
      treeOrglistData: 'getTreeList'
    })
  },
  data(){
    return{
      orgName: '',
      displayOrgDialog: false,
      defaultProps: {
        label: 'partyName',
        children: 'childList'
      },
      checkedId: '',
      locker: true,
      defaultShowNodes: [],
      isOwnPartyName: false
    }
  },
  mounted() {
    if(this.treeOrglistData.length !==0){
      if(this.treeOrglistData[0].partyCode === ''){
        this.isOwnPartyName = false
        this.orgName = this.treeOrglistData[0].partyName
        this.checkedId = this.treeOrglistData[0].partyCode
      }else {
        this.isOwnPartyName = true
        this.orgName = this.treeOrglistData[0].partyName
        this.checkedId = this.treeOrglistData[0].partyCode
      }
    }
  },
  methods:{
    blurfns(){
      let that = this
      setTimeout(function () {
        that.displayOrgDialog = false
      },300)
    },
    focusOn(){},
    focusOnT(event){
      event.preventDefault()
    },
    ...mapActions('orgBelong',['initTreeList','changeShowDom']),
    handleNodeClick(data,node,partent){
      if(data.partyCode !== this.checkedId){
        this.checkedId = data.partyCode
        this.orgName = data.partyName
        sessionStorage.setItem('seachPartyCode',JSON.stringify(data.partyCode))
        this.displayOrgDialog = false
        if(this.searchOrg === false){
          this.$emit('changeOrgParent', this.checkedId)
        }
      }
    },
    changeOrg(){
      if(this.isOwnPartyName === false){
        this.displayOrgDialog = !this.displayOrgDialog
        this.defaultShowNodes = [this.treeOrglistData[0].partyCode]
      }
    },
    childTwo(){
      if(this.checkedId === ''){
        sessionStorage.setItem('seachPartyCode',JSON.stringify(''))
      }else {
        sessionStorage.setItem('seachPartyCode',JSON.stringify(this.checkedId))
      }
    },
    childInit(){
      if(this.treeOrglistData[0].childList.length === 0){
        this.orgName = this.treeOrglistData[0].partyName
        this.checkedId = this.treeOrglistData[0].partyCode
      }else if (this.treeOrglistData[0].childList.length >= 1){
        this.orgName = this.treeOrglistData[0].partyName
        this.checkedId = this.treeOrglistData[0].partyCode
      }
      if(this.treeOrglistData[0].childList.length === 0){
        sessionStorage.setItem('seachPartyCode',JSON.stringify(this.checkedId))
      }else {
        sessionStorage.setItem('seachPartyCode',JSON.stringify(''))
      }
    }
  }
}
</script>

<style>
.mechanismCom{
  position: absolute;
  /* top: -2px; */
  /* right: 0; */
  /* transform: translate(0,-21.5px); */
  z-index: 1000;
}
.mechanismCom .checkBox{
  cursor: pointer;
  width: 210px;
  height: 32px!important;
  line-height: 30px;
  /*overflow: auto;*/
  overflow: hidden!important;
  border: 1PX solid #DCDFE6;
  background-color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  position: relative;
}
.mechanismCom .isDistable{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0,0,0,0.04);
  color: rgba(0,0,0,0.25);
  z-index: 5;
  cursor:no-drop
}
.mechanismCom .nameBox{
  width: 180px;
  height: 100%;
  line-height: 30px;
  overflow: hidden;
  font-size: 14px;
}
.mechanismCom .diogrep{
  width: 210px;
  height: 400px;
  /*border: 1px solid #DCDFE6;*/
  border-radius: 8px;
  box-shadow:0 0 3px 1px #ccc;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;
}
.el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
.el-tree>.el-tree-node{
  min-width: 100%;
  display:inline-block;
}
.mechanismCom .el-form-item__content{
  line-height: 0;
}
</style>
