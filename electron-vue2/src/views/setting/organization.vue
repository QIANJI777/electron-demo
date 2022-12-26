<template>
  <div class="everyPage organization">
    <div class="condition" style="height: 56px !important; margin-bottom: 15px">
      <div class="condition-input" style="padding-top: 12px; font-size: 14px">
        机构名称
        <el-input
          style="width: 300px; margin-left: 15px"
          placeholder="请输入机构名称"
          v-model="Code"
          class="el-inputStyle"
        ></el-input>
      </div>
      <el-button style="float: right; margin-top: 12px; margin-right: 30px" type="dash" @click="initTabledataSearch"
        >查询</el-button
      >
    </div>
    <div class="tableBox">
      <div class="buttonStyle">
        <el-button type="primary" @click="addVisible = true">新增</el-button>
        <el-button type="dash" plain @click="editShow">编辑</el-button>
        <el-button type="dash" plain @click="deleteVisible">删除</el-button>
      </div>
      <div>
        <el-table
          :data="tableData"
          :header-cell-style="{ backgroundColor: 'rgba(0,0,0,0.03)' }"
          @selection-change="handleSelectionChange"
          border
          ref="tableData"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="机构代码" prop="partyCode"></el-table-column>
          <el-table-column label="上级机构" prop="parentPartyName"></el-table-column>
          <el-table-column label="机构名称" prop="partyName"></el-table-column>
          <el-table-column label="机构地址" prop="address"></el-table-column>
          <el-table-column label="联系人" prop="contactUser"></el-table-column>
          <el-table-column label="联系方式" prop="contactTel"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 'normal'">启用</div>
              <div v-if="scope.row.status === 'lock'">禁用</div>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
      </div>
      <div class="pageEnd" style="margin-top: 20px">
        <div class="block page">
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
    <el-dialog title="机构信息新增" :visible.sync="addVisible" width="700px">
      <div>
        <el-form :inline="true" :model="addFrom" :rules="rules" ref="ruleForm">
          <!--<el-form-item label="机构代码" label-width="80px" prop="partCode">-->
          <!--<el-input v-model="addFrom.partCode" style="width: 210px"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="机构名称" label-width="85px" prop="partName">
            <el-input v-model="addFrom.partName" style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="85px" prop="statusValue">
            <el-select v-model="addFrom.statusValue" placeholder="请选择" style="width: 210px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构地址" label-width="85px" prop="address">
            <el-input v-model="addFrom.address" style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item label="联系人" label-width="85px" prop="contacts">
            <el-input v-model="addFrom.contacts" style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" label-width="85px" prop="phone">
            <el-input v-model="addFrom.phone" style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="85px" prop="remark">
            <el-input v-model="addFrom.remark" style="width: 210px" type="textarea" :rows="2" resize="none"></el-input>
          </el-form-item>
          <el-form-item label="上级机构" label-width="85px" prop="parentValue">
            <el-select v-model="addFrom.parentValue" placeholder="请选择" clearable style="width: 210px">
              <el-option v-for="item in parentOptions" :key="item.id" :label="item.partyName" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="进入地址" label-width="85px" prop="goUrl">
            <el-input v-model="addFrom.goUrl" style="width: 210px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            addVisible = false
            addCloseEvent()
          "
          class="cancel-button"
          >取 消</el-button
        >
        <el-button class="sure-button" @click="addTabledata('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="机构信息编辑" :visible.sync="editVisible" width="700px">
      <div>
        <el-form :inline="true" :model="editFrom" :rules="rules" ref="ruleForm2">
          <!--<el-form-item label="机构代码" label-width="80px" prop="partCode">-->
          <!--<el-input v-model="editFrom.partCode" style="width: 210px"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="机构名称" label-width="85px" prop="partName">
            <el-input v-model="editFrom.partName" style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="85px">
            <el-select v-model="editFrom.statusValue" placeholder="请选择" style="width: 210px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构地址" label-width="85px">
            <el-input v-model="editFrom.address" style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item label="联系人" label-width="85px">
            <el-input v-model="editFrom.contacts" style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" label-width="85px">
            <el-input v-model="editFrom.phone" style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="85px">
            <el-input v-model="editFrom.remark" style="width: 210px" type="textarea" :rows="2" resize="none"></el-input>
          </el-form-item>
          <el-form-item label="进入地址" label-width="85px" prop="goUrl">
            <el-input v-model="editFrom.goUrl" style="width: 210px"></el-input>
          </el-form-item>
          <!--<el-form-item label="上级机构" label-width="80px">-->
          <!--<el-select v-model="editFrom.parentValue" placeholder="请选择" clearable style="width: 210px">-->
          <!--<el-option-->
          <!--v-for="item in parentOptions"-->
          <!--:key="item.id"-->
          <!--:label="item.partyName"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" class="cancel-button">取 消</el-button>
        <el-button class="sure-button" @click="ebitSure('ruleForm2')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { org_add, org_list_get, org_delete, org_update } from '@/service/modules/setting.js'
