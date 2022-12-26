<template>
  <div class="inner-wrapper plr20 ptb16">
    <tabs @getActiveType="activeType = $event"></tabs>
    <div class="content pt20">
      <div class="content__tree">
        <!-- StateBuild_type 控制 -->
        <tree :build_type="StateBuild_type" :treeData="treeData" @folderExpt="folderExpt" @nodeClick="nodeClick"></tree>
      </div>
      <div class="content__main ml20">
        <tabs-mark @getActiveMark="activeMark = $event" v-if="StateBuild_type === 'data_augment'"></tabs-mark>
        <img-list
          :imgListData="imgListData"
          :build_type="StateBuild_type"
          @getActiveAug="activeAug = $event"
          @impt="impt"
          @expt="handleBatchDownload"
          @del="del"
          ref="imgList"
        ></img-list>
        <pagination
          :currentPage.sync="pagination.currentPage"
          :total="Number(pagination.total)"
          @currentChange="currentChange"
        ></pagination>
      </div>
    </div>
    <dialog-import
      :dialogVisible.sync="showImportDialog"
      :params="importDialogParams"
      @updateImgList="getImgList"
    ></dialog-import>
  </div>
</template>

<script>
// .vue
import imgList from '../../components/dataManage/imgList.vue'
import tabsMark from '../../components/dataManage/tabsMark.vue'
import pagination from '../../components/common/pagination.vue'
import tabs from '../../components/tabs/tabs.vue'
import tree from '../../components/tree/tree.vue'
import dialogImport from '../../components/dialogImport/index.vue'
// .js
import {
  getTree,
  getImgPage,
  batchDelete,
  getImg_mark,
  delImg_mark,
  tree_mark_get,
  getTreeFolder,
} from '@/service/modules/dataManage.js'
import http from '@/service/http.js'
import { warning, info, success, error } from '../../assets/utils/message'
import { showLoading, hideLoading } from '@/assets/utils/axiosLoading.js'
// node_modules
import { mapGetters } from 'vuex'
import JSZIP from 'jszip'
import FileSaver from 'file-saver'
import { cloneDeep } from 'lodash'

