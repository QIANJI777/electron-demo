<template>
  <div class="dataFilter-wrapper p20">
    <div class="content-btns ptb12 plr20">
      <el-button class="mr10" type="primary" @click="uploadImgList" :disabled="hasSorted">上传提交</el-button>
      <el-upload
        :disabled="hasSorted"
        class="mr10 inline-block"
        accept="image/*"
        action=""
        multiple
        :before-upload="handlePreview"
        :show-file-list="false"
      >
        <el-button type="dash" :disabled="hasSorted">导入图片</el-button>
      </el-upload>
      <el-button type="dash" class="add-mkdir mr10" :disabled="hasSorted"
        >导入文件夹
        <input ref="input" class="upload-mkdir" :disabled="hasSorted" webkitdirectory type="file" @change="handleChange" />
      </el-button>
      <el-button class="mr10 btn-clear" @click="clearImgList" :disabled="duringSort">清空列表</el-button>
    </div>
    <div class="content-classify pb20">
      <div class="classify__left plr20" v-loading="loading">
        <div class="classify__left__scrollView mb5">
          <div class="classify__left__scrollView__title">
            <div class="colorBlock mlr3"></div>
            <div class="fs16 font-bold color-333 mr68">待分类数据</div>
            <div class="fs14 color-999">共{{ imgList.length }}项</div>
          </div>
          <div class="classify__left__scrollView__imgbox">
            <div class="imgbox">
              <div
                class="imgbox__item"
                :class="{ active: curImgIndex === index }"
                v-for="(item, index) in imgList"
                :key="index"
                @click="clickImg(index)"
              >
                <img :src="item.src || item.thumbImgUrl" class="imgbox__item__img" />
                <div class="imgbox__item__imgName max-line-1">{{ item.imgName }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="classify__left__btn">
          <el-radio-group v-model="curType" class="max-line-1">
            <el-radio label="transmission" class="mr0" :disabled="hasSorted">输电专业</el-radio>
            <el-radio label="substation" class="mr0" :disabled="hasSorted">变电专业</el-radio>
            <el-radio label="distributionNetwork" :disabled="hasSorted">配网专业</el-radio>
          </el-radio-group>
          <el-button type="primary" @click="startSort">开始分类</el-button>
        </div>
      </div>
      <div class="classify__mid plr10">
        <div class="classify__mid__header flex-ac j-c-bt">
          <div class="flex-ac">
            <div class="colorBlock mr5"></div>
            <div class="header__title fs16 font-bold mr20">识别结果</div>
          </div>
          <div class="header__progress">
            <span class="fs16">识别数量{{ sorted }}/{{ sortTotal }}</span>
            <el-progress :percentage="curPercentage"></el-progress>
          </div>
        </div>
        <div class="classify__mid__bigimg" id="myCanvas-box">
          <i class="iconfont icon-the_previous_step pointer" @click="prev"></i>
          <i class="iconfont icon-the_next_step pointer" @click="next"></i>
          <img v-if="curImgObj" :src="curImgObj.src || curImgObj.imgUrl" alt="" />
        </div>
        <div class="classify__mid__progress fs12">{{ imgList.length == 0 ? 0 : curImgIndex + 1 }} / {{ imgList.length }}</div>
        <div class="classify__mid__select">
          <span class="mr10">更改分类</span>
          <el-select
            v-model="curSelectCategory"
            placeholder="请选择"
            @change="handleCategoryChange"
            :disabled="!sortFinished"
            v-if="treeData.length > 0"
          >
            <el-option
              v-for="item in treeData[0].childrenList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryName"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="classify__right--labelTree" v-loading="loading">
        <div class="tree-wrapper p16">
          <div>分类结果</div>
          <div class="tree mt10">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              node-key="categoryId"
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
              default-expand-all
              :highlight-current="true"
              ref="tree"
            >
              <div class="custom-tree-node" slot-scope="{ node }">{{ node.data.categoryName }}({{ node.data.count || 0 }})</div>
            </el-tree>
          </div>
        </div>
        <div class="classify__right__btn flex-2c">
          <el-button type="primary" @click="saveSortResult">保存</el-button>
          <el-button type="primary" @click="expt">导出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// .vue
// node_modules
import { mapGetters } from 'vuex'
import JSZIP from 'jszip'
import FileSaver from 'file-saver'
// utils
import { success, warning, error } from '@/assets/utils/message'
import { showLoading, hideLoading } from '@/assets/utils/axiosLoading.js'
import http from '@/service/http.js'
// http
import { getIdentifyImg, imgClean } from '@/service/modules/dataMark.js'
import { getTree } from '@/service/modules/dataManage.js'
import { addTask, uploadBatch, sortDistinguish, sortConfirm } from '@/service/modules/dataFilter.js'
//
import { websocketUrl } from '@/assets/utils/config.js'

export default {
  name: 'dataFilter',
  components: {},
  data() {
    return {
      ws: null,
      // 第一次上传
      firstUpload: false,
      // 开始分类后禁用radio
      hasSorted: false,
      duringSort: false,
      // 完成分类
      sortFinished: false,
      loading: false,
      // 分类进度
      sorted: 0,
      sortTotal: 0,
      // 临时任务id
      taskId: '',
      // resData
      imgList: [],
      treeData: [],
      // cur
      curImgIndex: 0,
      curImgObj: null,
      curSelectCategory: '',
      depthCode: '',
      // >>> element-props=
      defaultProps: {
        children: 'childrenList',
        label: 'categoryName',
      },
      curType: 'transmission',
      // <<< element-props
    }
  },
  methods: {
    expt() {
      if (!this.sortFinished) {
        warning('请先分类')
        return
      }
      const zip = new JSZIP()
      const cache = {}
      const promises = []
      this.treeData[0].childrenList.forEach((cate, cateIndex) => {
        if (cate.count) {
          let folderName = cate.categoryName
          zip.folder(folderName)
          this.imgList.forEach((item, index) => {
            let promise
            if (item.categoryName === folderName && item.imgUrl) {
              promise = new Promise((resolve, reject) => {
                http({
                  url: item.imgUrl,
                  method: 'get',
                  responseType: 'arraybuffer',
                })
                  .then(res => {
                    resolve(res)
                  })
                  .catch(err => {
                    reject(err)
                  })
              }).then(data => {
                let file_name = item.imgName // 获取文件名
                zip.file(folderName + '/' + file_name, data, { binary: true }) // 逐个添加文件
                cache[file_name] = data
              })
              promises.push(promise)
            }
          })
        }
      })
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          // 生成二进制流
          FileSaver.saveAs(content, '分类结果.zip') // 利用file-saver保存文件
          success('下载成功')
        })
      })
    },
    // 保存
    saveSortResult() {
      if (!this.sortFinished) {
        warning('请先分类')
        return
      }
      showLoading('正在导入数据，请稍后')
      let promises = []
      this.treeData[0].childrenList.map(item1 => {
        let obj = {
          taskId: '',
          depthCode: '',
          professionalType: this.curType,
          imgIds: [],
        }
        if (item1.count > 0) {
          obj.taskId = this.taskId
          obj.depthCode = item1.depthCode
          this.imgList.map(item2 => {
            if (item2.categoryName === item1.categoryName) {
              obj.imgIds.push(item2.imgId)
            }
          })
          console.log('保存接口参数', obj)
          promises.push(sortConfirm(obj))
        }
      })
      Promise.all(promises)
        .then(resArr => {
          hideLoading()
          this.clearImgList()
          this.curImgObj = null
          // console.log(resArr)
          let res = resArr[0]
          success(res.msg)
        })
        .catch(err => {
          console.log(err)
          hideLoading()
          error(err.msg)
        })
    },
    getSortInfo(_this) {
      // 上传之后更新
      if (_this) {
        getIdentifyImg(_this.taskId).then(res => {
          _this.imgList = res.data
          _this.sortTotal = res.data.length
          _this.computeSortRes()
          // console.log('分类信息', res)
        })
      } else {
        getIdentifyImg(this.taskId).then(res => {
          this.imgList = res.data
          this.sortTotal = res.data.length
          // console.log('分类信息', res)
        })
      }
    },
    uploadImgList() {
      let importedImgs = []
      this.imgList.map(item => {
        if (item.file) {
          // bug 文件夹上传之后多了一层
          // delete item.file.webkitRelativePath
          // console.log(item.file)
          importedImgs.push(item)
        }
      })
      let formData = new FormData()
      if (importedImgs.length === 0) {
        error('上传图片为空')
        return false
      }
      formData.append('taskId', this.taskId)
      formData.append('professionalType', 'batch')
      formData.append('orgCode', this.StateUserOrg[0].partyCode)
      formData.append('orgDepth', this.StateUserOrg[0].partyDepth)
      formData.append('orgName', this.StateUserOrg[0].partyName)
      importedImgs.forEach(item => {
        formData.append('files', item.file)
      })
      showLoading('正在上传数据, 请稍后')
      uploadBatch(formData).then(res => {
        hideLoading()
        if (res.code == 'SUCCESS') {
          if (res.data.successCount) success(`上传成功 ${res.data.successCount} 条`, true)
          setTimeout(() => {
            if (res.data.failureCount) error(`上传失败 ${res.data.failureCount} 条`, true)
          }, 0)
          this.firstUpload = true
          this.getSortInfo()
        } else {
          error(res.msg)
        }
      })
    },
    startSort() {
      if (this.hasSorted) {
        warning('分类已完成，请勿重复分类')
        return
      }
      if (!this.firstUpload) {
        warning('请先上传')
        return
      }
      // startLoading('正在识别, 请稍后')
      let formdata = new FormData()
      formdata.append('taskId', this.taskId)
      formdata.append('professionalType', this.curType)
      sortDistinguish(formdata).then(res => {
        if (res.code == 'SUCCESS') {
          success('开始分类, 退出将会丢失本次分类数据')
          this.hasSorted = true
          this.loading = true
          this.duringSort = true
        } else {
          error(res.msg)
        }
      })
    },
    // el-option change
    handleCategoryChange(targetCate) {
      // console.log(targetCate)
      let oriCate = this.curImgObj.categoryName
      this.treeData[0].childrenList.map(item => {
        if (item.categoryName === oriCate) item.count--
        if (item.categoryName === targetCate) item.count++
      })
      this.imgList[this.curImgIndex].categoryName = targetCate
      this.curImgObj.categoryName = targetCate
    },
    childrenCntAdd(categoryName, index) {
      // 总数
      this.treeData[0].count++
      // 分类数
      let idx = this.treeData[0].childrenList.findIndex(i => i.categoryName === categoryName)
      let target = this.treeData[0].childrenList[idx]
      target.count++
      // 给每个imgItem添加categoryName属性
      this.imgList[index].categoryName = categoryName
    },
    // 计算结果(tree数量、imgList categoryName)
    computeSortRes() {
      this.sortFinished = true
      // 清零
      this.treeData[0].count = 0
      this.treeData[0].childrenList.map(i => {
        i.count = 0
      })
      this.imgList.map((imgItem, index1) => {
        let allLowerThanConfidence = true
        let largerOne = null
        let largerConf = this.confidence
        if (this.curType === 'transmission') {
          if (imgItem.alarmInfo === '其他') {
            this.childrenCntAdd('未知', index1)
          } else if (imgItem.alarmInfo !== '其他') {
            imgItem.identifyResultList.map(identifyRes => {
              if (identifyRes.conf >= this.confidence) allLowerThanConfidence = false
              if (identifyRes.conf >= largerConf) {
                largerConf = identifyRes.conf
                largerOne = identifyRes
              }
            })
            if (!allLowerThanConfidence) {
              if (largerOne.defectCode.includes('sd_jyz')) {
                this.childrenCntAdd('绝缘子', index1)
              } else if (largerOne.defectCode.includes('sd_jj')) {
                this.childrenCntAdd('金具', index1)
              } else if (largerOne.defectCode.includes('sd_ss')) {
                this.childrenCntAdd('附属设施', index1)
              } else if (largerOne.defectCode.includes('sd_gt')) {
                this.childrenCntAdd('杆塔', index1)
              } else {
                this.childrenCntAdd('未知', index1)
              }
            } else {
              this.childrenCntAdd('未知', index1)
            }
          }
        } else if (this.curType === 'substation') {
          if (imgItem.alarmInfo === '其他' || !imgItem.alarmInfo) {
            this.childrenCntAdd('未知', index1)
          } else {
            imgItem.identifyResultList.map((identifyRes, index2) => {
              if (identifyRes.conf >= this.confidence) {
                allLowerThanConfidence = false
              }
              if (identifyRes.conf >= largerConf) {
                largerConf = identifyRes.conf
                largerOne = identifyRes
              }
            })
            if (!allLowerThanConfidence) {
              if (largerOne.defectCode.includes('bd_gj')) {
                this.childrenCntAdd('硅胶', index1)
              } else if (largerOne.defectCode.includes('bd_xt')) {
                this.childrenCntAdd('箱体', index1)
              } else if (largerOne.defectCode.includes('bd_bj')) {
                this.childrenCntAdd('表计', index1)
              } else if (largerOne.defectCode.includes('bd_yw') && !largerOne.defectCode.includes('gkxfw')) {
                this.childrenCntAdd('油污', index1)
              } else if (largerOne.defectCode.includes('bd_yw_gkxfw')) {
                this.childrenCntAdd('挂空悬浮物', index1)
              } else if (largerOne.defectCode.includes('bd_ybzt')) {
                this.childrenCntAdd('压板', index1)
              } else if (largerOne.defectCode.includes('bd_hxq')) {
                this.childrenCntAdd('呼吸器', index1)
              } else {
                this.childrenCntAdd('未知', index1)
              }
            } else {
              this.childrenCntAdd('未知', index1)
            }
          }
        } else if (this.curType === 'distributionNetwork') {
          this.childrenCntAdd('未知', index1)
        }
      })
      setTimeout(() => {
        this.loading = false
        console.log('数据处理', this.treeData, this.imgList)
      }, 100)
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
          // console.log(res)
          _this.sorted = res.currentTaskInfoVO.identifiedCount
          _this.sortTotal = res.currentTaskInfoVO.identificationTotal
          // let sortRes = res.currentTaskInfoVO.identifyImgAndResultList
          if (_this.sorted === _this.sortTotal) {
            success('分类成功')
            _this.getSortInfo(_this)
            _this.duringSort = false
          }
        }
      }
    },
    // <<< websocket
    addBatchTask() {
      let obj = {
        professionalType: 'batch',
        taskName: '批量识别临时任务',
        orgCode: this.StateUserOrg[0].partyCode,
        orgDepth: this.StateUserOrg[0].partyDepth,
        orgName: this.StateUserOrg[0].partyName,
      }
      // 新建batch任务
      addTask(obj)
        .then(res => {
          // console.log('taskId', res.data)
          this.taskId = res.data
        })
        .catch(err => {
          error(err.msg)
        })
    },
    getTree() {
      let form = {
        dictCode: '20',
        depthCode: this.depthCode,
      }
      getTree(form).then(res => {
        if (res.code == 'SUCCESS') {
          this.treeData = res.data
        }
      })
    },
    handlePreview(file, fileList) {
      // 作用：获取reader.result
      if (!file.type.includes('image')) {
        error('只能导入图片')
        return false
      }
      let _this = this
      let reader = new FileReader()
      reader.onload = function () {
        let item = {
          src: reader.result,
          key: _this.imgList.length + 1,
          imgName: file.name,
          file: file,
        }
        // let sameNameImg = _this.imgList.filter(i => i.imgName === file.name)
        // if (sameNameImg.length > 0) {
        //   warning('图片：' + file.name + ' 重名')
        //   return
        // }
        _this.imgList.push(item)
      }
      reader.readAsDataURL(file)
    },
    handleChange(file) {
      let files = file.target.files
      console.log(files)
      for (let item of files) {
        if (item.type.includes('image')) {
          this.handlePreview(item)
        }
      }
    },
    clearImgList() {
      if (this.imgList.length === 0) {
        warning('当前无数据')
      } else if (this.imgList.length > 0 && !this.firstUpload) {
        // 未上传
        success('清除成功')
        this.imgList = []
        this.curImgObj = null
      } else if (this.imgList.length > 0 && this.firstUpload) {
        // 已上传
        imgClean(this.taskId).then(res => {
          success(res.msg)
          this.getTree()
          this.sorted = 0
          this.sortTotal = 0
          this.imgList = []
          this.curImgObj = null
          this.curSelectCategory = ''
          this.firstUpload = false
          this.hasSorted = false
          this.sortFinished = false
        })
      }
    },
    // <<<
    // 点击树状分类节点
    handleNodeClick(data, node, el) {},
    clickImg(index) {
      this.curImgIndex = index
    },
    // <<<
    // >>> 切换
    prev() {
      let idx = this.curImgIndex - 1
      if (idx < 0) {
        warning('当前是第一张')
        return false
      }
      this.curImgIndex = idx
    },
    next() {
      let idx = this.curImgIndex + 1
      if (idx >= this.imgList.length) {
        warning('当前是最后一张')
        return false
      }
      this.curImgIndex = idx
    },
    // <<<
  },
  computed: {
    curImgCategory() {
      if (this.curImgObj) {
        return this.curImgObj.categoryName
      } else {
        return ''
      }
    },
    curPercentage() {
      return this.sortTotal === 0 ? 0 : Math.round((this.sorted / this.sortTotal) * 100)
    },
    confidence() {
      return localStorage.getItem('confidence') || 80
    },
    ...mapGetters('user', ['StateUserOrg', 'StateUserInfo', 'StateBuild_type']),
  },
  watch: {
    // 更新当前img
    imgList: {
      deep: true,
      handler(val, preval) {
        // console.log(val)
        if (val.length > 100) {
          error('当前上传图片大于100')
          this.imgList = this.imgList.slice(0, 100)
          this.sortTotal = 100
          return false
        }
        if (val.length > 0) {
          this.curImgObj = val[this.curImgIndex]
        }
      },
    },
    curImgObj: {
      deep: true,
      handler(val) {
        this.curSelectCategory = val.categoryName
      },
    },
    curImgIndex(val) {
      if (val >= 0 && val < this.imgList.length) {
        this.curImgObj = this.imgList[val]
      }
    },
    curType: {
      immediate: true,
      handler(val) {
        // 获取与专业对应的treeData
        if (val === 'transmission') {
          this.depthCode = '2001'
        } else if (val === 'substation') {
          this.depthCode = '2002'
        } else if (val === 'distributionNetwork') {
          this.depthCode = '2003'
        }
        this.getTree()
      },
    },
    StateUserOrg: {
      deep: true,
      handler(val) {
        this.addBatchTask()
      },
    },
    StateUserInfo: {
      deep: true,
      handler(val) {
        this.initWebSocket()
      },
    },
  },
  created() {
    if (this.StateUserOrg.length > 0) {
      this.addBatchTask()
    }
  },
  mounted() {
    if (this.StateUserInfo && this.StateUserInfo.partyCode) {
      this.initWebSocket()
    }
  },
}
</script>

