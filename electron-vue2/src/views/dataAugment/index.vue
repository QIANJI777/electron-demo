<template>
  <div class="inner-wrapper plr20 ptb16">
    <tabs @getActiveType="activeType = $event"></tabs>
    <div class="content pt20">
      <div class="content__tree">
        <tree :treeData="treeData" @nodeClick="nodeClick"></tree>
      </div>
      <div class="content__main ml20">
        <div class="content__main__left p20">
          <div class="fs16 font-bold mb20">数据增广</div>
          <div class="content__main__left__augType" v-for="(item, index) in augTypes" :key="index">
            <div class="augTypes__title">{{ item.label }}</div>
            <div class="augTypes__types">
              <el-tree
                node-key="key"
                :data="item.children"
                show-checkbox
                @check-change="handleCheckChange('refTree' + index)"
                :ref="'refTree' + index"
              >
              </el-tree>
            </div>
          </div>
          <el-button class="content__main__left__btn" type="primary" @click="exeAug" :disabled="loading">执行增广</el-button>
        </div>
        <div class="content__main__mid">
          <img-list
            :imgListData="imgListData"
            :build_type="StateBuild_type"
            :layout_dataAugment="true"
            @getActiveAug="activeAug = $event"
            @activeMarkChange="activeMark = $event"
            ref="imgList"
          ></img-list>
          <pagination
            :currentPage.sync="pagination.currentPage"
            :total="Number(pagination.total)"
            @currentChange="getImgList"
          ></pagination>
        </div>
        <div class="content__main__right p20">
          <div class="content__main__right__title flex a-i-end j-c-bt pb20">
            <div class="decoration--bottomLine fs16 font-bold">增广数据</div>
            <div class="fs12 color-999">共{{ augmentRes.length }}项</div>
          </div>
          <div class="content__main__right__augRes" v-loading="loading">
            <div class="augRes-img" v-for="item in augmentRes" :key="item.imgId">
              <img :src="item.thumbImgUrl" alt="" />
              <div class="max-line-2 text-align-l">{{ item.imgName }}</div>
              <el-button @click.stop="deleteImg(item)" type="danger" icon="el-icon-delete" circle></el-button>
            </div>
          </div>
          <el-button class="content__main__right__btn mt18" type="primary" @click="keepAugRes" :disabled="loading"
            >保存结果</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// .vue
import imgList from '../../components/dataManage/imgList.vue'
import tabsMark from '../../components/dataManage/tabsMark.vue'
import pagination from '../../components/common/pagination.vue'
import tabs from '../../components/tabs/tabs.vue'
import tree from '../../components/tree/tree.vue'
// .js
import { getTree, getImgPage } from '@/service/modules/dataManage.js'
import { exeAugment, exeGan_Guijiao, saveAugmentedRes } from '@/service/modules/dataAugment.js'
import { showLoading, hideLoading } from '@/assets/utils/axiosLoading.js'
// node_modules
import { mapGetters } from 'vuex'
import { success, warning, error } from '../../assets/utils/message'

