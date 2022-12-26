<template>
  <div class="inner-wrapper plr20 ptb16">
    <tabs @getActiveType="activeType = $event"></tabs>
    <div class="content pt20">
      <div class="content__btns ptb12 plr20">
        <el-button class="mr10" type="primary" @click="uploadToServer">上传提交</el-button>
        <el-upload
          class="mr10 inline-block"
          accept="image/*"
          action=""
          multiple
          :before-upload="handlePreview"
          :show-file-list="false"
        >
          <el-button type="dash">导入图片</el-button>
        </el-upload>
        <el-button type="dash" class="add-mkdir mr10"
          >导入文件夹
          <input ref="input" class="upload-mkdir" webkitdirectory type="file" @change="handleChange" />
        </el-button>
        <el-button class="mr10 btn-clear" @click="clearImgList">清空列表</el-button>
      </div>
      <div class="content__mark pb20">
        <carrousel
          :imgList="imgList"
          :imgListUpload="imgListUpload"
          :treeData="treeData"
          :duringDisdinguish="duringDisdinguish"
          @startDisdinguish="startDisdinguish"
          @keepLabel="keepLabel"
          :marked="marked"
          :markTotal="markTotal"
          ref="carrousel"
        ></carrousel>
      </div>
    </div>
  </div>
</template>

<script>
// .vue
import tabs from '../../components/tabs/tabs.vue'
import carrousel from './components/carrousel.vue'
// apis
import { getTree } from '@/service/modules/dataManage.js'
import {
  moreUploadImg,
  getIdentifyImg,
  getCurTask,
  startDistinguish,
  getTypeTask,
  identifyImg_delete,
  keepLabel,
  imgClean,
} from '@/service/modules/dataMark.js'
// utils
import { success, warning } from '@/assets/utils/message'
import { showLoading, hideLoading } from '@/assets/utils/axiosLoading.js'
import { websocketUrl } from '@/assets/utils/config.js'
// node_modules
import { mapGetters } from 'vuex'
import { error } from '../../assets/utils/message'
import { debounce } from 'lodash'

