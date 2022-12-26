/** * @description 图片列表，显示数据，及一些其他操作 * @description
由于【数据标注】的数据结构与其他两个功能不同，所以做了很多判断操作 * @createTime: 2022/06/13, 11:28:35 */
<template>
  <div class="imgList-wrapper plr20">
    <div class="toolsBar-wrapper pt18 pb16" v-if="!layout_dataAugment">
      <!-- v-if="build_type !== 'data_mark'" -->
      <div>
        <span v-if="build_type === 'data_augment'" class="color-333 mr20">图片类型</span>
        <el-radio-group :value="activeAug" @input="handleActiveAugChange" v-if="build_type === 'data_augment'">
          <el-radio class="mr20" v-for="item in radioList" :key="item.label" :label="item.label">{{ item.describe }}</el-radio>
        </el-radio-group>
      </div>
      <div class="flex-ac">
        <div class="mr10">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">本页全选</el-checkbox>
          <span class="ml15 color-333">已选择 {{ checkedList.length }} 项</span>
        </div>
        <div class="import">
          <!-- v-if="build_type !== 'data_mark'" -->
          <el-button type="primary" @click="$emit('impt')" v-if="build_type === 'data_augment'">导入数据</el-button>
          <el-button type="primary" @click="$emit('expt')">导出</el-button>
          <el-button type="default" @click="$emit('del')">删除</el-button>
        </div>
      </div>
    </div>
    <!-- 数据增广布局 -->
    <div class="toolsBar-wrapper ptb10 mb20" v-if="layout_dataAugment">
      <div class="decoration--bottomLine fs16 font-bold">原始样本</div>
      <div class="toolsBar__right color-666">
        <span class="mr30 color-333">标注状态</span>
        <el-radio-group v-model="activeMark" @input="handleActiveMarkChange" v-if="build_type === 'data_augment'">
          <el-radio class="mr5" v-for="item in tabMarkList" :key="item.name" :label="item.name">{{ item.label }}</el-radio>
        </el-radio-group>
        <span class="decoration--verticalLine mr15 ml15"></span>
        <span class="mr30 color-333">增广状态</span>
        <el-radio-group :value="activeAug" @input="handleActiveAugChange" v-if="build_type === 'data_augment'">
          <el-radio class="mr5" v-for="item in radioList" :key="item.label" :label="item.label">{{ item.describe }}</el-radio>
        </el-radio-group>
        <span class="decoration--verticalLine mr15 ml15"></span>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">本页全选</el-checkbox>
        <span class="ml15 color-333">已选择 {{ checkedList.length }} 项</span>
      </div>
    </div>
    <div class="imgList">
      <div class="imgList-group">
        <!-- datamark用数据里的id -->
        <div v-for="(item, index) in imgListData" :key="item.dataId" class="imgList-group-item plr3 mb5">
          <div class="img-box pointer" @click="showBigImg(item, index)">
            <template v-if="item[marksName_filed]">
              <span class="mark-item" :style="tagItem.style" :key="index" v-for="(tagItem, index) in item[marksName_filed]">
                <b>{{ tagItem.tagName || tagItem.defectName }}</b>
              </span>
            </template>
            <el-image
              :ref="'elImage' + index"
              class="thumbImgs pointer"
              :src="item.thumbImgUrl"
              :style="layout_dataAugment ? 'height: 120px;' : ''"
              @load="imageLoad($event, item, index)"
            />
          </div>
          <el-tooltip effect="light" :open-delay="3000" :content="item.imgName" placement="top">
            <div class="imgList-group-item-title max-line-2">{{ item.imgName }}</div>
          </el-tooltip>
          <el-checkbox
            class="imgList-group-item-checkbox"
            :value="isChecked(item)"
            @change="checkChange($event, item)"
          ></el-checkbox>
          <div class="isAugmented" v-if="item.augmentedFlag">{{ item.tips ? '未增广' : '已增广' }}</div>
        </div>
      </div>
    </div>
    <el-dialog
      v-if="curImgObj && isShowBigImg"
      :visible="isShowBigImg"
      width="70%"
      :title="curImgObj ? curImgObj.imgName : '加载中'"
      @close="isShowBigImg = false"
    >
      <div class="bigImg">
        <span class="icon--prev" @click="prev()"><i class="el-icon-arrow-left"></i></span>
        <span class="icon--next" @click="next()"><i class="el-icon-arrow-right"></i></span>
        <div class="bigImg__content">
          <div class="img-marks-wrapper"  ref="imgBox">
            <img id="bigImg" :src="curImgObj.imgUrl" alt="" />
            <template v-if="curImgObj_markArr">
              <span
                class="bigImg__content__mark-item"
                :style="{
                  left: markItem.x1 && Number(markItem.x1 * x_scale).toFixed(2) + 'px',
                  top: markItem.y1 && Number(markItem.y1 * y_scale).toFixed(2) + 'px',
                  width: markItem.x2 && ((Number(markItem.x2) - Number(markItem.x1)) * x_scale).toFixed(2) + 'px',
                  height: markItem.y2 && ((Number(markItem.y2) - Number(markItem.y1)) * y_scale).toFixed(2) + 'px',
                }"
                :key="index"
                v-for="(markItem, index) of curImgObj_markArr"
              >
                <span class="tagName">{{ markItem[tagName_filed] }}</span>
              </span>
            </template>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { warning } from '../../assets/utils/message'