export default {
  name: 'dataAugment',
  components: { tabs, tree, imgList, tabsMark, pagination },
  // 将data按功能 模块化
  data() {
    return {
      // ------------ res.data
      imgListData: [],
      treeData: [],
      augmentRes: [],
      // ------------ 业务/功能 数据
      loading: false,
      // 增广种类数据
      augTypes: [
        {
          label: '传统增广',
          children: [
            { key: 'crop', label: '裁剪', disabled: false },
            { key: 'trans', label: '平移', disabled: false },
            { key: 'light', label: '光度改变', disabled: false },
          ],
        },
        {
          label: 'GAN网络增广',
          children: [{ key: 'guijiao', label: '硅胶', disabled: true }],
        },
      ],
      // 传统增广
      checkedAugType_traditional: [],
      // GAN网络增广
      checkedAugType_ganNet: [],
      // 选中图片
      // checkedList: [],
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      activeMark: 'unlabeled',
      // active: [输电、变电、配网]
      activeType: 'transmission',
      // active: [全部、未增广、已增广]
      activeAug: 'all',
      // depthCode
      depthCode_prefix: {
        // 数据增广 21
        data_augment: '21',
        // 数据标注 20
        data_mark: '20',
        // 数据筛选 20
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
    ...mapGetters('user', ['StateUserOrg', 'StateBuild_type']),
  },
  watch: {
    // 点击三大专业
    activeType: {
      immediate: true,
      handler(val) {
        this.depthCode = this.depthCode_prefix[this.StateBuild_type] + this.depthCode_suffix[val]
        this.getTreeData()
        this.getImgList()
        this.$nextTick(function () {
          if (this.activeMark === 'labeled') {
            // 传统增广只能增广已标注的图片
            // this.setGAN_disabled(true)
            this.setTraditional_disabled(false)
          } else {
            this.setTraditional_disabled(true)
            // this.setGAN_disabled(false)
          }
        })
      },
    },
    // 未增广 or 已增广
    activeAug(val) {
      this.getImgList()
      // console.log('watch: activeAug', val)
    },
    // 未增广 or 已增广
    activeMark(val) {
      if (val === 'labeled') {
        // 传统增广只能增广已标注的图片
        // this.setGAN_disabled(true)
        this.setTraditional_disabled(false)
      } else {
        this.setTraditional_disabled(true)
        // this.setGAN_disabled(false)
      }
      this.getImgList()
      // console.log('watch: activeAug', val)
    },
  },
  methods: {
    exeAugType_traditional(dataId, modelList) {
      return new Promise((resolve, reject) => {
        let form = {
          dataId,
          modelList,
        }
        exeAugment(form)
          .then(res => {
            if (res.code == 'SUCCESS') {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          })
          .catch(err => {
            this.loading = false
            reject(err)
          })
      })
    },
    exeAugType_ganNet(dataId, type) {
      return new Promise((resolve, reject) => {
        let form = {
          dataId,
        }
        if (type === 'guijiao') {
          exeGan_Guijiao(form)
            .then(res => {
              if (res.code == 'SUCCESS') {
                resolve(res.data)
              } else {
                reject(res.data)
              }
            })
            .catch(err => {
              this.loading = false
              reject(err)
            })
        } else {
          reject([])
        }
      })
    },
    async exeAug() {
      let checkedList = this.$refs.imgList.checkedList.reduce((pre, cur) => {
        pre.push(cur.dataId)
        return pre
      }, [])
      let type1 = this.checkedAugType_traditional
      let type2 = this.checkedAugType_ganNet
      if (checkedList.length === 0) {
        warning('请选择要增广的数据')
        return
      }
      if (type1.length === 0 && type2.length === 0) {
        warning('请选择要增广的类别')
        return
      }
      // console.log('增广参数', type1, type2, checkedList)
      let res = []
      this.loading = true
      if (type1.length > 0) {
        for (let i in checkedList) {
          let soloRes1 = await this.exeAugType_traditional(checkedList[i], type1)
          res.push(...soloRes1)
        }
      }
      if (type2.length > 0) {
        for (let i in checkedList) {
          let id = checkedList[i]
          for (let j in type2) {
            let solotype = type2[j]
            let soloRes2 = await this.exeAugType_ganNet(id, solotype)
            // 数据没增广过, 返回对象属性不为null, 再往结果里推
            if (soloRes2.imgId && soloRes2.imgUrl) {
              res.push(soloRes2)
            }
          }
        }
      }
      setTimeout(() => {
        this.loading = false
        // console.log('增广结果', res)
        this.augmentRes = res
      }, 0)
    },
    deleteImg(item) {
      this.augmentRes = this.augmentRes.filter(i => i.imgId !== item.imgId)
    },
    keepAugRes() {
      if (this.augmentRes.length === 0) {
        warning('增广结果不能为空')
        return
      }
      let form = {
        orgCode: this.StateUserOrg.partyCode,
        orgDepth: this.StateUserOrg.partyDepth,
        orgName: this.StateUserOrg.partyName,
        sampleOriginalList: this.augmentRes,
        depthCode: this.depthCode,
      }
      saveAugmentedRes(form).then(res => {
        if (res.code == 'SUCCESS') {
          success(res.msg)
          this.augmentRes = []
          // this.getTreeData()
          this.getImgList()
        } else {
          error(res.msg)
        }
      })
    },
    handleCheckChange(refKey) {
      this.$nextTick(() => {
        if (refKey == 'refTree0') this.checkedAugType_traditional = this.$refs[refKey][0].getCheckedKeys() || []
        if (refKey == 'refTree1') this.checkedAugType_ganNet = this.$refs[refKey][0].getCheckedKeys() || []
      })
    },
    setTraditional_disabled(flag) {
      if (flag) {
        this.checkedAugType_traditional = []
        this.$refs.refTree0[0].setCheckedKeys([])
      }
      this.augTypes[0].children.map(i => {
        i.disabled = flag
      })
    },
    // 设置禁用-GAN网络增广
    setGAN_disabled(flag) {
      if (flag) {
        // 清除已选中
        this.checkedAugType_ganNet = []
        this.$nextTick(function () {
          this.$refs.refTree1[0].setCheckedKeys([])
        })
      }
      this.augTypes[1].children.map(i => {
        if (i.label === '硅胶') {
          i.disabled = flag
        }
      })
    },
    // 点击树状分类节点
    nodeClick({depthCode}) {
      this.depthCode = depthCode
      if (depthCode.includes('210201')) this.setGAN_disabled(false)
      else this.setGAN_disabled(true)
      this.getImgList()
    },
    getImgList() {
      showLoading()
      const { currentPage, pageSize } = this.pagination
      let obj = {
        currentPage,
        orgDepth: this.StateUserOrg[0].partyDepth,
        pageSize,
        professionalType: this.activeType,
        // 原始图片 or 增广图片 dataType
      }
      if (this.activeMark !== 'all') {
        obj.tagFlag = this.activeMark === 'unlabeled' ? 0 : 1
        // tagDepthCode 是web端配合标注筛选对应的标签
        if (this.activeMark === 'labeled') obj.tagDepthCode = this.depthCode
        if (this.activeMark === 'unlabeled') obj.depthCode = this.depthCode
      }
      if (this.activeAug !== 'all') {
        // 已增广未增广
        obj.augmentedFlag = this.activeAug === 'notAugmented' ? '0' : '1'
      }
      getImgPage(obj)
        .then(res => {
          hideLoading()
          this.imgListData = []
          setTimeout(() => {
            this.imgListData = res.data
          }, 10)
          this.pagination.total = res.totalCount
          // console.log('getImgList', res.data)
        })
        .catch(err => {
          hideLoading()
          console.log(err)
        })
    },
    getTreeData() {
      if (this.StateBuild_type !== 'data_filter') {
        // 带数量
      }
      // 不带数量
      this.getTree()
    },
    getTree() {
      let form = {
        dictCode: this.depthCode_prefix[this.StateBuild_type],
        depthCode: this.depthCode,
      }
      getTree(form).then(res => {
        if (res.code == 'SUCCESS') {
          this.treeData = res.data
          // console.log('watch:activeType getTreeWithoutNumber', res.data)
        }
      })
    },
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
    display: flex;
    &__tree {
      // el-tree 宽度
      width: 12%;
      background-color: #fff;
    }
    &__main {
      width: calc(88% - 20px);
      display: flex;
      background-color: #fff;
      // 281 900 460
      &__left {
        // 增广 宽度
        width: 12%;
        border-right: 1px solid #eee;
        &__augType {
          height: 45%;
        }
        &__btn {
          width: 100%;
        }
      }
      &__mid {
        // imgList 宽度
        width: 66%;
        padding-top: 10px;
        position: relative;
        .el-pagination {
          position: absolute;
          bottom: 96px;
          right: 20px;
        }
      }
      &__right {
        // 增广结果 宽度
        width: 22%;
        border-left: 1px solid #eee;
        text-align: center;
        &__title {
          height: 40px;
          padding-bottom: 20px;
        }
        &__augRes {
          height: calc(100% - 40px - 32px - 20px);
          overflow-y: auto;
          img {
            width: 100%;
            height: 160px;
          }
          .augRes-img:hover {
            .el-button.is-circle {
              opacity: 1;
            }
          }
          .augRes-img {
            position: relative;
            .el-button.is-circle {
              width: 40px;
              height: 40px;
              position: absolute;
              top: 45%;
              right: 3%;
              transform: translateY(-50%);
              opacity: 0;
              transition: all 0.2s linear;
            }
          }
        }
        &__btn {
          width: 50%;
        }
      }
    }
  }
}
</style>
