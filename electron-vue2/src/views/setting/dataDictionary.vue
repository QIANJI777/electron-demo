<template>
  <div class="everyPage dataDictionary">
    <div class="dictionaryBox">
      <div class="dictionaryChildleft">
        <el-form :inline="true" style="width: 100%; height: 120px; border-bottom: 1px solid #ccc; padding-top: 20px">
          <el-form-item label="参数分类" label-width="85px">
            <el-select v-model="typeValue" class="el-inputStyle" style="width: 10vw">
              <el-option v-for="item in typeOpyion" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型名称" label-width="85px">
            <el-input v-model="dictIndexValue" placeholder="请输入查询内容" class="el-inputStyle" style="width: 10vw"></el-input>
            <el-button icon="el-icon-search" class="search" type="primary" @click="searchTable">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button class="add" type="primary" @click="addIndexshow = true">新增</el-button>
        <el-button class="edit" type="dash" @click="editIndex">编辑</el-button>
        <a class="editx" @click="editIndex">编辑</a>
        <el-table
          :data="indexInfo"
          highlight-current-row
          class="table"
          @selection-change="indexInfochange"
          @current-change="handleCurrentChange"
          border
          :header-cell-style="{ 'background-color': '#fafafa' }"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="参数分类" prop="categoryName">
            <div slot-scope="scope">
              <div v-if="scope.row.dictType === 0">system</div>
              <div v-if="scope.row.dictType === 1">business</div>
            </div>
          </el-table-column>
          <el-table-column label="类型代码" prop="dictIndexValue"></el-table-column>
          <el-table-column label="类型名称" prop="dictIndexName"></el-table-column>
        </el-table>
      </div>
      <div class="dictionaryChildright">
        <div class="dictionaryChildrightHead">
          <el-button icon="el-icon-plus" type="primary" @click="addFroms">新增</el-button>
          <el-button icon="el-icon-edit" @click="editShow">编辑</el-button>
        </div>
        <el-table @selection-change="indexDatachange" :data="indexData" border>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="字典代码" prop="dictKey"></el-table-column>
          <el-table-column label="字典值" prop="dictValue"></el-table-column>
          <el-table-column label="排序"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.dictState === 0">启用</div>
              <div v-if="scope.row.dictState === 1">禁用</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="字典明细新增" :destroy-on-close="true" :visible.sync="centerDialogVisible" width="500px" @close="addClose">
      <div>
        <el-form :inline="true" :model="addFrom" :rules="detailedForm" ref="addDetailedForm">
          <el-form-item label="类型代码" label-width="120px">
            <el-input style="width: 300px" v-model="addFrom.typeCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="字典代码" label-width="120px" prop="dictionaryCode">
            <el-input style="width: 300px" v-model="addFrom.dictionaryCode"></el-input>
          </el-form-item>
          <el-form-item label="字典值" label-width="120px" prop="dictionaryValue">
            <el-input style="width: 300px" v-model="addFrom.dictionaryValue"></el-input>
          </el-form-item>
          <el-form-item label="排序" label-width="120px">
            <el-input style="width: 300px" v-model="addFrom.sort"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="120px">
            <el-select v-model="addFrom.status" placeholder="请选择" style="width: 300px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFromdata(addFrom, 'addDetailedForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="字典明细修改" :visible.sync="editsVisible" width="500px">
      <div>
        <el-form :inline="true" :model="editFrom" :rules="detailedForm" ref="editDetailedForm">
          <el-form-item label="类型代码" label-width="120px">
            <el-input style="width: 300px" v-model="editFrom.typeCode"></el-input>
          </el-form-item>
          <el-form-item label="字典代码" label-width="120px" prop="dictionaryCode">
            <el-input style="width: 300px" v-model="editFrom.dictionaryCode"></el-input>
          </el-form-item>
          <el-form-item label="字典值" label-width="120px" prop="dictionaryValue">
            <el-input style="width: 300px" v-model="editFrom.dictionaryValue"></el-input>
          </el-form-item>
          <el-form-item label="排序" label-width="120px">
            <el-input style="width: 300px" v-model="editFrom.sort"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="120px">
            <el-select v-model="editFrom.status" placeholder="请选择" style="width: 300px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editsVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit('editDetailedForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog @close="closeaddIndexshow" title="新增字典索引" :visible.sync="addIndexshow" width="500px">
      <div>
        <el-form :inline="true" :model="indexFrom" :rules="formRules" ref="addForm">
          <el-form-item label="参数分类" label-width="120px" prop="typeValue">
            <el-select v-model="indexFrom.typeValue" style="width: 300px">
              <el-option v-for="item in addTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字典索引名称" label-width="120px" prop="name">
            <el-input style="width: 300px" v-model="indexFrom.name"></el-input>
          </el-form-item>
          <el-form-item label="字典索引值" label-width="120px" prop="value">
            <el-input style="width: 300px" v-model="indexFrom.value"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addIndexshow = false">取 消</el-button>
        <el-button type="primary" @click="addIndexfrom(indexFrom, 'addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑字典索引" :visible.sync="editIndexshow" width="500px">
      <div>
        <el-form :inline="true" :model="eidtIndexFrom" :rules="formRules" ref="editForm">
          <el-form-item label="参数分类" label-width="120px" prop="typeValue">
            <el-select v-model="eidtIndexFrom.typeValue" style="width: 300px">
              <el-option v-for="item in addTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字典索引名称" label-width="120px" prop="name">
            <el-input style="width: 300px" v-model="eidtIndexFrom.name"></el-input>
          </el-form-item>
          <el-form-item label="字典索引值" label-width="120px" prop="value">
            <el-input style="width: 300px" v-model="eidtIndexFrom.value"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editIndexshow = false">取 消</el-button>
        <el-button type="primary" @click="editIndexfrom('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  base_dictIndex_update,
  base_dictInfo_update,
  base_dictIndex_save,
  base_dictInfo_save,
} from '@/service/modules/setting.js'
export default {
  name: 'dataDictionary',
  data() {
    return {
      typeValue: '',
      addTypeOptions: [
        {
          label: 'business(业务参数)',
          value: 1,
        },
        {
          label: 'system(系统参数)',
          value: 0,
        },
      ],
      typeOpyion: [
        {
          label: '全部',
          value: '',
        },
        {
          label: 'business(业务参数)',
          value: 1,
        },
        {
          label: 'system(系统参数)',
          value: 0,
        },
      ],
      centerDialogVisible: false,
      editsVisible: false,
      addIndexshow: false,
      editIndexshow: false,
      options: [
        {
          label: '启用',
          value: 0,
        },
        {
          label: '禁用',
          value: 1,
        },
      ],
      addFrom: {
        typeCode: '',
        dictionaryCode: '',
        dictionaryValue: '',
        sort: '',
        status: 0,
      },
      editFrom: {
        typeCode: '',
        dictionaryCode: '',
        dictionaryValue: '',
        sort: '',
        status: 0,
      },
      indexFrom: {
        typeValue: '',
        name: '',
        value: '',
      },
      eidtIndexFrom: {
        typeValue: '',
        name: '',
        value: '',
      },
      selectArrys: [],
      selectIndexArrys: [],
      selectId: null,
      formRules: {
        typeValue: [{ required: true, message: '请选择参数分类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入字典索引名称', trigger: 'blur' }],
        value: [{ required: true, message: '请输入字典索引值', trigger: 'blur' }],
      },
      detailedForm: {
        dictionaryCode: [{ required: true, message: '请输入字典代码', trigger: 'blur' }],
        dictionaryValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters('dataDictionary', {
      indexData: 'renderDataIndex',
      indexInfo: 'renderDataInfo',
    }),
    dictIndexValue: {
      get() {
        return this.$store.state.dataDictionary.dictIndexValue
      },
      set(value) {
        this.$store.dispatch('dataDictionary/updatadictIndexValue', { value })
      },
    },
  },
  methods: {
    addClose() {
      this.addFrom = {
        dictionaryCode: '',
        dictionaryValue: '',
        sort: '',
        status: 0,
      }
    },
    editIndexfrom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let object = {
            dictIndexName: this.eidtIndexFrom.name,
            dictIndexValue: this.eidtIndexFrom.value,
            dictType: this.eidtIndexFrom.typeValue,
            id: this.selectIndexArrys[0].id,
          }
          base_dictIndex_update(object).then(res => {
            if (res.msg === '操作成功') {
              this.$message.success(res.msg)
              let message = {
                dictIndexName: this.dictIndexValue,
                dictType: this.typeValue,
              }
              this.initDataIndex(message)
              this.editIndexshow = false
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
    searchTable() {
      let message = {
        dictIndexName: this.dictIndexValue,
        dictType: this.typeValue,
      }
      this.initDataIndex(message)
    },
    indexInfochange(val) {
      this.selectIndexArrys = val
    },
    editIndex() {
      if (this.selectIndexArrys.length !== 1) {
        this.$message.error('请选择一项进行编辑')
        return false
      }
      this.editIndexshow = true
      this.eidtIndexFrom.name = this.selectIndexArrys[0].dictIndexName
      this.eidtIndexFrom.value = this.selectIndexArrys[0].dictIndexValue
      this.eidtIndexFrom.typeValue = this.selectIndexArrys[0].dictType
    },
    sureEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this
          let dictInfoDto = {
            dictIndexValue: this.editFrom.typeCode,
            dictKey: this.editFrom.dictionaryCode,
            dictState: this.editFrom.status,
            dictValue: this.editFrom.dictionaryValue,
            id: this.selectId,
          }
          base_dictInfo_update(dictInfoDto).then(res => {
            if (res.code === 'SUCCESS') {
              that.$message.success(res.msg)
              that.initDataInfo(that.addFrom.typeCode)
              that.editsVisible = false
            } else {
              that.$message.error(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editShow() {
      if (this.selectArrys.length !== 1) {
        this.$message.error('请选择需要编辑的一项')
        return false
      }
      this.selectId = this.selectArrys[0].id
      this.editsVisible = true
      this.editFrom.typeCode = this.selectArrys[0].dictIndexValue
      this.editFrom.dictionaryCode = this.selectArrys[0].dictKey
      this.editFrom.dictionaryValue = this.selectArrys[0].dictValue
      this.editFrom.status = this.selectArrys[0].dictState
    },
    indexDatachange(value) {
      this.selectArrys = value
    },
    addIndexfrom(message, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this
          let dictIndexDto = {
            dictIndexName: message.name,
            dictIndexValue: message.value,
            dictType: message.typeValue,
          }
          base_dictIndex_save(dictIndexDto).then(res => {
            if (res.msg === '操作成功') {
              that.$message.success(res.msg)
              let message = {
                dictIndexName: this.dictIndexValue,
                dictType: this.typeValue,
              }
              this.initDataIndex(message)
              // that.initDataIndex(that.addFrom.typeCode);
              that.addIndexshow = false
            } else {
              that.$message.error(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeaddIndexshow() {
      this.indexFrom.name = ''
      this.indexFrom.value = ''
    },
    addFromdata(message, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this
          let dictInfoDto = {
            dictKey: message.dictionaryCode,
            dictIndexValue: message.typeCode,
            dictValue: message.dictionaryValue,
            status: message.status,
          }
          base_dictInfo_save(dictInfoDto).then(res => {
            if (res.code === 'SUCCESS') {
              that.$message.success(res.msg)
              that.initDataInfo(this.addFrom.typeCode)
              that.centerDialogVisible = false
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
    addFroms() {
      if (this.addFrom.typeCode !== '') {
        this.centerDialogVisible = true
      } else {
        this.$message.error('请先选择一项字典类型代码')
      }
    },
    handleCurrentChange(val) {
      this.addFrom.typeCode = val.dictIndexValue
      this.initDataInfo(val.dictIndexValue)
    },
    ...mapActions('dataDictionary', ['initDataIndex', 'initDataInfo']),
  },
  mounted: function () {
    let message = {
      dictIndexName: this.dictIndexValue,
      dictType: this.typeValue,
    }
    this.initDataIndex(message)
    this.initDataInfo()
  },
}
</script>

<style>
/* .dataDictionary .el-button--primary {
  position: relative;
  left: 310px;
  top: -40px;
} */
/* .dataDictionary .el-button {
  background-color: rgb(40, 173, 191) !important;
  border-color: rgb(40, 173, 191) !important;
  color: #fff;
} */
.everyPage {
  background-color: rgba(255, 255, 255, 0) !important;
}
.dataDictionary .el-form-item__content {
  line-height: 40px;
  position: relative;
  font-size: 14px;
  height: 40px;
}
.dataDictionary .search {
  position: relative;
  left: 20px;
  top: 0;
}
.dataDictionary .add {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  margin-left: 17px !important;
}
.dataDictionary .edit {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  /* background: #fff !important; */
}
.dataDictionary .editx {
  width: 70px;
  height: 32px;
  background: rgba(0, 22, 23, 0);
  position: absolute;
  text-decoration: -1000px;
  text-indent: -1000px;
  /* left: 375px; */
  cursor: pointer;
  margin-top: 10px;
  margin-left: -71px;
}
.dataDictionary .table {
  overflow-y: scroll;
  height: 550px;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 4px;
  background-color: white;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 4px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: black;
}
.dataDictionary ::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: gainsboro;
}
.dictionaryBox {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}
.dictionaryChildleft {
  width: 30%;
  min-height: calc(100vh - 240px);
  background-color: #fff;
}
.dictionaryChildright {
  width: 60%;
  min-height: calc(100vh - 220px);
  padding-left: 15px;
  background-color: #fff;
}
.dictionaryChildrightHead {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
