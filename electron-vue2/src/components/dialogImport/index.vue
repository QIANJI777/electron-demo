<template>
  <el-dialog title="数据导入" :visible="dialogVisible" width="560px" @close="$emit('update:dialogVisible', false)">
    <div class="content">
      <div class="title2 mb16">数据标注状态</div>
      <el-radio-group v-model="radio" label="">
        <el-radio :label="1">有标注信息</el-radio>
        <el-radio :label="0">无标注信息</el-radio>
      </el-radio-group>
      <div class="title2 mb16 mt24">导入方式 <span class="tips" v-show="radio === 1">标注格式：json（平台通用）</span></div>
      <div class="tips mb24">
        <p>1.支持文件格式：.rar .zip ，单个文件不能超过1GB</p>
        <p v-show="radio === 2">2. 压缩包内需要包括图片源文件（jpg/png/bmp/jpeg）</p>
        <p v-show="radio === 1">2. 压缩包内需要包括图片源文件（jpg/png/bmp/jpeg）及同名的json格式标注文件.</p>
      </div>
      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        accept=".zip, .rar"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :auto-upload="false"
        :on-change="selFiles"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogVisible', false)">取 消</el-button>
      <el-button type="primary" @click="importFile">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { uploadSample } from '@/service/modules/dataManage.js'
import { showLoading, hideLoading } from '@/assets/utils/axiosLoading.js'
import { warning, success, error } from '../../assets/utils/message'

export default {
  name: 'dialogImport',
  props: {
    dialogVisible: { type: Boolean, default: false },
    params: { type: Object },
  },
  data() {
    return {
      radio: 0,
      fileList: [],
      curFile: null,
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        console.log(this.fileList, this.curFile)
        this.fileList = []
        this.curFile = null
      }
    },
  },
  methods: {
    handleExceed() {
      warning('单次只能导入一个文件')
    },
    importFile() {
      if (!this.curFile) {
        warning('请先上传图片!')
        return
      }
      let forData = new FormData()
      forData.append('file', this.curFile)
      forData.append('tagFlag ', this.radio)
      forData.append('professionalType ', this.params.professionalType)
      forData.append('depthCode ', this.params.depthCode)
      forData.append('orgCode ', this.params.orgCode)
      forData.append('orgName ', this.params.orgName)
      forData.append('orgDepth ', this.params.orgDepth)
      showLoading('正在导入，请稍后')
      uploadSample(forData).then(res => {
        hideLoading()
        if (res.code == 'SUCCESS') {
          if (res.data.successCount) success(`成功 ${res.data.successCount} 条`, true)
          setTimeout(() => {
            if (res.data.failureCount) error(`失败 ${res.data.failureCount} 条`, true)
          }, 0)
          this.$emit('updateImgList')
          this.$emit('update:dialogVisible', false)
        } else {
          error(res.msg)
        }
      })
    },
    selFiles(file, fileList) {
      // console.log(file, fileList)
      this.curFile = file.raw
      this.fileList = fileList
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  min-height: 280px;
  .title2 {
    .tips {
      color: #666;
    }
  }
  .tips {
    font-size: 14px;
    color: #999999;
    line-height: 24px;
  }
}
</style>