export default {
  name: 'dataMark',
  components: { tabs, carrousel },
  // 将data按功能 模块化
  data() {
    return {
      taskId: '',
      ws: null,
      // ------------ res.data
      // 当前任务信息(taskStatus判断当前状态)
      taskInfo: {},
      // 接口获取数据数组
      imgList: [],
      // 上传图片数组
      imgListUpload: [],
      treeData: [],
      // ------------ 业务/功能 数据
      duringUpload: false,
      duringDisdinguish: false,
      // 标注进度
      marked: 0,
      markTotal: 0,
      // transmission substation distributionNetwork]
      activeType: 'transmission',
      depthCode_suffix: {
        transmission: '01',
        substation: '02',
        distributionNetwork: '03',
      },
      depthCode: '',
    }
  },
  computed: {
    ...mapGetters('user', ['StateCurOrg', 'StateUserInfo', 'StateBuild_type']),
  },
  watch: {
    // 点击三大专业
    activeType: {
      immediate: true,
      async handler(val) {
        showLoading()
        // console.log(val)
        this.imgListUpload = []
        this.depthCode = '21' + this.depthCode_suffix[val]
        await this.getTaskByType()
        this.getTree()
        this.getImgList()
        this.getCurTask()
        this.$nextTick(function () {
          // console.log(this.$refs.carrousel)
          this.$refs.carrousel.canvasClear()
          this.$refs.carrousel.curImgIndex = 0
          hideLoading()
        })
      },
    },
    imgListUpload: debounce(function (val) {
      this.duringUpload = false
      console.log('debounce', val.length)
    }, 300),
    duringUpload(val, preVal) {
      if (val && !preVal) {
        // 非上传状态 => 上传中
        showLoading()
        console.log('show')
      } else if (!val && preVal) {
        // 上传中 => 非上传状态
        hideLoading()
      }
    },
  },
  methods: {
    // { name: '图片未上传', value: '1' },
    // { name: '图片上传中', value: '2' },
    // { name: '图片已上传', value: '3' },
    // { name: '图片识别中', value: '4' },
    // { name: '图片识别完成', value: '5' },
    // { name: '识别任务终止', value: '6' },
    // { name: '人工审核中', value: '7' },
    // { name: '任务完成', value: '8' }
    keepLabel(params) {
      const { falseAlarmDtoList, imgId, identifyImgId } = params
      // 保存标注
      let obj = {
        // defectName 不是标准名字的话，defectCode传other
        falseAlarmDtoList,
        imgId: String(imgId),
        orgDepth: this.StateCurOrg.partyDepth,
        pdepthCode: '21' + this.depthCode_suffix[this.activeType],
        taskId: this.taskId,
      }
      console.log('保存参数', obj)
      keepLabel(obj)
        .then(res => {
          success('保存成功')
          identifyImg_delete(identifyImgId)
            .then(res => {
              this.getImgList()
              console.log(res)
              this.$refs.carrousel.canvasClear()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
    startDisdinguish(params) {
      // 只有3、6状态可以开始识别
      if (this.taskInfo.taskStatus != 3 && this.taskInfo.taskStatus != 6) {
        this.$message.warning('无待标注图片, 请先上传图片')
        return false
      }
      const { modelList, modelType } = params
      if (modelList.length === 0) {
        this.$message.warning('请选中标注类型')
        return false
      }
      let obj = {
        modelList,
        taskId: this.taskId,
        modelType,
      }
      startDistinguish(obj).then(res => {
        if (res.code == 'SUCCESS') {
          success('操作成功！')
          this.duringDisdinguish = true
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // >>> 上传
    uploadToServer() {
      //上传图片
      if (this.imgListUpload.length === 0) {
        warning('上传图片不能为空')
        return false
      }
      if (this.duringDisdinguish === true) {
        warning('正在识别, 请稍后上传')
        return false
      }
      let formData = new FormData()
      this.imgListUpload.forEach((item, index) => {
        formData.append('files', item.file)
      })
      formData.append('orgCode', this.StateCurOrg.partyCode)
      formData.append('orgDepth', this.StateCurOrg.partyDepth)
      formData.append('orgName', this.StateCurOrg.partyName)
      // 模拟识别任务
      formData.append('taskId', this.taskId)
      showLoading('正在上传，请稍后')
      moreUploadImg(formData).then(res => {
        hideLoading()
        if (res.code == 'SUCCESS') {
          if (res.data.successCount) success(`成功 ${res.data.successCount} 条`, true)
          setTimeout(() => {
            if (res.data.failureCount) error(`失败 ${res.data.failureCount} 条`, true)
          }, 0)
          this.imgListUpload = []
          this.getImgList()
          this.getCurTask()
        } else {
          error(res.msg)
        }
      })
    },
    handlePreview(file) {
      //上传多张图片
      if (!file.type.includes('image')) {
        error('只能导入图片')
        return false
      }
      if (this.imgList.length === 100) {
        error('超出100张')
        return false
      }
      if (this.imgList.length + this.imgListUpload.length >= 100) {
        error('超出100张')
        this.imgListUpload = this.imgListUpload.splice(0, 100 - this.imgList.length)
        return false
      }
      this.duringUpload = true
      let _this = this
      let reader = new FileReader()
      reader.onload = function () {
        let item = {
          src: reader.result,
          key: _this.imgListUpload.length + 1,
          imgName: file.name,
          file: file,
        }
        if (_this.imgList.length + _this.imgListUpload.length >= 100) {
          error('超出100张')
          _this.imgListUpload = _this.imgListUpload.splice(0, 100 - _this.imgList.length)
          return false
        }
        _this.imgListUpload.push(item)
      }
      reader.readAsDataURL(file)
    },
    handleChange(file) {
      let files = file.target.files
      for (let item of files) {
        if (item.type.includes('image')) {
          this.handlePreview(item)
        }
      }
    },
    clearImgList() {
      if (this.imgList.length === 0 && this.imgListUpload.length === 0) {
        warning('当前无数据')
      } else if (this.imgList.length > 0) {
        imgClean(this.taskId)
          .then(res => {
            this.marked = 0
            this.markTotal = 0
            this.duringDisdinguish = false
            this.$refs.carrousel.canvasClear()
            success(res.msg)
            this.imgList = []
            this.imgListUpload = []
          })
          .catch(err => {
            error(err.msg)
            console.log(err)
          })
      }
    },
    // <<<
    getTaskByType() {
      let obj = {
        currentPage: 1,
        pageSize: 8,
        professionalType: this.activeType,
      }
      return getTypeTask(obj)
        .then(res => {
          if (res.code === 'SUCCESS') {
            // 任务信息
            // success(res.msg)
            this.taskId = res.data[0].taskId
            return true
          } else {
            error(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCurTask() {
      //获取任务详情
      getCurTask(this.taskId).then(res => {
        if (res.code == 'SUCCESS') {
          // console.log('任务详情', res.data)
          this.taskInfo = res.data
        }
      })
    },
    getImgList() {
      //根据任务ID获取待识别的图片
      getIdentifyImg(this.taskId).then(res => {
        if (res.code == 'SUCCESS') {
          let marked = 0
          this.imgList = res.data
          this.markTotal = res.data.length
          res.data.map(i => {
            if (i.identifyStatus) marked++
          })
          this.marked = marked
        }
      })
    },
    getTree() {
      let form = {
        dictCode: '21',
        depthCode: this.depthCode,
      }
      getTree(form).then(res => {
        if (res.code == 'SUCCESS') {
          this.treeData = res.data
        }
      })
    },
    // >>> websocket
    initWebSocket() {
      let _this = this
      this.ws = null
      if ('WebSocket' in window) {
        this.ws = new WebSocket(websocketUrl[this.StateBuild_type] + this.StateUserInfo.partyCode)
        this.ws.onopen = function () {
          console.log('开始连接')
        }
        this.ws.onclose = function () {
          console.log('连接关闭')
        }
        this.ws.onmessage = function (msg) {
          if (!msg || !msg.data || msg.data === '连接websocket成功' || msg.data === 'socket连接成功') return false
          let res = JSON.parse(msg.data)
          if (res.currentTaskInfoVO.taskId !== _this.taskId) return false
          console.log(res)
          _this.marked = res.currentTaskInfoVO.identifiedCount
          _this.markTotal = res.currentTaskInfoVO.identificationTotal
          let markRes = res.currentTaskInfoVO.identifyImgAndResultList
          _this.imgList[markRes.length - 1] = markRes[markRes.length - 1]
          if (_this.marked === _this.markTotal) {
            // _this.imgList = markRes
            _this.duringDisdinguish = false
            _this.getImgList()
          }
        }
      }
    },
    // <<< websocket
  },
  mounted() {
    this.initWebSocket()
  },
}
</script>

<style lang="scss" scoped>
.inner-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  .content {
    height: calc(100% - 64px);
    &__btns {
      border-bottom: 1px solid #f4f4f4;
      background-color: #fff;
    }
    &__mark {
      height: calc(100% - 57px);
      background-color: #fff;
    }
  }
}
.btn-clear {
  margin-left: 0px !important;
}
// 上传
.add-mkdir {
  position: relative;
}
.upload-mkdir {
  position: absolute;
  font-size: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
  z-index: 11;
}
</style>
