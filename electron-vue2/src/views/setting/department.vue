<template>
  <div class="everyPage department">
    <div class="condition" style="height: 65px !important">
      <div class="condition-input" style="padding-top: 12px; font-size: 14px; margin-left: 0; margin-top: -8px">
        部门名称
        <el-input
          style="width: 300px; margin-left: 15px"
          placeholder="请输入部门名称"
          v-model="departmentName"
          class="el-inputStyle"
        ></el-input>
      </div>
      <el-button type="dash" style="float: right; margin-top: 12px; margin-right: 30px" @click="searchTable">查询</el-button>
    </div>
    <div class="tableBox">
      <div class="buttonStyle">
        <el-button type="primary" @click="addVisible = true">新增</el-button>
        <el-button type="dash" @click="editShow">编辑</el-button>
        <el-button type="dash" @click="deleteDepartment">删除</el-button>
      </div>
      <div>
        <el-table :data="tableData" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="部门代码" prop="id"></el-table-column>
          <el-table-column label="部门名称" prop="departmentName"></el-table-column>
          <el-table-column label="状态" prop="statusText"></el-table-column>
          <el-table-column label="所属机构" prop="orgName"></el-table-column>
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
    <el-dialog title="部门信息新增" :visible.sync="addVisible" width="700px">
      <div>
        <el-form :model="addForm" :inline="true" :rules="rules" ref="addForm">
          <el-form-item label="所属机构" label-width="100px" prop="mechanismValue">
            <el-select v-model="addForm.mechanismValue" clearable placeholder="请选择" style="width: 200px">
              <el-option v-for="item in mechanismOptions" :key="item.partyCode" :label="item.partyName" :value="item.partyCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" label-width="100px">
            <el-select v-model="addForm.statusValue" placeholder="请选择" style="width: 200px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="部门代码" label-width="100px">-->
          <!--<el-input placeholder="请填写部门代码" v-model="addForm.partyCode" style="width: 200px"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="部门名称" label-width="100px" prop="partyName">
            <el-input placeholder="请填写部门名称" v-model="addForm.partyName" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="100px">
            <el-input
              placeholder="请填写备注信息"
              v-model="addForm.remark"
              style="width: 510px"
              type="textarea"
              :rows="3"
              resize="none"
            ></el-input>
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
        <el-button class="sure-button" @click="addFormtable('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="部门信息编辑" :visible.sync="editVisible" width="700px">
      <div>
        <el-form :model="editForm" :inline="true" :rules="rules" ref="editForm">
          <el-form-item label="所属机构" label-width="100px" prop="mechanismValue">
            <el-select v-model="editForm.mechanismValue" clearable placeholder="请选择" style="width: 200px">
              <el-option v-for="item in mechanismOptions" :key="item.partyCode" :label="item.partyName" :value="item.partyCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" label-width="100px">
            <el-select v-model="editForm.statusValue" placeholder="请选择" style="width: 200px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门名称" label-width="100px" prop="partyName">
            <el-input placeholder="请填写部门名称" v-model="editForm.partyName" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="100px">
            <el-input
              placeholder="请填写备注信息"
              v-model="editForm.remark"
              style="width: 510px"
              type="textarea"
              :rows="3"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" class="cancel-button">取 消</el-button>
        <el-button class="sure-button" @click="editFormtable('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import mechanismCom from '@/components/mechanismCom'