export default {
  name: 'imgList',
  props: {
    imgListData: Array,
    build_type: {
      type: String,
      default: 'data_mark',
    },
    // 数据增广布局
    layout_dataAugment: Boolean,
  },
  data() {
    return {
      // 大图对话框
      thumb_x_scale: 0,
      thumb_y_scale: 0,
      x_scale: 0,
      y_scale: 0,
      isShowBigImg: false,
      curImgObj: null,
      curImgIndex: 0,
      // unlabeled labeled
      activeMark: 'unlabeled',
      activeAug: 'all',
      isIndeterminate: false,
      checkAll: false,
      checkedList: [],
      tabMarkList: [
        {
          label: '未标注',
          name: 'unlabeled',
        },
        {
          label: '已标注',
          name: 'labeled',
        },
      ],
      radioList: [
        {
          label: 'all',
          describe: '全部',
        },
        {
          label: 'notAugmented',
          describe: '未增广',
        },
        {
          label: 'hasAugmented',
          describe: '已增广',
        },
      ],
    }
  },
  watch: {
    imgListData: {
      deep: true,
      handler(val, preVal) {
        this.clearCheck()
        if (val.length > 0 && val.length !== preVal.length) {
          this.$nextTick(function () {
            // this.getThumbMarks()
          })
        }
        // console.log('watch: imgListData')
      },
    },
  },
  computed: {
    // 增广+筛选-缺陷信息-数据结构
    // dataId:"1536153533550694401"
    // tagDepthCode:"2101"
    // tagId:"1536153533684912130"
    // tagName:"aircraft"
    // 标注-缺陷信息-数据结构
    // conf:77
    // defectCode:"bd_hxq_hxq_yc_yfywyc"
    // defectName:"呼吸器油封油位异常"
    // x1
    // x2
    // y1
    // y2
    curImgObj_markArr() {
      // 标注使用web端的误报模块，字段为falseAlarmDtoList; 正常字段tagInfoDtoList
      let field = this.build_type === 'data_mark' ? 'falseAlarmDtoList' : 'tagInfoDtoList'
      return this.curImgObj && this.curImgObj[field]
    },
    tagName_filed() {
      let field = this.build_type === 'data_mark' ? 'defectName' : 'tagName'
      return field
    },
    marksName_filed() {
      let field = this.build_type === 'data_mark' ? 'falseAlarmDtoList' : 'tagInfoDtoList'
      return field
    },
  },
  methods: {
    getTagStyle(item, x_scale, y_scale) {
      let style = {
        width: ((Number(item.x2) - Number(item.x1)) * x_scale).toFixed(2) + 'px',
        minHeight: ((Number(item.y2) - Number(item.y1)) * y_scale).toFixed(2) + 'px',
        lineHeight: ((Number(item.y2) - Number(item.y1)) * y_scale).toFixed(2) + 'px',
        left: Number(item.x1 * x_scale).toFixed(2) + 'px',
        top: Number(item.y1 * y_scale).toFixed(2) + 'px',
      }
      return style
    },
    imageLoad(e, item, index) {
      let imgInstance = this.$refs['elImage' + index]
      let imgs = document.getElementsByClassName('thumbImgs')
      // console.log(imgs)
      let oriWidth = imgInstance[0].imageWidth
      let oriHeight = imgInstance[0].imageHeight
      let eleWidth = imgs[index].clientWidth
      let eleHeight = imgs[index].clientHeight
      let x_scale = eleWidth / oriWidth
      let y_scale = eleHeight / oriHeight
      if (item[this.marksName_filed]) {
        item[this.marksName_filed].forEach(f => {
          this.$set(f, 'style', this.getTagStyle(f, x_scale, y_scale))
        })
      }
    },
    getScale(index) {
      let img = new Image()
      // 加属性会导致重新请求, 而不是读取缓存
      // img.setAttribute('crossOrigin', 'Anonymous')
      let _this = this
      img.onload = () => {
        // console.log(_this.$refs.imgBox.offsetWidth / img.width, _this.$refs.imgBox.offsetWidth, img.width)
        _this.x_scale = _this.$refs.imgBox.offsetWidth / img.width
        _this.y_scale = _this.$refs.imgBox.offsetHeight / img.height
      }
      img.src = this.curImgObj.imgUrl
    },
    showBigImg(item, index) {
      this.isShowBigImg = true
      this.curImgObj = item
      this.curImgIndex = index
      this.getScale()
    },
    prev() {
      if (this.curImgIndex <= 0) {
        warning('当前已经是第一张')
        return false
      } else {
        this.curImgIndex--
        this.curImgObj = this.imgListData[this.curImgIndex]
        this.getScale()
      }
    },
    next() {
      if (this.curImgIndex >= this.imgListData.length - 1) {
        warning('当前已经是最后一张')
        return false
      } else {
        this.curImgIndex++
        this.curImgObj = this.imgListData[this.curImgIndex]
        this.getScale()
      }
    },
    clearCheck() {
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedList = []
    },
    handleActiveMarkChange(val) {
      console.log(val)
      this.$emit('activeMarkChange', val)
    },
    handleActiveAugChange(val) {
      this.activeAug = val
      this.$emit('getActiveAug', val)
    },
    handleCheckAllChange(val) {
      this.checkedList = val ? cloneDeep(this.imgListData) : []
      this.isIndeterminate = false
    },
    isChecked(item) {
      let key = this.build_type === 'data_mark' ? 'id' : 'dataId'
      if (this.checkedList && this.checkedList.find(i => i[key] === item[key])) return true
      else return false
    },
    checkChange(flag, item) {
      if (flag) {
        // 选中, 将选中项推入checkedList
        this.checkedList.push(item)
      } else {
        // 取消选中, 将选中项从checkedList移除
        let idx = this.checkedList.findIndex(i => i.dataId === item.dataId)
        this.checkedList.splice(idx, 1)
      }
      // 控制全选、半选框状态
      let checkedCount = this.checkedList.length
      let total = this.imgListData.length
      this.checkAll = checkedCount === total
      this.isIndeterminate = checkedCount > 0 && checkedCount < total
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
$max-height: calc(100% - 120px);

.toolsBar-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .import {
    display: flex;
  }
}

.imgList {
  height: $max-height;
  &-group {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: 20%;
      position: relative;
      .img-box {
        position: relative;
        width: 100%;
        height: auto;
        .el-image {
          width: 100%;
          height: 180px;
        }
        // 缩略图标注框
        .mark-item {
          position: absolute;
          text-align: center;
          z-index: 9;
          display: inline-block;
          color: #ffffff;
          font-size: 10px;
          border: 1px dashed #079dfb;
          color: #ffffff;
          background: rgba(7, 157, 251, 0.3);
          white-space: nowrap;
        }
      }
      &-checkbox {
        z-index: 999;
        position: absolute;
        top: 8px;
        left: 10px;
      }
    }
  }
}
// 大图
/deep/ .el-dialog {
  margin-top: 6vh !important;
}
.bigImg {
  min-height: 600px;
  &__content {
    height: auto;
    max-height: 76vh;
    overflow-x: hidden;
    overflow-y: auto;
    // position: relative;
    .img-marks-wrapper {
      position: relative;
      img {
        margin: auto;
        width: 100%;
        height: 100%;
      }
      .bigImg__content__mark-item {
        position: absolute;
        display: block;
        z-index: 99;
        text-align: center;
        border: 1px dashed #079dfb;
        color: #ffffff;
        white-space: nowrap;
        background: rgba(7, 157, 251, 0.4);
        .tagName {
          position: absolute;
          display: block;
          white-space: nowrap;
          font-size: 12px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
// 已增广标识
.isAugmented {
  position: absolute;
  top: 0;
  right: 3px;
  color: #ffffff;
  line-height: 20px;
  font-size: 12px;
  padding: 0 8px;
  background: #ffbb00;
  border-radius: 10px 0px 10px 0px;
  box-shadow: -3px 3px 3px 0px rgba(0, 0, 0, 0.2);
}
</style>
