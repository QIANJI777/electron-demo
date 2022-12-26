<template>
  <div class="everyPage userGroup">
    <div class="condition" style="height: 65px !important">
      <div class="condition-input" style="padding-top: 12px; font-size: 14px; margin-left: 0; margin-top: -6px">
        用户组
        <el-input
          style="width: 300px; margin-left: 15px"
          placeholder="请输入用户组名称"
          v-model="groupName"
          class="el-inputStyle"
        ></el-input>
      </div>
      <el-button style="float: right; margin-top: 12px; margin-right: 30px" @click="searchTable">查询</el-button>
    </div>
    <div class="tableBox">
      <div class="buttonStyle" style="margin-bottom: 10px">
        <el-button type="primary" @click="addVisible = true">新增</el-button>
        <el-button type="dash" @click="editTabledata">编辑</el-button>
        <el-button type="dash" @click="deleteTable">删除</el-button>
        <el-button type="dash" @click="settingAuthority">权限设置</el-button>
      </div>
      <div>
        <el-table @selection-change="selectChange" :data="tableData" border>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="用户组名称" prop="roleName" width="200"></el-table-column>
          <el-table-column label="所属机构" prop="orgName" width="200"></el-table-column>
          <!--<el-table-column label="所属部门" prop=""></el-table-column>-->
          <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
        <div class="pageEnd" style="margin-top: 20px">
          <div class="block">
            <span style="line-height: 37px">共{{ pageData.total }}条记录第{{ pageNum }}/{{ pageData.allPage }}页</span>
            <div style="display: inline-block; margin-top: 2px; margin-left: 12px">
              <el-button @click="currentChange(1)" class="cancel-button">首页</el-button>
            </div>
            <el-pagination
              prev-text="<"
              next-text=">"
              layout="prev,next"
              style="display: inline-block"
              :current-page="pageNum"
              :page-size="8"
              @current-change="currentChange"
              background
              :total="pageData.total"
            >
            </el-pagination>
            <div style="display: inline-block; margin-top: 2px">
              <el-button @click="currentChange(pageData.allPage)" class="cancel-button">尾页</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="权限设置" :visible.sync="centerDialogVisible" width="60%">
      <div class="settingAuthority" v-loading="loading">
        <div>
          <div class="boxTitle">系统功能模块权限</div>
          <div class="treeDivstyle">
            <el-tree
              ref="tree"
              :check-strictly="false"
              :default-checked-keys="selectLists2"
              :props="props"
              :data="treeData"
              node-key="id"
              show-checkbox
              @check-change="checkChange"
            >
            </el-tree>
          </div>
        </div>
        <div>
          <div class="boxTitle">按钮权限</div>
          <div>
            <el-checkbox-group v-model="checkboxGroup1">
              <el-checkbox-button label="新增"
                ><div class="el-icon-plus"></div>
                新增</el-checkbox-button
              >
              <el-checkbox-button label="编辑"
                ><div class="el-icon-edit"></div>
                编辑</el-checkbox-button
              >
              <el-checkbox-button label="删除"
                ><div class="el-icon-delete-solid"></div>
                删除</el-checkbox-button
              >
              <el-checkbox-button label="批量导入"
                ><div class="el-icon-download"></div>
                批量导入</el-checkbox-button
              >
              <el-checkbox-button label="数据导出"
                ><div class="el-icon-upload2"></div>
                数据导出</el-checkbox-button
              >
              <el-checkbox-button label="维修"
                ><div class="el-icon-check"></div>
                维修</el-checkbox-button
              >
              <el-checkbox-button label="报废"
                ><div class="el-icon-close"></div>
                报废</el-checkbox-button
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户组新增" :visible.sync="addVisible" width="500px">
      <div>
        <el-form :model="addForm" :inline="true" ref="addForm" :rules="rules">
          <el-form-item label="所属机构" label-width="100px" prop="mechanism">
            <el-select v-model="addForm.mechanism" placeholder="请选择" style="width: 300px">
              <el-option v-for="item in parentOptions" :key="item.value" :label="item.partyName" :value="item.partyCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户组" label-width="100px" prop="userGroup">
            <el-input v-model="addForm.userGroup" placeholder="请填写用户组" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="100px" prop="remark">
            <el-input v-model="addForm.remark" placeholder="请输入备注信息" style="width: 300px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            addVisible = false
            addClose()
          "
          class="cancel-button"
          >取 消</el-button
        >
        <el-button class="sure-button" @click="addUsergroup('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户组编辑" :visible.sync="editVisible" width="500px">
      <div>
        <el-form :model="editForm" :inline="true" :rules="rules" ref="editForm">
          <el-form-item label="所属机构" label-width="100px" prop="mechanism">
            <el-select v-model="editForm.mechanism" placeholder="请选择" style="width: 300px">
              <el-option v-for="item in parentOptions" :key="item.value" :label="item.partyName" :value="item.partyCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户组" label-width="100px" prop="userGroup">
            <el-input v-model="editForm.userGroup" placeholder="请填写用户组" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="100px">
            <el-input v-model="editForm.remark" placeholder="请输入备注信息" style="width: 300px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" class="cancel-button">取 消</el-button>
        <el-button class="sure-button" @click="editUsergroup('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import mechanismCom from '@/components/mechanismCom'