export default {
  name: 'organization',
  data() {
    return {
      addVisible: false,
      editVisible: false,
      addFrom: {
        partCode: '1005',
        partName: '',
        statusValue: 'normal',
        address: '',
        contacts: '',
        phone: '',
        remark: '',
        parentValue: null,
        goUrl: '',
      },
      editFrom: {
        partCode: '',
        partName: '',
        statusValue: 'normal',
        address: '',
        contacts: '',
        phone: '',
        remark: '',
        parentValue: null,
        goUrl: '',
      },
      options: [
        {
          label: '启用',
          value: 'normal',
        },
        {
          label: '禁用',
          value: 'lock',
        },
      ],
      parentOptions: [],
      selectList: [],
      editId: null,
      rules: {
        partCode: [{ required: true, message: '请输入机构代码', trigger: 'blur' }],
        partName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        parentValue: [{ required: true, message: '请选择上级机构', trigger: 'blur' }],
      },
      // pageNum: 1,
    }
  },
  computed: {
    Code: {
      get() {
        return this.$store.state.organization.InstitutionalCode
      },
      set(value) {
        this.$store.dispatch('organization/updataInstitutionalCode', { value })
      },
    },
    ...mapGetters('organization', {
      tableData: 'renderTabledata',
      pageData: 'renderPageData',
      pageNum: 'renderPageNum',
    }),
  },
  methods: {
    ...mapActions('organization', ['initTabledata', 'editTabledata', 'initPageNum']),
    ...mapActions('home', ['getAllorg']),
    // 关闭时清除弹窗内容方法
    addCloseEvent() {
      this.addFrom = {
        partCode: '1005',
        partName: '',
        statusValue: 'normal',
        address: '',
        contacts: '',
        phone: '',
        remark: '',
        parentValue: null,
        goUrl: '',
      }
    },
    initTabledataSearch() {
      this.initPageNum(1)
      let message = {
        pageNum: this.pageNum,
      }
      this.initTabledata(message)
      this.$refs.tableData.clearSelection()
    },
    currentChange(val) {
      this.initPageNum(val)
      // this.pageNum = val;
      let message = {
        pageNum: this.pageNum,
      }
      this.initTabledata(message)
    },
    addTabledata(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.addFrom.parentValue === null) {
          //   this.$message.error('请选择上级机构');
          //   return false
          // }
          let statusText
          for (let item of this.options) {
            if (item.value === this.addFrom.statusValue) {
              statusText = item.label
            }
          }
          let that = this
          let object = {
            partyCode: this.addFrom.partCode,
            partyName: this.addFrom.partName,
            status: this.addFrom.statusValue,
            statusText: statusText,
            parentId: this.addFrom.parentValue,
            address: this.addFrom.address,
            contactTel: this.addFrom.phone,
            contactUser: this.addFrom.contacts,
            remark: this.addFrom.remark,
            loginRedirect: this.addFrom.goUrl,
          }
          org_add(object).then(res => {
            if (res.msg === '操作成功') {
              this.$message.success(res.msg)
              let value = ''
              that.$store.dispatch('organization/updataInstitutionalCode', { value })
              let message = {
                pageNum: this.pageNum,
              }
              that.initTabledata(message)
              that.addVisible = false
              this.addCloseEvent()
              that.$refs['ruleForm'].resetFields()
              org_list_get().then(res => {
                this.parentOptions = res.data
              })
              this.getAllorg()
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
    deleteVisible() {
      if (this.selectList.length === 0) {
        this.$message.error('请选择一项数据后进行编辑')
        return false
      }
      if (this.selectList.length > 1) {
        this.$message.error('仅支持单项数据进行编辑')
        return false
      }
      let id = this.selectList[0].id
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          org_delete({ id }).then(res => {
            if (res.code === 'SUCCESS') {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
            let message = {
              pageNum: this.pageNum,
            }
            this.$refs.tableData.clearSelection()
            this.initTabledata(message)
            this.getAllorg()
            // this.initTabledata();
            org_list_get().then(res => {
              this.parentOptions = res.data
            })
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        })
    },
    handleSelectionChange(val) {
      this.selectList = val
    },
    editShow() {
      if (this.selectList.length !== 1) {
        this.$message.error('请至少选择一项数据进行删除')
        return false
      }
      this.editVisible = true
      this.editFrom.statusValue = this.selectList[0].status
      this.editFrom.partCode = this.selectList[0].partyCode
      this.editFrom.partName = this.selectList[0].partyName
      this.editFrom.parentValue = this.selectList[0].parentId
      this.editId = this.selectList[0].id
      this.editFrom.address = this.selectList[0].address
      this.editFrom.contacts = this.selectList[0].contactUser
      this.editFrom.phone = this.selectList[0].contactTel
      this.editFrom.remark = this.selectList[0].remark
      this.editFrom.goUrl = this.selectList[0].loginRedirect
    },
    ebitSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.editFrom.parentValue === null) {
          //   this.$message.error('请选择上级机构');
          //   return false
          // }
          let that = this
          let object = {
            parentId: this.editFrom.parentValue,
            partyCode: this.editFrom.partCode,
            partyName: this.editFrom.partName,
            status: this.editFrom.statusValue,
            id: this.editId,
            address: this.editFrom.address,
            contactTel: this.editFrom.phone,
            contactUser: this.editFrom.contacts,
            remark: this.editFrom.remark,
            loginRedirect: this.editFrom.goUrl,
          }
          org_update(object).then(res => {
            if (res.code === 'SUCCESS') {
              this.$message.success(res.msg)
              let message = {
                pageNum: this.pageNum,
              }
              that.initTabledata(message)
              that.editVisible = false
              org_list_get().then(res => {
                this.parentOptions = res.data
              })
              this.getAllorg()
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
    let message = {
      pageNum: this.pageNum,
    }
    // console.log(1)
    this.initTabledata(message)
    // console.log(2)
    org_list_get().then(res => {
      this.parentOptions = res.data
    })
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
.organization .block {
  display: flex;
  flex-direction: row;
  /*margin-left: 20px;*/
  width: 100%;
  background-color: #fff;
}
.organization .el-pagination button {
  width: 60px;
  height: 32px;
  margin-top: 0;
}
.organization .pageEnd {
  margin-top: 33px;
}
.organization .el-textarea__inner {
  border-width: 1px;
}
.buttonStyle {
  margin-bottom: 10px;
}
</style>