<style lang="scss" scoped>
.dataFilter-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  .content-btns {
    background-color: #fff;
    border-bottom: 1px solid #f4f4f4;
  }
  .content-classify {
    background-color: #fff;
    height: calc(100% - 57px);
    display: flex;
    .classify__left {
      // 250px + 20
      width: 270px;
      height: 100%;
      &__scrollView {
        height: calc(100% - 57px - 5px);
        &__title {
          height: 40px;
          display: flex;
          align-items: center;
        }
        &__imgbox {
          height: calc(100% - 40px);
          max-height: calc(100% - 40px);
          overflow-y: auto;
        }
      }
      &__btn {
        height: 57px;
        /deep/ .el-radio-group {
          padding-bottom: 8px;
          .el-radio__label {
            padding-left: 3px;
            padding-right: 5px;
          }
        }
        .el-button {
          width: 100%;
        }
      }
    }
    .classify__mid {
      // 1327px - 20
      width: 1307px;
      max-width: 1317px;
      overflow: hidden;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      &__header {
        height: 50px;
        .header__progress {
          width: 457px;
          display: flex;
          justify-content: space-between;
          .el-progress {
            width: 326px;
            line-height: unset;
            white-space: nowrap !important;
          }
        }
      }
      &__bigimg {
        // -header -progress -4px留白
        height: calc(100% - 50px - 21px - 32px - 4px);
        position: relative;
        .iconfont {
          font-size: 40px;
          color: #777;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9;
        }
        .icon-the_previous_step {
          left: 20px;
        }
        .icon-the_next_step {
          right: 20px;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      &__progress {
        text-align: center;
      }
      &__select {
        color: #666;
        .el-select {
          width: 151px;
          height: 32px;
        }
      }
    }
    .classify__right--labelTree {
      // 303px
      width: 303px;
      height: 100%;
      .classify__right__btn {
        .el-button {
          width: 40%;
        }
      }
    }
  }
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

// 色块
.colorBlock {
  width: 3px;
  height: 16px;
  margin-bottom: -2px;
  background: #35e287;
}
// 左侧图片列表
.imgbox {
  height: 100%;
  &__item {
    height: 155px;
    padding: 4px 7px 0 7px;
    border: 1px solid transparent;
    &__img {
      width: 100%;
      height: 120px;
    }
  }
  &__item:hover {
    background-color: rgba(53, 226, 135, 0.1);
    border-color: rgba($color: #35e287, $alpha: 0.5);
  }
  &__item.active {
    background-color: rgba(53, 226, 135, 0.2);
    border-color: #35e287;
  }
}
.btn-clear {
  margin-left: 0px !important;
}
// tree
.tree-wrapper {
  height: calc(100% - 32px);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .tree {
    height: calc(100% - 21px);
    max-height: calc(100% - 21px);
    overflow-y: auto;
  }
}
</style>