import { org_department_delete, org_department_add, org_department_update, org_list_get } from '@/service/modules/setting.js'
export default {
  name: 'department',
  components: { mechanismCom },
  data() {
    return {
      // orgValue: '',
      orgOptions: [],
      departmentName: '',
      addVisible: false,
      editVisible: false,
      mechanismOptions: [],
      statusOptions: [
        {
          label: '启用',
          value: 'normal',
        },
        {
          label: '禁用',
          value: 'lock',
        },
      ],
      addForm: {
        mechanismValue: '',
        statusValue: 'normal',
        partyCode: '',
        partyName: '',
        remark: '',
      },
      editForm: {
        mechanismValue: '',
        statusValue: '0',
        partyCode: '',
        partyName: '',
        remark: '',
      },
      selectList: [],
      selectId: null,
      pageNum: 1,
      rules: {
        mechanismValue: [{ required: true, message: '请选择所属机构', trigger: 'blur' }],
        partyName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
      },
      initFunction: '',
    }
  },
  computed: {
    ...mapGetters('department', {
      tableData: 'renderTabledata',
      pageData: 'renderPageData',
    }),
  },
  methods: {
    childOne() {
      this.$refs.mychildTwo.childTwo()
    },
    changeOrgParent(data) {
      if (data === '/department') {
        this.initFunction()
      }
    },
    addClose() {
      this.addForm = {
        mechanismValue: '',
        statusValue: 'normal',
        partyCode: '',
        partyName: '',
        remark: '',
      }
    },
    currentChange(val) {
      this.pageNum = val
      let object = {
        departmentName: this.departmentName,
        pageNo: this.pageNum,
        // orgCode: this.orgValue
      }
      this.initTabledata(object)
    },
    searchTable() {
      this.pageNum = 1
      let object = {
        departmentName: this.departmentName,
        pageNo: this.pageNum,
        // orgCode: this.orgValue
      }
      this.initTabledata(object)
    },
    deleteDepartment() {
      if (this.selectList.length === 0) {
        this.$message.error('请至少选择一项数据进行删除')
        return false
      }
      this.$confirm('是否删除选中的部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          org_department_delete({ id: this.selectList[0].id }).then(res => {
            if (res.code === 'SUCCESS') {
              this.$message.success(res.msg)
              let object = {
                departmentName: this.departmentName,
                pageNo: this.pageNum,
                // orgCode: this.orgValue
              }
              this.initTabledata(object)
              this.editVisible = false
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
    ...mapActions('department', ['initTabledata']),
    handleSelectionChange(val) {
      this.selectList = val
    },
    editShow() {
      if (this.selectList.length === 0) {
        this.$message.error('请选择一项数据后进行编辑')
        return false
      }
      if (this.selectList.length > 1) {
        this.$message.error('仅支持单项数据进行编辑')
        return false
      }
      this.editVisible = true
      this.selectId = this.selectList[0].id
      this.editForm.mechanismValue = this.selectList[0].orgCode
      // this.editForm.partyCode = this.selectList[0].dictKey;
      this.editForm.statusValue = this.selectList[0].status
      this.editForm.partyName = this.selectList[0].departmentName
      this.editForm.remark = this.selectList[0].remark
    },
    addFormtable(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let statusText
          let oraName
          for (let item of this.statusOptions) {
            if (this.addForm.statusValue === item.value) {
              statusText = item.label
            }
          }
          for (let item of this.mechanismOptions) {
            if (this.addForm.mechanismValue === item.partyCode) {
              oraName = item.partyName
            }
          }
          let dictInfoDto = {
            orgName: oraName,
            orgCode: this.addForm.mechanismValue,
            departmentName: this.addForm.partyName,
            status: this.addForm.statusValue,
            statusText: statusText,
            remark: this.addForm.remark,
          }
          org_department_add(dictInfoDto).then(res => {
            if (res.code === 'SUCCESS') {
              this.$message.success(res.msg)
              let object = {
                departmentName: this.departmentName,
                pageNo: this.pageNum,
                // orgCode: this.orgValue
              }
              this.initTabledata(object)
              this.addVisible = false
              this.addClose()
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
    editFormtable(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let statusText
          let oraName
          for (let item of this.statusOptions) {
            if (this.editForm.statusValue === item.value) {
              statusText = item.label
            }
          }
          for (let item of this.mechanismOptions) {
            if (this.editForm.mechanismValue === item.partyCode) {
              oraName = item.partyName
            }
          }
          let dictInfoDto = {
            departmentName: this.editForm.partyName,
            orgCode: this.editForm.mechanismValue,
            oraName: oraName,
            remark: this.editForm.remark,
            statusText: statusText,
            status: this.editForm.statusValue,
            id: this.selectId,
          }
          org_department_update(dictInfoDto).then(res => {
            if (res.code === 'SUCCESS') {
              this.$message.success(res.msg)
              let object = {
                departmentName: this.departmentName,
                pageNo: this.pageNum,
                // orgCode: this.orgValue
              }
              this.initTabledata(object)
              this.editVisible = false
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
      let objectData = {
        departmentName: this.departmentName,
        pageNo: this.pageNum,
        // orgCode: this.orgValue
      }
      this.initTabledata(objectData)
      org_list_get().then(res => {
        this.mechanismOptions = res.data
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
.department .block {
  display: flex;
  flex-direction: row;
  margin-left: 20px;
}
.department .el-pagination button {
  width: 60px;
  height: 32px;
  margin-top: 0;
}
.department .pageEnd {
  margin-top: 33px;
}
.department .el-textarea__inner {
  border-width: 1px;
}
.condition .condition-input {
  float: left;
}
</style>
