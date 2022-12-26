<template>
  <div class="everyPage user">
    <div class="condition" style="height: 65px !important">
      <div class="condition-input" style="padding-top: 12px; font-size: 14px">
        <el-form :inline="true" style="position: relative; top: -3px">
          <el-form-item label="用户" style="margin-left: 0; margin-top: -6px">
            <el-input
              style="width: 300px; margin-left: 15px"
              class="el-inputStyle"
              v-model="userName"
              placeholder="请输入查询内容"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button style="float: right; margin-top: 12px; margin-right: 30px" @click="inittaleDatasearch">查询</el-button>
    </div>
    <div class="tableBox">
      <div class="buttonStyle" style="margin-bottom: 10px">
        <el-button type="primary" @click="addVisible = true">新增</el-button>
        <el-button type="dash" @click="edit">编辑</el-button>
        <el-button type="dash" @click="open2">删除</el-button>
      </div>
      <div>
        <el-table :data="userlist" @selection-change="selectChange" border>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="所属机构" prop="orgName"></el-table-column>
          <el-table-column label="所属部门" prop="departmentName"></el-table-column>
          <el-table-column label="登录名" prop="username"></el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="姓名" prop="fullname"></el-table-column>
          <el-table-column label="用户组" prop="roleName"></el-table-column>
          <el-table-column label="状态" prop="statusText"></el-table-column>
          <el-table-column label="账号有效开始日期" prop="gmtBegin"></el-table-column>
          <el-table-column label="账号有效结束日期" prop="gmtEnd"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
      </div>
      <div class="pageEnd">
        <div class="block">
          <span style="line-height: 37px">共{{ totalCount }}条记录第{{ pageNo }}/{{ totalPages }}页</span>
          <div style="display: inline-block; margin-top: 2px; margin-left: 12px">
            <el-button @click="currentChange(1)" class="cancel-button">首页</el-button>
          </div>
          <el-pagination
            prev-text="<"
            next-text=">"
            layout="prev,next"
            style="display: inline-block; float: none"
            :current-page="Number(pageNo)"
            :page-size="8"
            @current-change="currentChange"
            background
            :total="totalCount"
          ></el-pagination>
          <div style="display: inline-block; margin-top: 2px">
            <el-button @click="currentChange(totalPages)" class="cancel-button">尾页</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="用户信息新增" v-if="addVisible" :visible.sync="addVisible" width="800px">
      <div>
        <el-form :rules="rules" ref="addForm" :model="addForm" :inline="true">
          <el-form-item label="所属机构" label-width="120px" prop="mechanismValue">
            <el-select
              v-model="addForm.mechanismValue"
              clearable
              @change="selectGetdata2"
              placeholder="请选择"
              style="width: 230px"
            >
              <el-option
                v-for="item in mechanismOptions"
                :key="item.id"
                :label="item.partyName"
                :value="item.partyCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="partyValue" label-width="120px">
            <el-select @change="selectGetdep" v-model="addForm.partyValue" clearable placeholder="请选择" style="width: 230px">
              <el-option v-for="item in dep" :key="item.id" :label="item.departmentName" :value="item.departmentName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item @change="selectGet" label="用户组" label-width="120px">
            <el-select
              @change="selectrole"
              v-model="addForm.usergroupvalue"
              multiple
              clearable
              placeholder="请选择"
              style="width: 590px"
            >
              <el-option v-for="item in role" :key="item.id" :label="item.roleName" :value="item.roleName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录名" prop="userName" label-width="120px">
            <el-input placeholder="请输入登录名" v-model="addForm.userName" style="width: 230px"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone" label-width="120px">
            <el-input placeholder="请输入手机号" v-model="addForm.phone" style="width: 230px"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" label-width="120px" prop="realName">
            <el-input placeholder="请输入用户姓名" v-model="addForm.realName" style="width: 230px"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="passWord" label-width="120px">
            <el-input placeholder="请输入密码" v-model="addForm.passWord" style="width: 230px"></el-input>
          </el-form-item>
          <el-form-item label="账号状态" label-width="120px">
            <el-select v-model="addForm.status" @change="selectstatus" placeholder="请选择" style="width: 230px">
              <el-option v-for="item in thestatus" :key="item.dictKey" :label="item.dictKey" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" label-width="120px">
            <el-select v-model="addForm.sex" @change="selectsex" placeholder="请选择" style="width: 230px">
              <el-option v-for="item in thesex" :key="item.dictKey" :label="item.dictKey" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号有效日期" label-width="120px">
            <el-date-picker
              style="width: 590px"
              @change="changeAdd"
              value-format="yyyy-MM-dd"
              v-model="addForm.timeValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" label-width="120px">
            <el-input v-model="addForm.remark" type="textarea" :rows="3" resize="none" style="width: 590px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            addVisible = false
            addClose()
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submit('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户信息编辑" :visible.sync="editVisible" width="800px">
      <div>
        <el-form :rules="rules2" ref="editForm" :model="changedatas" :inline="true">
          <el-form-item label="所属机构" label-width="120px" prop="orgName">
            <el-select v-model="changedatas.orgName" clearable @change="selectGetdata" placeholder="请选择" style="width: 230px">
              <el-option v-for="item in mechanismOptions" :key="item.id" :label="item.partyName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" label-width="120px" prop="departmentName">
            <el-select
              @change="selectGetdep"
              v-model="changedatas.departmentName"
              clearable
              placeholder="请选择"
              style="width: 230px"
            >
              <el-option v-for="item in dep" :key="item.id" :label="item.departmentName" :value="item.departmentName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户组" label-width="120px">
            <el-select v-model="rolenames" @change="selectrole" multiple clearable placeholder="请选择" style="width: 590px">
              <el-option v-for="item in role" :key="item.id" :label="item.roleName" :value="item.roleName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录名" label-width="120px" prop="username">
            <el-input placeholder="请输入登录名" v-model="changedatas.username" style="width: 230px"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="120px" prop="mobile">
            <el-input placeholder="请输入手机号" v-model="changedatas.mobile" style="width: 230px"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" label-width="120px" prop="fullname">
            <el-input placeholder="请输入用户姓名" v-model="changedatas.fullname" style="width: 230px"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" v-if="showimput1" label-width="120px">
            <el-input
              placeholder="请输入密码"
              @focus="
                showimput1 = false
                showimput2 = true
              "
              type="password"
              v-model="pwd2"
              style="width: 230px"
            ></el-input>
          </el-form-item>
          <el-form-item label="登录密码" v-if="showimput2" label-width="120px">
            <el-input placeholder="请输入密码" type="password" v-model="pwd" style="width: 230px"></el-input>
          </el-form-item>
          <el-form-item label="账号状态" label-width="120px">
            <el-select v-model="changedatas.statusText" @change="selectstatus" placeholder="请选择" style="width: 230px">
              <el-option v-for="item in thestatus" :key="item.dictKey" :label="item.dictKey" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" label-width="120px">
            <el-select v-model="changedatas.sexText" @change="selectsex" placeholder="请选择" style="width: 230px">
              <el-option v-for="item in thesex" :key="item.dictKey" :label="item.dictKey" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号有效日期" label-width="120px">
            <el-date-picker
              style="width: 590px"
              @change="changeEdit"
              v-model="eidtdatex"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" label-width="120px">
            <el-input v-model="changedatas.remark" type="textarea" :rows="3" resize="none" style="width: 590px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import mechanismCom from '@/components/mechanismCom'
import {
  org_list_get,
  role_list_get,
  user_add,
  basedictInfo_list_get,
  user_update,
  user_delete,
  org_user_pageList_get,
  orgdepartment_list_get,
  org_treeOrgByLogin_get
} from '@/service/modules/setting.js'
export default {
  name: 'userManagement',
  components: { mechanismCom },
  data() {
    return {
      orgOptions: [],
      userName: '',
      orgCode: '',
      addVisible: false,
      editVisible: false,
      showimput1: true,
      showimput2: false,
      centerDialogVisible: false,
      mechanismOptions: [
        {
          id: '',
          partyName: '',
          partyCode: '',
        },
      ],
      rules: {
        userName: [{ required: true, message: '请输入登录名', trigger: 'change' }],
        mechanismValue: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
        partyValue: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
        usergroupvalue: [{ required: true, message: '请选择用户组', trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        passWord: [{ required: true, message: '请输入密码', trigger: 'change' }],
        realName: [{ required: true, message: '请输入用户姓名', trigger: 'change' }],
      },
      rules2: {
        username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        orgName: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
        departmentName: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
        usergroupvalue: [{ required: true, message: '请选择用户组', trigger: 'change' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        passWord: [{ required: true, message: '请输入密码', trigger: 'change' }],
        fullname: [{ required: true, message: '请填写姓名', trigger: 'change' }],
      },
      pwd2: 'mima1',
      addForm: {
        mechanismValue: '',
        partyValue: '',
        usergroupvalue: '',
        userName: '',
        phone: '',
        realName: '',
        passWord: '',
        status: '正常',
        sex: '男',
        timeValue: [],
        remark: '',
      },
      editForm: {
        mechanismValue: '',
        partyValue: '',
        usergroupvalue: '',
        userName: '',
        phone: '',
        realName: '',
        passWord: '',
        status: 'normal',
        sex: 'male',
        timeValue: [],
        remark: '',
      },
      permissionId: null,
      dep: [],
      departmentId: '',
      role: [],
      roleids: [],
      thestatus: [],
      dictKey: '',
      thesex: [],
      sextext: '',
      statustext: '',
      pwd: '',
      pageNo: 1,
      changedataList: [],
      changedata: {},
      rIds: [],
      changedatas: {
        departmentId: '',
        fullname: '',
        mobile: '',
        password: '',
        roleDtos: [],
        departmentName: '',
        roleName: '',
        orgCode: '',
        orgName: '',
        partyCode: '',
        remark: '',
        sexText: '男',
        sex: '',
        statusText: '正常',
        status: '',
        tel: '',
        username: '',
        gmtBegin: '',
        gmtEnd: '',
      },
      eidtdatex: [],
      userlist: [],
      statusx: '',
      ys: [],
      rolenames: [],
      totalCount: 1,
      totalPages: 1,
      mid: [],
      initFunction: '',
    }
  },
  computed: {
    ...mapGetters('userManagement', {
      //用mapGetters来获取collection.js里面的getters
      // tableData: 'renderTabledata',
      // usergroupOptions: 'remderUsergroupOptions',
      // treeData: 'rendertreeData',
      // selectLists: 'renderPermissionIdlist',
      // partOptions: 'renderPartyData',
    }),
  },
  methods: {
    childOne() {
      this.$refs.mychildTwo.childTwo()
    },
    addClose() {
      this.addForm = {
        mechanismValue: '',
        partyValue: '',
        usergroupvalue: '',
        userName: '',
        phone: '',
        realName: '',
        passWord: '',
        status: '正常',
        sex: '男',
        timeValue: [],
        remark: '',
      }
    },
    changeEdit() {
      if (this.eidtdatex === null || this.eidtdatex === undefined) {
        this.eidtdatex = []
      }
    },
    changeAdd() {
      if (this.addForm.timeValue === null || this.addForm.timeValue === undefined) {
        this.addForm.timeValue = []
      }
    },
    selectGet(vId) {
      this.departmentId = ''
      this.departmentName = ''
      let obj = {}
      obj = this.dep.find(item => {
        return (item.departmentName = vId)
      })
      for (let item of this.dep) {
        if (item.id == obj.id) {
          this.departmentId = item.id
          this.changedatas.departmentId = this.departmentId
        }
      }
    },
    selectsex(vId) {
      this.sextext = ''
      let obj = {}
      obj = this.dep.find(item => {
        return (item.dictValue = vId)
      })
      for (let item of this.thesex) {
        if (item.dictValue == obj.dictValue) {
          this.sextext = item.dictKey
        }
      }
    },
    selectstatus(id) {
      let obj = {}
      obj = this.dep.find(item => {
        return (item.dictValue = id)
      })
      for (let item of this.thestatus) {
        if (item.dictValue == id) {
          this.statusx = item.dictKey
        }
      }
    },
    selectGetdata2(vId) {
      this.dep = []
      this.addForm.partyValue = ''
      this.addForm.usergroupvalue = ''
      orgdepartment_list_get(vId).then(res => {
        this.dep = res.data
      })
      this.role = []
      role_list_get({ orgCode: vId }).then(res => {
        this.role = res.data
      })
    },
    selectGetdep(vId) {
      for (let item of this.dep) {
        if (vId == item.departmentName) {
          this.departmentId = item.id
        }
      }
    },
    selectGetdata(vId) {
      this.dep = []
      this.changedatas.departmentName = ''
      this.rolenames = []

      for (let item of this.mechanismOptions) {
        if (vId == item.id) {
          this.orgCode = item.partyCode
          orgdepartment_list_get(this.orgCode).then(res => {
            this.dep = res.data
          })
          role_list_get({ orgCode: this.orgCode }).then(res => {
            this.role = res.data
          })
        }
      }
    },
    selectrole(vId) {
      this.rIds = []
      this.roleids = []
      this.mid = vId
      for (let i = 0; i <= this.mid.length - 1; i++) {
        for (let item of this.role) {
          if (this.mid[i] == item.roleName) {
            this.roleids.push(item.id)
          }
        }
      }
      this.ys = []
      for (let i = 0; i <= this.roleids.length - 1; i++) {
        let obj = {
          id: this.roleids[i],
        }
        this.ys.push(obj)
      }
    },
    getstatus() {
      basedictInfo_list_get({ dictIndexValue: 'status' }).then(res => {
        this.thestatus = res.data
      })
    },
    getsex() {
      basedictInfo_list_get({ dictIndexValue: 'sex' }).then(res => {
        this.thesex = res.data
      })
    },
    ...mapActions('userManagement', ['initUsergroupOptions', 'initTree', 'getRolepermission', 'getPartyData']),
    inittaleDatasearch() {
      this.userlist = []
      org_user_pageList_get({
        pageSize: '8',
        pageNo: '1',
        userName: this.userName,
      }).then(res => {
        this.userlist = res.data
        this.pageNo = Number(res.pageNum)
        this.totalPages = Number(res.totalPages)
        this.totalCount = Number(res.totalCount)
      })
    },
    settingAuthority() {
      if (this.changedataList.length !== 1) {
        this.$message.error('请选择一项进行操作')
        return false
      }
      this.permissionId = this.changedataList[0].partyCode
      this.getRolepermission(this.changedataList[0].partyCode)
      this.centerDialogVisible = true
      this.initTree()
    },
    selectChange(value) {
      this.changedataList = []
      for (let item of value) {
        this.changedataList.push(item)
      }
    },
    open2() {
      if (this.changedataList.length == 0) {
        this.$message.error('请至少选择一项数据进行删除')
      } else {
        this.$confirm('此操作将会把该数据状态设置为删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            for (let pcode of this.changedataList) {
              user_delete({ partyCode: pcode.partyCode }).then(res => {
                if (res.msg === '操作成功') {
                  this.$message.success(res.msg)
                  org_user_pageList_get({
                    pageSize: '8',
                    pageNo: this.pageNo,
                    userName: this.userName,
                  }).then(res => {
                    this.userlist = res.data
                  })
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          })
          .catch(() => {})
      }
    },
    getchangedatas() {
      for (let i = 0; i <= this.roleids.length - 1; i++) {
        let obj = {
          id: this.roleids[i],
        }
        this.changedatas.roleDtos.push(obj)
      }
    },
    edit() {
      this.rolenames = []
      if (this.changedataList.length == 0) {
        this.$message.error('请选择要修改的数据项')
        this.editVisible = false
      } else if (this.changedataList.length == 1) {
        this.editVisible = true
        this.changedatas.roleDtos = []
        for (let item of this.changedataList) {
          this.changedatas.departmentName = item.departmentName
          this.changedatas.orgName = item.orgName
          let rolenameList = item.roleName.split(',')
          this.rolenames = rolenameList
          let roleids = item.roleId.split(',')

          this.changedatas.roleDtos = roleids
          this.changedatas.fullname = item.fullname
          this.changedatas.mobile = item.mobile
          this.changedatas.password = item.password
          this.changedatas.orgCode = item.orgCode
          this.changedatas.remark = item.remark
          this.changedatas.sexText = item.sexText
          this.changedatas.status = item.status
          this.changedatas.statusText = item.statusText
          this.changedatas.manufacturer = item.manufacturer
          this.changedatas.tel = item.tel
          this.changedatas.username = item.username
          this.changedatas.gmtBegin = item.gmtBegin
          this.changedatas.gmtEnd = item.gmtEnd
          this.eidtdatex = []
          this.changedatas.partyCode = item.partyCode
          this.eidtdatex.push(this.changedatas.gmtBegin)
          this.eidtdatex.push(this.changedatas.gmtEnd)
          this.ys = []
          for (let item = 0; item <= this.changedatas.roleDtos.length - 1; item++) {
            let obj = {
              id: this.changedatas.roleDtos[item],
            }
            this.ys.push(obj)
          }
          orgdepartment_list_get(this.changedatas.orgCode).then(res => {
            this.dep = res.data
          })
          role_list_get({ orgCode: this.changedatas.orgCode }).then(res => {
            this.role = res.data
          })
          if (this.changedatas.gmtEnd == null && this.changedatas.gmtBegin == null) {
            this.eidtdatex = []
          }
        }
      } else if (this.changedataList.length > 1) {
        this.$message.error('编辑仅支持单项数据编辑')
        this.editVisible = false
      }
    },
    uploadedit() {
      let gmtBegin
      let gmtEnd
      if (this.eidtdatex === null || this.eidtdatex === undefined || this.eidtdatex.length === 0) {
        gmtBegin = ''
        gmtEnd = ''
      } else {
        gmtBegin = this.eidtdatex[0]
        gmtEnd = this.eidtdatex[1]
      }
      for (let item of this.dep) {
        if (item.departmentName === this.changedatas.departmentName) {
          this.changedatas.departmentId = item.id
        }
      }
      let partyName
      for (let item of this.mechanismOptions) {
        if (this.editForm.mechanismValue === item.partyCode) {
          partyName = item.partyName
        }
      }
      let object = {
        departmentId: this.changedatas.departmentId,
        fullname: this.changedatas.fullname,
        mobile: this.changedatas.mobile,
        password: this.pwd,
        roleDtos: this.ys,
        orgCode: this.editForm.mechanismValue,
        orgName: partyName,
        partyCode: this.changedatas.partyCode,
        remark: this.changedatas.remark,
        sexText: this.changedatas.sexText,
        sex: this.changedatas.sex,
        status: this.changedatas.status,
        statusText: this.changedatas.statusText,
        tel: this.changedatas.mobile,
        username: this.changedatas.username,
        gmtBegin: gmtBegin,
        gmtEnd: gmtEnd,
      }
      if (object.statusText == '正常') {
        object.status = 'normal'
      } else if (object.statusText == '禁用') {
        object.status = 'disable'
      } else if (object.statusText == '删除') {
        object.status = 'delete'
      }
      if (object.sexText == '男') {
        object.sex = 'male'
      } else if (object.sexText == '女') {
        object.sex = 'female'
      }
      user_update(object).then(res => {
        if (res.msg == '操作成功') {
          this.editVisible = false
          this.$message.success(res.msg)
          this.userlist = []
          org_user_pageList_get({
            pageSize: '8',
            pageNo: '1',
            userName: this.userName,
          }).then(res => {
            this.userlist = res.data
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 验证表单
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (form == 'editForm') {
            this.uploadedit()
          } else {
            this.add()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add() {
      let gmtBegin
      let gmtEnd
      if (this.addForm.timeValue === null || this.addForm.timeValue === undefined || this.addForm.timeValue.length === 0) {
        gmtBegin = ''
        gmtEnd = ''
      } else {
        gmtBegin = this.addForm.timeValue[0]
        gmtEnd = this.addForm.timeValue[1]
      }
      let partyName
      for (let item of this.mechanismOptions) {
        if (this.addForm.mechanismValue === item.partyCode) {
          partyName = item.partyName
        }
      }
      let object = {
        departmentId: this.departmentId,
        fullname: this.addForm.realName,
        mobile: this.addForm.phone,
        password: this.addForm.passWord,
        roleDtos: this.ys,

        orgCode: this.addForm.mechanismValue,
        orgName: partyName,
        partyCode: this.addForm.partyValue,
        remark: this.addForm.remark,
        sexText: this.addForm.sex,
        sex: this.sextext,
        statusText: this.addForm.status,
        status: this.statustext,
        tel: this.addForm.phone,
        username: this.addForm.userName,
        gmtBegin: gmtBegin,
        gmtEnd: gmtEnd,
      }
      if (object.statusText == '正常') {
        object.status = 'normal'
      } else if (object.statusText == '禁用') {
        object.status = 'disable'
      } else if (object.statusText == '删除') {
        object.status = 'delete'
      }
      if (object.sexText == '男') {
        object.sex = 'male'
      } else if (object.sexText == '女') {
        object.sex = 'female'
      }
      user_add(object).then(res => {
        if (res.msg === '操作成功') {
          this.addVisible = false
          this.addClose()
          this.$message.success(res.msg)

          org_user_pageList_get({
            pageSize: '8',
            pageNo: this.pageNo,
            userName: this.userName,
          }).then(res => {
            this.pageNo = res.pageNum
            this.totalPages = Number(res.totalPages)
            this.totalCount = Number(res.totalCount)
            this.userlist = res.data
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getuserlist() {
      org_user_pageList_get({
        pageSize: '8',
        pageNo: this.pageNo,
        userName: this.userName,
      }).then(res => {
        this.pageNo = Number(res.pageNum)
        this.totalPages = Number(res.totalPages)
        this.totalCount = Number(res.totalCount)
        this.userlist = res.data
      })
    },
    currentChange(val) {
      this.pageNo = val
      org_user_pageList_get({
        pageSize: '8',
        pageNo: this.pageNo,
        userName: this.userName,
      }).then(res => {
        this.pageNo = Number(res.pageNum)
        this.totalPages = Number(res.totalPages)
        this.totalCount = Number(res.totalCount)
        this.userlist = res.data
      })
    },
  },
  mounted: function () {
    this.initFunction = () => {
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
      org_treeOrgByLogin_get().then(res => {
        let object = {
          partyName: '全部',
          partyCode: '',
        }
        this.orgOptions = deep(res.data.orgList)
        if (this.orgOptions.length > 1) {
          this.orgOptions.push(object)
        } else {
          this.orgValue = this.orgOptions[0].partyCode
        }
      })
      this.getPartyData()
      this.getstatus()
      this.getchangedatas()
      this.getsex()
      org_list_get().then(res => {
        this.mechanismOptions = res.data
      })
      this.getuserlist()
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
.user .btn {
  border: 1px solid rgba(0, 3, 3, 0.2);
  width: 620px;
  height: 362px;
  border-radius: 4px;
}
.user .borderx {
  width: 80px;
  height: 32px;
  border-radius: 6px;
  margin-left: 30px;
  margin-top: 15px;
  /* border: 1px solid #076A68 !important;   */
  color: black !important;
}
.user .el-checkbox-button__inner {
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  background: #fff;
  /* border: 1px solid #076A68; */
  border-left: 0;
  color: #076a68;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 0;
}
.user .el-checkbox-button__inner {
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  width: 80px !important;
  height: 32px !important;
  background: #fff;
  line-height: 32px !important;
  text-align: center !important;
  /* margin-left: 10px !important; */
  /* border: 1px solid #076A68; */
  border-left: 0;
  color: #dcdfe6;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  border: 1px solid;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  /* padding: 12px 20px; */
  padding: 0 !important;
  font-size: 14px;
  border-radius: 4px;
}
.user .el-checkbox-button:last-child .el-checkbox-button__inner {
  border-radius: 4px;
}
.user .el-checkbox-button:first-child .el-checkbox-button__inner {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  /* -webkit-box-shadow: none!important; */
  /* box-shadow: none!important; */
}
.user .el-checkbox-button.is-checked .el-checkbox-button__inner {
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  width: 80px !important;
  height: 32px !important;
  background: #fff;
  line-height: 32px !important;
  text-align: center !important;
  /* margin-left: 10px !important; */
  /* border: 1px solid #076A68; */
  border-left: 0;
  color: #076a68;

  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #076a68;
  outline: 0;
  margin: 0;
  border: 1px solid;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  /* padding: 12px 20px; */
  padding: 0 !important;
  font-size: 14px;
  border-radius: 4px;
}
.user .block {
  display: block;
  flex-direction: row;
  margin-left: 20px;
  margin-top: 35px;
}
.user .el-pagination button {
  width: 60px !important;
  height: 32px !important;
  margin-top: -8px !important;
}
.user .faiedStatus {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ff7e4e;
  display: inline-block;
}
.user .successStatus {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #38e79c;
  display: inline-block;
}
.user .settingAuthority {
  display: flex;
  justify-content: space-between;
  height: 500px;
}
.user .treeDivstyle {
  width: 200px;
  height: 90%;
  overflow: auto;
}
.user .el-textarea__inner {
  border-width: 1px;
}
.condition .condition-input {
  float: left;
}
</style>
