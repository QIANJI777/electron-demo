<template>
  <div class="jurisdiction everyPage">
    <div>
      <el-button type="primary" @click="centerDialogVisible = true" class="btnAddHeard sure-button">新增</el-button>
    </div>
    <div>
      <el-tree :props="props" :data="tableData" node-key="id" style="width: 90%; margin: 0 auto" :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="tree-inputbox">
            <div>
              <span style="display: inline-block">{{ data.name }}</span>
            </div>
          </span>
          <span class="tree-inputbox">
            <div>
              <span style="display: inline-block">{{ data.url }}</span>
            </div>
          </span>
          <span>
            <div @click="edit(data)" style="color: #28adbf; cursor: pointer">编辑</div>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog title="新增权限" :visible.sync="centerDialogVisible" width="400px" @close="addClose">
      <div>
        <el-form :inline="true" :model="form">
          <el-form-item label="上级菜单" label-width="80px">
            <el-select v-model="form.value" placeholder="请选择上级菜单" style="width: 250px" filterable clearable>
              <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限标题" label-width="80px">
            <el-input v-model="form.title" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="权限名称" label-width="80px">
            <el-input v-model="form.name" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="权限地址" label-width="80px">
            <el-input v-model="form.url" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" label-width="80px">
            <el-select v-model="form.permissType" style="width: 250px">
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" label-width="80px">
            <el-input v-model="form.number" type="number" style="width: 250px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel-button" @click="centerDialogVisible = false">取 消</el-button>
        <el-button class="sure-button" @click="sureAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑权限" :visible.sync="editVisible" width="400px">
      <div>
        <el-form :inline="true" :model="formEdit">
          <el-form-item label="上级菜单" label-width="80px">
            <el-select v-model="formEdit.value" placeholder="请选择上级菜单" style="width: 250px" filterable clearable>
              <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限标题" label-width="80px">
            <el-input v-model="formEdit.title" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="权限名称" label-width="80px">
            <el-input v-model="formEdit.name" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="地址" label-width="80px">
            <el-input v-model="formEdit.url" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="权限类型" label-width="80px">
            <el-select v-model="formEdit.permissType" style="width: 250px">
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" label-width="80px">
            <el-input v-model="formEdit.number" type="number" style="width: 250px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel-button" @click="editVisible = false">取 消</el-button>
        <el-button class="sure-button" @click="editSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { permission_update, permission_insert, permission_list_get } from '@/service/modules/setting.js'
export default {
  name: 'permission',
  data() {
    return {
      tableData: [],
      centerDialogVisible: false,
      editVisible: false,
      props: {
        label: 'title',
        children: 'childList',
      },
      form: {
        value: '0',
        title: '',
        name: '',
        url: '',
        permissType: 'menu',
        number: '0',
      },
      formEdit: {
        value: null,
        title: '',
        name: '',
        url: '',
        permissType: 'menu',
        number: '0',
      },
      options: [],
      editId: null,
      optionsType: [
        {
          label: '菜单',
          value: 'menu',
        },
        {
          label: '按钮',
          value: 'element',
        },
        {
          label: '页面链接',
          value: 'page',
        },
        {
          label: '机构',
          value: 'org',
        },
      ],
    }
  },
  methods: {
    addClose() {
      this.form = {
        value: '0',
        title: '',
        name: '',
        url: '',
        permissType: 'menu',
        number: '0',
      }
    },
    editSure() {
      let that = this
      let object = {
        url: this.formEdit.url,
        title: this.formEdit.title,
        name: this.formEdit.name,
        id: this.editId,
        parentId: this.formEdit.value,
        permissionType: this.formEdit.permissType,
        sort: Number(this.formEdit.number),
      }
      permission_update(object).then(res => {
        var arr = []
        function queryList(json, arr) {
          for (var i = 0; i < json.length; i++) {
            var sonList = json[i].childList
            if (sonList.length === 0) {
              arr.push(json[i])
            } else {
              arr.push(json[i])
              queryList(sonList, arr)
            }
          }
          return arr
        }
        if (res.code === 'SUCCESS') {
          that.editVisible = false
        }
        that.$message.success(res.msg)
        permission_list_get().then(res => {
          that.tableData = res.data
          queryList(res.data, arr)
          let object = {
            title: '顶级',
            id: 0,
          }
          arr.push(object)
          this.options = arr
        })
      })
    },
    edit(data) {
      this.editVisible = true
      this.formEdit.value = data.parentId
      this.formEdit.title = data.title
      this.formEdit.name = data.name
      this.formEdit.url = data.url
      this.formEdit.permissType = data.permissionType
      this.formEdit.number = String(data.sort)
      this.editId = data.id
    },
    sureAdd() {
      let that = this
      let object = {
        parentId: this.form.value,
        title: this.form.title,
        name: this.form.name,
        url: this.form.url,
        permissionType: this.form.permissType,
        sort: Number(this.form.number),
      }
      permission_insert(object).then(res => {
        var arr = []
        function queryList(json, arr) {
          for (var i = 0; i < json.length; i++) {
            var sonList = json[i].childList
            if (sonList.length === 0) {
              arr.push(json[i])
            } else {
              arr.push(json[i])
              queryList(sonList, arr)
            }
          }
          return arr
        }
        if (res.code === 'SUCCESS') {
          that.centerDialogVisible = false
          that.form.value = 0
          that.form.title = ''
          that.form.name = ''
          that.form.url = ''
        }
        that.$message.success(res.msg)
        permission_list_get().then(res => {
          that.tableData = res.data
          queryList(res.data, arr)
          let object = {
            title: '顶级',
            id: 0,
          }
          arr.push(object)
          this.options = arr
        })
      })
    },
  },
  mounted: function () {
    var arr = []
    function queryList(json, arr) {
      for (var i = 0; i < json.length; i++) {
        var sonList = json[i].childList
        if (sonList.length === 0) {
          arr.push(json[i])
        } else {
          arr.push(json[i])
          queryList(sonList, arr)
        }
      }
      return arr
    }
    permission_list_get().then(res => {
      this.tableData = res.data
      queryList(res.data, arr)
      let object = {
        title: '顶级',
        id: '0',
      }
      arr.push(object)
      this.options = arr
    })
  },
}
</script>

<style>
.jurisdiction .custom-tree-node {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.jurisdiction .el-tree-node__content {
  /*width: 100%;*/
  height: 57px;
  /*padding-left: 0 !important;*/
}
.jurisdiction .btnAddHeard {
  margin-left: 4.5vw;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