export default {
  name: 'dataManage',
  components: { tabs, tree, imgList, tabsMark, pagination, dialogImport },
  data() {
    return {
      // ------------ res.data
      imgListData: [],
      treeData: [],
      // ------------ 业务/功能 数据
      // [导出文件夹] 匹配depthCode和分类
      codeList: {
        // 输电
        2001: '输电专业',
        200101: '杆塔',
        200102: '基础',
        200103: '绝缘子',
        200104: '金具',
        200105: '通道',
        200106: '接地装置',
        200107: '附属设施',
        // 变电
        2002: '变电专业',
        200201: '表计',
        200202: '箱体',
        200203: '硅胶',
        200204: '油污',
        200206: '挂空悬浮物',
        200207: '压板',
        200208: '呼吸器',
        // 配网
        2003: '配网专业',
        200108: '未知',
        200205: '未知',
        200301: '未知',
      },
      showImportDialog: false,
      importDialogParams: {},
      // 分页
      pagination: {
        defectName: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // [输电transmission-变电substation-配网distributionNetwork]
      activeType: 'transmission',
      // [全部all、未标注unlabeled、已标注labeled]
      activeMark: 'all',
      // [全部all、未增广notAugmented、已增广hasAugmented]
      activeAug: 'all',
      defectType: {
        transmission: 'sd',
        substation: 'bd',
        distributionNetwork: 'pw',
      },
      // depthCode
      depthCode_prefix: {
        data_augment: '21',
        data_mark: '21',
        data_filter: '20',
      },
      depthCode_suffix: {
        transmission: '01',
        substation: '02',
        distributionNetwork: '03',
      },
      depthCode: '',
    }
  },
  computed: {
    curProfessionalType() {
      return this.depthCode_prefix[this.StateBuild_type] + this.depthCode_suffix[this.activeType]
    },
    ...mapGetters('user', ['StateUserOrg', 'StateBuild_type']),
  },
  watch: {
    // 点击三大专业
    activeType: {
      immediate: true,
      handler(val) {
        // 切换大专业，重置pagination\
        this.pagination = {
          defectName: '',
          currentPage: 1,
          pageSize: 10,
          total: 0,
        }
        this.depthCode = this.curProfessionalType
        this.pagination.defectName =
          this.curProfessionalType === '2101' ? '输电专业' : this.curProfessionalType === '2102' ? '变电专业' : '配网专业'
        this.getTree()
        this.getImgList()
      },
    },
    // 未标注0 or 已标注1
    activeMark: {
      immediate: false,
      handler(val) {
        // if (this.StateBuild_type !== 'data_mark') {
        this.getImgList()
        // }
        // console.log('watch: activeMark', val)
      },
    },
    // 未增广 or 已增广
    activeAug: {
      immediate: false,
      handler(val) {
        this.getImgList()
        // console.log('watch: activeAug', val)
      },
    },
  },
  methods: {
    folderDownload(obj) {
      showLoading('正在下载......')
      // in: { key: [], ... }
      const zip = new JSZIP()
      const promises = []
      let topFolderKey = this.curProfessionalType
      let topFolderName = this.codeList[topFolderKey]
      // 一级文件夹
      zip.folder(topFolderName)
      // 双层循环实现遍历, 第一层对obj的键循环, 建立一级文件夹
      for (let i in obj) {
        let folderName, promise, imgArr
        if (i != topFolderKey) {
          // 二级文件夹
          folderName = this.codeList[i]
          zip.folder(topFolderName + '/' + folderName)
          // console.log(topFolderName + '/' + folderName)
        }
        imgArr = obj[i]
        imgArr.map((imgObj, index) => {
          if (!imgObj.imgUrl) return
          // console.log(imgObj)
          promise = new Promise((resolve, reject) => {
            http({
              url: imgObj.imgUrl,
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
            let file_name = imgObj.imgName // 获取文件名
            if (i != topFolderKey) {
              // 二级文件夹数据
              zip.file(topFolderName + '/' + folderName + '/' + file_name, data, { binary: true }) // 逐个添加文件
            } else {
              // 一级文件夹数据
              zip.file(topFolderName + '/' + file_name, data, { binary: true }) // 逐个添加文件
            }
          })
          promises.push(promise)
        })
      }
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          // 生成二进制流
          hideLoading()
          FileSaver.saveAs(content, this.codeList[this.curProfessionalType]) // 利用file-saver保存文件
          success('下载成功')
        })
      })
    },
    dataSort(data) {
      let baseOnKey = 'depthCode'
      // in: Object[]; out: { sort1: [], sort2: []...... }
      let out = {}
      for (let i in this.codeList) {
        out[i] = []
        // let matched = false
        for (let j in data) {
          let item = data[j]
          if (item[baseOnKey] == i) {
            // 匹配上
            // matched = true
            out[i].push(item)
          }
        }
      }
      for (let i in out) {
        if (out[i].length === 0) {
          delete out[i]
        }
      }
      // console.log('当前专业数据分类结果', out)
      return out
      // data.
    },
    folderExpt(categoryName) {
      let obj = {
        currentPage: 1,
        depthCode: this.curProfessionalType,
        orgDepth: this.StateUserOrg[0].partyDepth,
        pageSize: 10000,
        professionalType: this.activeType,
      }
      getImgPage(obj)
        .then(res => {
          if (res.data.length <= 0) {
            warning('当前分类无数据')
            return false
          }
          let imgList = res.data
          // console.log('导出所有数据', imgList)
          let sortres = this.dataSort(imgList)
          this.folderDownload(sortres)
        })
        .catch(err => {
          console.log(err)
        })
    },
    currentChange() {
      this.getImgList()
    },
    impt() {
      this.showImportDialog = true
      this.importDialogParams = {
        professionalType: this.activeType,
        depthCode: this.depthCode,
        orgCode: this.StateUserOrg[0].partyCode,
        orgName: this.StateUserOrg[0].partyName,
        orgDepth: this.StateUserOrg[0].partyDepth,
      }
      // console.log(this.importDialogParams)
    },
    // 下载图片
    getFile(url) {
      return new Promise((resolve, reject) => {
        http({
          url,
          method: 'get',
          responseType: 'arraybuffer',
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCheckedArr() {
      let checkedList = this.$refs.imgList.checkedList
      // console.log('checkedList', checkedList)
      if (checkedList.length === 0) {
        warning('选中至少一张图片')
        return false
      }
      let res = {}
      res.urlArr = []
      res.nameArr = []
      res.dataIdArr = []
      res.idArr = []
      res.marks = []
      checkedList.map(item => {
        if (item.imgUrl) {
          res.marks.push(item.falseAlarmDtoList || item.tagInfoDtoList)
          res.urlArr.push(item.imgUrl)
          res.nameArr.push(item.imgName)
          res.dataIdArr.push(item.dataId)
          res.idArr.push(item.id)
        }
      })
      return res
    },
    handleBatchDownload() {
      const { urlArr, nameArr, marks } = this.getCheckedArr()
      if (!urlArr) return
      const zip = new JSZIP()
      // const cache = {}
      const promises = []
      urlArr.forEach((item, index) => {
        const promise = this.getFile(item) // 下载文件, 并存成ArrayBuffer对象
          .then(data => {
            let file_name = nameArr[index] // 获取文件名
            zip.file(file_name, data, { binary: true }) // 逐个添加文件
            if (marks[index]) {
              let markArr = []
              marks[index].map(i => {
                let item = {
                  name: i.defectName || i.tagName,
                  x1: i.x1,
                  x2: i.x2,
                  y1: i.y1,
                  y2: i.y2,
                }
                markArr.push(item)
              })
              let jsonContent = {
                labels: markArr,
              }
              // 生成json文件
              let jsonName = file_name.split('.')[0] + '.json'
              zip.file(jsonName, JSON.stringify(jsonContent)) // json标注文件
            }
            // cache[file_name] = data
          })
        promises.push(promise)
      })
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          // 生成二进制流
          FileSaver.saveAs(content, '样本数据.zip') // 利用file-saver保存文件
          success('下载成功')
        })
      })
    },
    del() {
      const { dataIdArr } = this.getCheckedArr()
      const { idArr } = this.getCheckedArr()
      // console.log('dataId', dataIdArr)
      // console.log('idArr', idArr)
      if (!dataIdArr || dataIdArr.length === 0) {
        warning('请选择要删除的数据')
      } else {
        this.$confirm('确定要删除选中项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            if (this.StateBuild_type === 'data_mark') {
              let ids = ''
              for (let i in idArr) {
                ids = ids + '&ids=' + idArr[i]
              }
              let obj = {
                ids: idArr,
                orgDepth: this.StateUserOrg[0].partyDepth,
              }
              delImg_mark(obj).then(res => {
                if (res.code == 'SUCCESS') {
                  success('删除成功')
                  this.getImgList()
                } else {
                  error(res.msg)
                }
              })
            } else {
              batchDelete(dataIdArr.join(',')).then(res => {
                if (res.code == 'SUCCESS') {
                  success('删除成功')
                  this.getImgList()
                } else {
                  error(res.msg)
                }
              })
            }
          })
          .catch(err => {
            console.log(err)
            info('已取消删除')
          })
      }
    },
    // 点击树状分类节点
    nodeClick(data) {
      console.log(data)
      const { depthCode, categoryName } = data
      // && !data.childrenList
      if (this.StateBuild_type === 'data_mark') {
        this.depthCode = depthCode
        this.pagination.defectName = categoryName
        this.pagination.currentPage = 1
        this.getImgList()
      }
      if (this.StateBuild_type !== 'data_mark') {
        this.depthCode = depthCode
        this.pagination.defectName = categoryName
        this.pagination.currentPage = 1
        this.getImgList()
      }
    },
    getImgList() {
      showLoading()
      if (this.StateBuild_type === 'data_mark') {
        // 误报样本-获取
        // 误报样本-删除
        // 标注完保存到误报样本
        this.getImgList_Mark()
      } else {
        this.getImgList_exceptMark()
      }
    },
    getImgList_exceptMark() {
      const { currentPage, pageSize } = this.pagination
      let obj = {
        currentPage,
        depthCode: this.depthCode,
        orgDepth: this.StateUserOrg[0].partyDepth,
        pageSize,
        professionalType: this.activeType,
      }
      if (this.activeMark !== 'all') {
        obj.tagFlag = this.activeMark === 'unlabeled' ? 0 : 1
        if (this.activeMark === 'labeled') obj.tagDepthCode = this.depthCode
        // if (this.activeMark === 'labeled') obj.tagDepthCode = '21' + this.depthCode_suffix[this.activeType]
      }
      if (this.activeAug !== 'all') {
        obj.dataType = this.activeAug === 'notAugmented' ? 0 : 1
      }
      getImgPage(obj)
        .then(res => {
          hideLoading()
          this.imgListData = []
          setTimeout(() => {
            // 让el-image重新加载
            this.imgListData = res.data
          }, 10)
          this.pagination.total = res.totalCount
        })
        .catch(err => {
          hideLoading()
          console.log(err)
        })
    },
    getImgList_Mark() {
      let obj = {
        defectType: this.defectType[this.activeType],
        dictCode: '21',
        orgDepth: this.StateUserOrg[0].partyDepth,
        pdepthCode: this.curProfessionalType,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        defectName: this.pagination.defectName,
      }
      // 误报样本都是已标注，暂时不分是否标注
      console.log(obj)
      getImg_mark(obj)
        .then(res => {
          hideLoading()
          if (!res.data) {
            this.imgListData = []
            this.pagination.total = 0
            warning('当前无数据')
          } else {
            this.imgListData = []
            setTimeout(() => {
              // 让el-image重新加载
              this.imgListData = cloneDeep(res.data.list)
            }, 10)
            this.pagination.total = res.data.total
          }
          // console.log(res)
        })
        .catch(err => {
          hideLoading()
          console.log(err)
        })
    },
    getTree() {
      if (this.StateBuild_type === 'data_mark') {
        // 带数量 误报接口
        let form = {
          dictCode: 21,
          defectType: this.defectType[this.activeType],
          pdepthCode: this.curProfessionalType,
          orgDepth: this.StateUserOrg[0].partyDepth,
        }
        tree_mark_get(form).then(res => {
          if (res.code == 'SUCCESS') {
            this.treeData = [res.data]
          }
        })
      } else {
        // 不带数量
        let form = {
          dictCode: this.depthCode_prefix[this.StateBuild_type],
          depthCode: this.depthCode,
        }
        getTree(form).then(res => {
          if (res.code == 'SUCCESS') {
            this.treeData = res.data
          }
        })
      }
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
.inner-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  .content {
    height: calc(100% - 64px);
    display: flex;
    .content__tree {
      // el-tree 宽度
      width: 12%;
    }
    .content__main {
      width: calc(88% - 20px);
      background-color: #fff;
      position: relative;
      .el-pagination {
        position: absolute;
        bottom: 96px;
        right: 20px;
      }
    }
  }
}
</style>