import { role_update, role_delete, org_list_get, role_add, role_addpermission } from '@/service/modules/setting.js'
export default {
  name: 'usergroup',
  components: { mechanismCom },
  data() {
    return {
      // orgValue: '',
      orgOptions: [],
      loading: true,
      selectLists2: [],
      centerDialogVisible: false,
      addVisible: false,
      editVisible: false,
      props: {
        label: 'title',
        children: 'childList',
      },
      checkboxGroup1: [],
      addForm: {
        mechanism: '',
        userGroup: '',
        remark: '',
      },
      parentOptions: [],
      tableDataselectList: [],
      editForm: {
        mechanism: '',
        userGroup: '',
        remark: '',
      },
      editId: null,
      permissionId: null,
      pageNum: 1,
      rules: {
        mechanism: [{ required: true, message: '请选择所属机构', trigger: 'blur' }],
        userGroup: [{ required: true, message: '请填写用户组', trigger: 'blur' }],
      },
      checked: [], //已选择的项
      splice: [], //需要删除的项
      initFunction: '',
    }
  },
  computed: {
    ...mapGetters('usergroup', {
      tableData: 'renderTabledata',
      treeData: 'rendertreeData',
      selectLists: 'renderPermissionIdlist',
      pageData: 'renderPageData',
    }),
    groupName: {
      get() {
        return this.$store.state.usergroup.usergroupName
      },
      set(value) {
        this.$store.dispatch('usergroup/updatauserGroup', { value })
      },
    },
  },
  methods: {
    //
    childOne() {
      this.$refs.mychildTwo.childTwo()
    },
    changeOrgParent(data) {
      if (data === '/usergroup') {
        this.initFunction()
      }
    },
    addClose() {
      this.addForm = {
        mechanism: '',
        userGroup: '',
        remark: '',
      }
    },
    getParent(data1, data2, that2) {
      for (let item of data1) {
        for (let item2 of data2) {
          if (item2.id === item && item2.childList && item2.childList.length) {
            if (!that2.splice.includes(item)) {
              that2.splice.push(item)
            }
          }
          if (item2.childList) {
            this.getParent(data1, item2.childList, that2)
          }
        }
      }
    },
    //删除父级项
    spliceParent(arr1, arr2) {
      // arr1.forEach((item, index) => {
      //   const i = arr2.indexOf(item);
      //   arr2.splice(i, 1)
      // });
      for (let item of arr1) {
        const i = arr2.indexOf(item)
        arr2.splice(i, 1)
      }
      return arr2
    },
    //
    currentChange(val) {
      this.pageNum = val
      let message = {
        groupName: this.groupName,
        pageNo: this.pageNum,
        // orgCode: this.orgValue
      }
      this.initTable(message)
    },
    searchTable() {
      this.pageNum = 1
      let message = {
        groupName: this.groupName,
        pageNo: this.pageNum,
        // orgCode: this.orgValue
      }
      this.initTable(message)
    },
    editUsergroup(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let orgName = ''
          for (let item of this.parentOptions) {
            if (Number(this.editForm.mechanism) === Number(item.partyCode)) {
              orgName = item.partyName
            }
          }
          let object = {
            id: this.editId,
            orgCode: this.editForm.mechanism,
            orgName: orgName,
            roleName: this.editForm.userGroup,
            remark: this.editForm.remark,
          }
          role_update(object).then(res => {
            if (res.code === 'SUCCESS') {
              this.$message.success(res.msg)
              this.editVisible = false
              let message = {
                groupName: this.groupName,
                pageNo: this.pageNum,
                // orgCode: this.orgValue
              }
              this.initTable(message)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editTabledata() {
      if (this.tableDataselectList.length === 0) {
        this.$message.error('请选择一项数据后进行编辑')
        return false
      }
      if (this.tableDataselectList.length > 1) {
        this.$message.error('仅支持单项数据进行编辑')
        return false
      }
      this.editForm.userGroup = this.tableDataselectList[0].roleName
      this.editId = this.tableDataselectList[0].id
      this.editForm.remark = this.tableDataselectList[0].remark
      this.editForm.mechanism = this.tableDataselectList[0].orgCode
      this.editVisible = true
    },
    deleteTable() {
      if (this.tableDataselectList.length !== 1) {
        this.$message.error('请至少选择一项数据进行删除')
        return false
      }
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          role_delete({ roleId: this.tableDataselectList[0].id }).then(res => {
            if (res.code === 'SUCCESS') {
              this.$message.success(res.msg)
              let message = {
                groupName: this.groupName,
                pageNo: this.pageNum,
                // orgCode: this.orgValue
              }
              this.initTable(message)
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        })
    },
    addUsergroup(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let orgName = ''
          for (let item of this.parentOptions) {
            if (this.addForm.mechanism === item.partyCode) {
              orgName = item.partyName
            }
          }
          let object = {
            roleName: this.addForm.userGroup,
            remark: this.addForm.remark,
            orgCode: this.addForm.mechanism,
            orgName: orgName,
          }
          role_add(object).then(res => {
            if (res.code === 'SUCCESS') {
              this.$message.success(res.msg)
              this.addVisible = false
              this.addClose()
              let value = ''
              this.$store.dispatch('usergroup/updatauserGroup', { value })
              let message = {
                groupName: this.groupName,
                pageNo: this.pageNum,
                // orgCode: this.orgValue
              }
              this.initTable(message)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    selectChange(value) {
      this.tableDataselectList = value
    },
    sureAdd() {
      let selectIds = this.$refs.tree.getCheckedNodes(false, true)
      let arry = []
      for (let item of selectIds) {
        let object = {
          permissionId: item.id,
        }
        arry.push(object)
      }
      role_addpermission({ url: String(this.permissionId), data: arry }).then(res => {
        if (res.msg === '操作成功') {
          this.$message.success(res.msg)
          this.centerDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkChange() {},
    settingAuthority() {
      function deep(node) {
        let stack = node,
          data = []
        while (stack.length != 0) {
          let pop = stack.pop()
          data.push(pop)
          let children = pop.childList
          if (children.length !== 0) {
            for (let i = children.length - 1; i >= 0; i--) {
              stack.push(children[i])
            }
          }
        }
        return data
      }
      let that = this
      if (this.tableDataselectList.length !== 1) {
        this.$message.error('请选择一项数据进行操作')
        return false
      }
      this.permissionId = this.tableDataselectList[0].id
      this.getRolepermission(this.tableDataselectList[0].id)
      this.centerDialogVisible = true
      this.selectLists2 = []
      that.loading = true
      this.initTree()
      //
      setTimeout(function () {
        that.splice = []
        // that.$options.methods.getParent(that.selectLists, that.treeData, that);
        // //删除父级并赋值给已选择的数据
        // that.checked = that.$options.methods.spliceParent(that.splice, that.selectLists, that);
        that.checked = that.selectLists
        that.changechecked(that.checked)
        //   that.$nextTick(() => {
        //     that.$refs.tree.setCheckedKeys(that.checked);
        //   });
        let newArrys
        newArrys = deep(JSON.parse(JSON.stringify(that.treeData)))
        for (let item of newArrys) {
          for (let item2 of that.checked) {
            if (item2 === item.id && item.childList.length === 0) {
              that.selectLists2.push(item2)
            }
          }
        }
        that.$refs.tree.setCheckedKeys(that.selectLists2, false)
        that.loading = false
        //
      }, 1500)
    },
    ...mapActions('usergroup', ['initTable', 'initTree', 'updataPermissionIdlist', 'getRolepermission', 'changechecked']),
  },
  mounted: function () {
    function deep(node) {
      let stack = node,
        data = []
      while (stack.length != 0) {
        let pop = stack.pop()
        data.push(pop)
        let children = pop.childList
        if (children.length !== 0) {
          for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i])
          }
        }
      }
      return data
    }
    this.initFunction = () => {
      this.pageNum = 1
      let message = {
        groupName: this.groupName,
        pageNo: this.pageNum,
        // orgCode: this.orgValue
      }
      this.initTable(message)
      org_list_get().then(res => {
        this.parentOptions = res.data
      })
    }
    this.initFunction()
  },
}
</script>

<style>
.everyPage {
  background-color: #fff !important;
  box-sizing: border-box;
  padding: 10px;
  padding-bottom: 30px;
  overflow-y: auto;
}
.userGroup .settingAuthority {
  display: flex;
  justify-content: space-between;
  height: 500px;
}
.userGroup .treeDivstyle {
  width: 280px;
  height: 90%;
  overflow: auto;
}
.userGroup .block {
  display: flex;
  flex-direction: row;
  margin-left: 20px;
}
.userGroup .el-pagination button {
  width: 60px;
  height: 32px;
  margin-top: 0;
}
.userGroup .pageEnd {
  margin-top: 33px;
}
.userGroup .el-checkbox-button__inner {
  border-width: 1px;
}
.userGroup .el-checkbox-button:first-child .el-checkbox-button__inner {
  border-width: 1px;
}
.userGroup .boxTitle {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}
.condition .condition-input {
  float: left;
}
</style>
