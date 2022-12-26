<template>
  <div class="carrousel">
    <div class="carrousel__left plr20">
      <div class="carrousel__left__scrollView mb5">
        <div class="carrousel__left__scrollView__title">
          <div class="colorBlock mlr3"></div>
          <div class="fs15 font-bold color-333 mr30">待标注数据</div>
          <div class="fs12 color-999">共{{ imgList.length + imgListUpload.length }}项</div>
        </div>
        <div class="carrousel__left__scrollView__imgbox">
          <div class="imgbox">
            <!-- 当前上传数据 imgListUpload -->
            <div class="imgbox__item" v-for="(item, index) in imgListUpload" :key="index">
              <img :src="item.src" class="imgbox__item__img" />
              <div class="imgbox__item__imgName max-line-1">{{ item.imgName }}</div>
            </div>
            <!-- 接口获取已上传数据 -->
            <div
              class="imgbox__item"
              :class="{ active: curImgIndex === index }"
              v-for="(item, index) in imgList"
              :key="index + imgListUpload.length"
              @click="clickImg(index)"
            >
              <img :src="item.thumbImgUrl" class="imgbox__item__img" />
              <div class="imgbox__item__imgName max-line-1">{{ item.imgName }}</div>
              <div class="icons">
                <img v-if="item.identifyStatus == 1" src="@/assets/images/ident.png" alt="" />
                <img src="@/assets/images/sucIcon.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="carrousel__left__btn flex-2c">
        <el-button type="primary" @click="showAutoLabel = true" :disabled="duringDisdinguish">智能标注</el-button>
      </div>
    </div>
    <div class="carrousel__mid plr10">
      <div class="carrousel__mid__header flex-ac j-c-bt">
        <div class="flex-ac">
          <div class="colorBlock mr5"></div>
          <div class="header__title fs15 font-bold mr20">图像标注</div>
          <!-- 启动标注后，按住“Shift”键位+鼠标“右键”进行标注 -->
          <el-tooltip content="启动标注后，按住“Shift”键位+鼠标“右键”进行标注" placement="top">
            <div class="mr20 flex-ac pointer" :class="{ enableManualMark: is.manualMark }" @click="enableManual">
              <i class="iconfont icon-icon-GIS_biaozhu"></i>
              <span>手动标注</span>
            </div>
          </el-tooltip>
          <div class="mr20 flex-ac pointer" @click="delMark">
            <i class="iconfont icon-shanchu"></i>
            <span>删除标注</span>
          </div>
          <div class="mr20 flex-ac pointer" @click="undoOperation">
            <i class="iconfont icon-chexiao"></i>
            <span>撤销</span>
          </div>
          <div class="flex-ac pointer" @click="imgAdapt">
            <i class="iconfont icon-guangqi_zishiyingxianshi"></i>
            <span>图片自适应</span>
          </div>
        </div>
        <div class="header__progress">
          <span class="fs16">标注数量{{ marked }}/{{ markTotal }}</span>
          <el-progress :percentage="curPercentage"></el-progress>
        </div>
      </div>
      <div class="carrousel__mid__bigimg" id="myCanvas-box" @contextmenu.prevent>
        <i class="iconfont icon-the_previous_step pointer" @click="prev"></i>
        <i class="iconfont icon-the_next_step pointer" @click="next"></i>
        <canvas id="myCanvas" width="1314" height="624"></canvas>
        <!-- <img v-if="curImgObj" :src="curImgObj.src" alt=""> -->
      </div>
      <div class="carrousel__mid__progress fs12">{{ imgList.length == 0 ? 0 : curImgIndex + 1 }} / {{ imgList.length }}</div>
    </div>
    <div class="carrousel__right--labelTree">
      <div class="tree-wrapper">
        <div class="search p16">
          <div class="tree mt16">
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
            </el-tree>
          </div>
          <el-input placeholder="请输入标签名称" v-model="labelName" :disabled="!selectedIsManual" @change="labelNameChange">
          </el-input>
        </div>
      </div>
      <div class="carrousel__right__btn flex-2c">
        <el-button type="primary" @click="keepCurLabel">保存当前标注</el-button>
      </div>
    </div>
    <el-dialog title="智能标注" :visible.sync="showAutoLabel" width="35%">
      <div class="mb20">请选择需要标注的类型</div>
      <el-tabs type="border-card" :stretch="true" class="autoLabel-tabs" v-model="curTab">
        <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabsData" :key="item.name">
          <template v-if="item.name !== 'distributionNetwork'">
            <el-checkbox
              :disabled="initDisabled"
              v-model="checkAll"
              @change="handleCheckAllChange"
              :indeterminate="isIndeterminate"
              >全选</el-checkbox
            >
            <el-checkbox-group :disabled="initDisabled" v-model="checkedTypeList" @change="handleCheckedListChange">
              <el-checkbox
                v-for="item in allModel[item.name]"
                :key="item.Detect_type"
                :label="item.Detect_type"
                :disabled="
                  (mutualExclusion.otherList.includes(item.Detect_type) && mutualExclusion.bdcjChecked) ||
                  (mutualExclusion.bdcjList.includes(item.Detect_type) && mutualExclusion.otherChecked)
                "
                >{{ item.modleName }}</el-checkbox
              >
            </el-checkbox-group>
          </template>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAutoLabel = false">取 消</el-button>
        <el-button type="primary" @click="autoLabel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// .vue
// node_modules
import { cloneDeep } from 'lodash'
import { fabric } from 'fabric'
// utils
import { success, warning } from '@/assets/utils/message'
import models from '@/assets/utils/typeList.js'
import { error } from '../../../assets/utils/message'

export default {
  name: 'carrousel',
  props: { imgList: Array, imgListUpload: Array, treeData: Array, duringDisdinguish: Boolean, marked: Number, markTotal: Number },
  components: {},
  data() {
    return {
      depthCode: '',
      curImgIndex: 0,
      curImgObj: null,
      canvasObj: null,
      // 撤销记录
      undoRecords: [
        // {
        //   operation: '', // del 或 add
        //   obj: null, // 上一个操作对象(删除或者绘制)
        // },
      ],
      // 用于绘制过程中不断更新当前obj
      drawingObject: null,
      // 有框被选中
      // frameSelected: false,
      selectedObject: null,
      selectedIsManual: false,
      // >>> element-props
      // 只使用当前选中专业
      initDisabled: false,
      // tabs绑定
      tabsData: [
        {
          label: '输电',
          name: 'transmission',
          spell: 'shudian',
        },
        {
          label: '变电',
          name: 'substation',
          spell: 'biandian',
        },
        {
          label: '配网',
          name: 'distributionNetwork',
          spell: 'peiwang',
        },
      ],
      curTab: 'transmission',
      checkAll: false,
      isIndeterminate: false,
      checkedTypeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'categoryName',
      },
      // 互斥
      mutualExclusion: {
        bdcjList: ['bdcj'],
        otherList: ['silicone', 'doorAbnormal', 'meterAbnormal'],
        bdcjChecked: false,
        otherChecked: false,
      },
      labelName: '',
      labelCode: '',
      // <<< element-props
      scale: {
        X: '',
        Y: '',
      },
      // 手动画框坐标
      mouse: {
        from: {
          x: 0,
          y: 0,
        },
        to: {
          x: 0,
          y: 0,
        },
      },
      // 手动画框热键
      hotKey: {
        value: 'Shift',
        disabledValue: '鼠标右键',
      },
      // flags
      is: {
        // shift+右键判断
        keydown: false,
        pressHotKey: false,
        // 在拖动
        doDrawing: false,
        // 手动标注状态
        manualMark: false,
      },
      showAutoLabel: false,
      // canvas样式
      styles: {
        manualFrameColor: '#079DFB',
        autoFrameColor: 'rgb(53,226,135)',
        drawWidth: 2,
        selectedStroke: '#e80000',
        transparentFill: 'rgba(255,255,255,0)',
      },
    }
  },
  methods: {
    keepCurLabel() {
      let marks = cloneDeep(this.canvasObj._objects)
      marks.shift()
      if (this.imgList.length === 0) {
        warning('已上传数据不能为空')
        return
      } else if (marks.length === 0) {
        warning('标注不能为空')
        return
      } else {
        let hasNoDescribe = marks.findIndex(i => {
          return !i._objects
        })
        if (hasNoDescribe > -1) {
          warning('缺陷描述不能为空')
          return
        }
      }
      let arr = []
      marks.map((group, index) => {
        let item = group.item
        arr.push({
          conf: item.conf,
          defectName: item.defectName,
          defectCode: item.defectCode,
          x1: item.x1,
          x2: item.x2,
          y1: item.y1,
          y2: item.y2,
        })
      })
      // 最后一项
      if (this.curImgIndex === this.imgList.length - 1) {
        this.curImgIndex--
      }
      this.$emit('keepLabel', {
        falseAlarmDtoList: arr,
        imgId: String(this.curImgObj.imgId),
        identifyImgId: String(this.curImgObj.identifyImgId),
      })
    },
    // 智能标注
    autoLabel() {
      this.showAutoLabel = false
      if (this.imgList.length === 0) {
        warning('当前无数据')
        return
      }
      let name = this.tabsData.find(i => i.name === this.$parent.activeType).spell
      // console.log(name)
      if (this.checkedTypeList.length === 0) {
        warning('请选择识别类型')
        return false
      }
      this.$emit('startDisdinguish', { modelList: this.checkedTypeList, modelType: name })
    },
    // 全选
    handleCheckAllChange(val) {
      let checkedList
      if (val) {
        checkedList = this.allModel[this.curTab].reduce((pre, cur) => {
          if (cur.Detect_type !== 'bdcj') pre.push(cur.Detect_type)
          return pre
        }, [])
      } else {
        checkedList = []
      }
      this.checkedTypeList = val ? checkedList : []
      this.isIndeterminate = false
    },
    handleCheckedListChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.allModel[this.curTab].length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allModel[this.curTab].length
    },
    // 点击树状分类节点
    handleNodeClick(data, node, el) {
      if (this.selectedIsManual) {
        this.labelName = data.categoryName
        this.labelCode = data.categoryName === '其他*' ? 'other' : 'manual'
        this.drawManualFrame()
      } else {
        warning('请选择手动标注框')
      }
    },
    // 标签输入框内容改变
    labelNameChange() {
      this.labelCode = 'other'
      this.drawManualFrame()
    },
    clickImg(index) {
      this.curImgIndex = index
    },
    // >>> 工具栏(手动标注...)
    enableManual() {
      if (this.imgList.length === 0) {
        warning('当前无数据')
        return
      }
      this.is.manualMark = !this.is.manualMark
      if (this.is.manualMark) {
        this.mouseEvent(this)
      } else {
        this.removeMouseEvent()
      }
    },
    delMark() {
      if (!this.selectedObject) {
        warning('请选中要删除的标注框')
        return false
      }
      // console.log(this.selectedObject)
      this.$confirm('确认删除该标注框?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.canvasDeSelect(this.selectedObject)
          this.undoRecords.unshift({
            operation: 'del',
            obj: cloneDeep(this.selectedObject),
          })
          this.canvasObj.remove(this.selectedObject)
          // console.log(this.selectedObject, this.canvasObj)
        })
        .catch(() => {})
    },
    // undoRecords_add(operation, obj) {
    //   this.undoRecords.unshift({
    //     operation,
    //     obj,
    //   })
    // },
    undoRecords_remove(obj) {
      this.undoRecords = this.undoRecords.filter(i => {
        if (i.operation === 'add') {
          return !(i.obj.left === obj.left && i.obj.top === obj.top && i.obj.height === obj.height && i.obj.width === obj.width)
        } else {
          return i
        }
      })
    },
    // 撤销功能逻辑:
    //    新增和删除操作都会被记录到"撤销记录"里
    //    1. 同一个标注框只记录最后一次操作; 例：绘制标注框、删除该标注框, 只能撤销删除操作;
    //       原因：记录删除操作时, 把操作的对象深拷贝了一份, 源对象置为null,
    //       故一个标注框, 最多撤销其删除操作, 不能撤销到删除之前的绘制操作, 撤销绘制操作需要源对象(null)
    //    2. 给手动框新增标签名, 将不再撤销该手动框的绘制操作(从"撤销记录"中删除)。
    undoOperation() {
      // console.log(this.undoRecords)
      if (this.undoRecords.length === 0) {
        warning('没有需要撤销的操作')
        return false
      }
      let undoObj = this.undoRecords[0]
      if (undoObj.operation === 'add') {
        this.canvasObj.remove(undoObj.obj)
      } else if (undoObj.operation === 'del') {
        this.canvasObj.add(undoObj.obj)
        this.canvasObj.renderAll()
      }
      this.undoRecords.shift()
    },
    imgAdapt() {
      this.canvasObj.setZoom(1)
      this.canvasObj.zoomToPoint(new fabric.Point(0, 0), 1)
      this.canvasObj.absolutePan({
        x: 0,
        y: 0,
      })
      this.canvasObj.discardActiveObject()
    },
    // <<<
    // >>> 切换
    prev() {
      if (this.imgList.length === 0) {
        warning('当前无数据')
        return
      }
      let idx = this.curImgIndex - 1
      if (idx < 0) {
        warning('当前是第一张')
        return false
      }
      this.curImgIndex = idx
    },
    next() {
      if (this.imgList.length === 0) {
        warning('当前无数据')
        return
      }
      let idx = this.curImgIndex + 1
      if (idx >= this.imgList.length) {
        warning('当前是最后一张')
        return false
      }
      this.curImgIndex = idx
    },
    // <<<
    // >>> mouseEvent 鼠标事件
    keydown(e) {
      if (e.key === this.hotKey.value) {
        // console.log('keydown')
        this.is.keydown = true
      }
    },
    keyup(e) {
      this.is.keydown = false
    },
    mouseEvent(_this) {
      _this.keydown = _this.keydown.bind(_this)
      _this.keyup = _this.keyup.bind(_this)
      document.addEventListener('keydown', _this.keydown, false)
      document.addEventListener('keyup', _this.keyup, false)
      let upperCanvas = document.getElementsByClassName('upper-canvas')[0]
      upperCanvas.onmousedown = function (e) {
        if (_this.canvasObj.getObjects().length > 0 && _this.is.keydown) {
          _this.is.pressHotKey = true
        } else {
          _this.is.pressHotKey = false
        }
        // console.log('onmousedown', _this.canvasObj.getPointer(e, false))
        // e.which(1左键、2中键、3右键)
        if (e.which === 3 && _this.is.pressHotKey) {
          _this.mouse.from.x = _this.canvasObj.getPointer(e, false).x
          _this.mouse.from.y = _this.canvasObj.getPointer(e, false).y
          _this.is.doDrawing = true
        }
      }
      upperCanvas.onmousemove = function (e) {
        if (e.which === 3 && _this.is.doDrawing) {
          // console.log('onmousemove', _this.canvasObj.getPointer(e, false))
          _this.mouse.to.x = _this.canvasObj.getPointer(e, false).x
          _this.mouse.to.y = _this.canvasObj.getPointer(e, false).y
          _this.canvasDrawing(e)
        }
      }
      upperCanvas.onmouseup = function (e) {
        // console.log('onmouseup', _this.canvasObj.getPointer(e, false))
        if (e.which === 3 && _this.is.pressHotKey) {
          _this.mouse.to.x = _this.canvasObj.getPointer(e, false).x
          _this.mouse.to.y = _this.canvasObj.getPointer(e, false).y
          _this.drawingObject = null
          _this.is.doDrawing = false
        }
      }
    },
    removeMouseEvent() {
      let upperCanvas = document.getElementsByClassName('upper-canvas')[0]
      // console.log(upperCanvas)
      document.removeEventListener('keydown', this.keydown, false)
      document.removeEventListener('keyup', this.keyup, false)
      upperCanvas.onmousedown = function () {}
      upperCanvas.onmousemove = function () {}
      upperCanvas.onmouseup = function () {}
    },
    // <<<
    // 绘制手动框
    drawManualFrame() {
      // 只有选中手动标注才生效
      if (this.selectedIsManual) {
        // 将labelName存入canvas对象手动标注框
        let newPathObj = cloneDeep(this.selectedObject)
        // 针对只有画框即PathObj
        if (!newPathObj.isManualGroup) {
          // 重置颜色
          newPathObj.stroke = this.styles.manualFrameColor
          newPathObj.isAutomatic = false
          const { height, left, top, width } = newPathObj
          let newTextObj = new fabric.Text(this.labelName, {
            left,
            top: top + height / 2,
            fontSize: 14,
            fill: this.styles.manualFrameColor,
            hasControls: false,
          })
          let item = {
            defectName: this.labelName,
            defectCode: this.labelCode,
            conf: 0,
            x1: (left / this.scale.X).toFixed(2),
            x2: ((left + width) / this.scale.X).toFixed(2),
            y1: (top / this.scale.Y).toFixed(2),
            y2: ((top + height) / this.scale.Y).toFixed(2),
          }
          let newGroup = new fabric.Group([newPathObj, newTextObj], {
            isManualGroup: true,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            item,
          })
          // 将该手动画框的记录移除
          this.undoRecords_remove(this.selectedObject)
          this.canvasObj.add(newGroup)
          this.canvasObj.remove(this.selectedObject)
        } else {
          // 针对手动画框组, 只改变_objects下的TextObj
          // 重置颜色
          this.canvasDeSelect(this.selectedObject)
          // 重置文本
          this.selectedObject.item.defectName = this.labelName
          this.selectedObject.item.defectCode = this.labelCode
          this.selectedObject._objects[1].set({ text: this.labelName, defectCode: this.labelCode })
          this.canvasObj.discardActiveObject()
          this.canvasObj.renderAll()
          // console.log(this.canvasObj._objects)
        }
        success('保存成功')
      }
    },
    // >>> canvas
    canvasInit() {
      // if (this.imgList.length === 0) {
      //   warning('当前无数据')
      //   return
      // }
      this.canvasObj = new fabric.Canvas('myCanvas', {
        isDrawingMode: false,
        // selectable: false,
        selection: false,
      })
      let canvasBox = document.getElementById('myCanvas-box')
      // console.log(canvasBox.clientWidth, canvasBox.clientHeight)
      this.canvasObj.setWidth(canvasBox.clientWidth)
      this.canvasObj.setHeight(canvasBox.clientHeight)
      this.canvasOn()
    },
    // 拖动绘制
    canvasDrawing(e) {
      if (this.is.manualMark === false) {
        return false
      }
      let canvasObject = null
      let left = this.mouse.from.x
      let top = this.mouse.from.y
      var path =
        'M ' +
        this.mouse.from.x +
        ' ' +
        this.mouse.from.y +
        'L ' +
        this.mouse.to.x +
        ' ' +
        this.mouse.from.y +
        'L ' +
        this.mouse.to.x +
        ' ' +
        this.mouse.to.y +
        'L ' +
        this.mouse.from.x +
        ' ' +
        this.mouse.to.y +
        'L ' +
        this.mouse.from.x +
        ' ' +
        this.mouse.from.y +
        ' z'
      canvasObject = new fabric.Path(path, {
        left: left,
        top: top,
        stroke: this.styles.manualFrameColor,
        strokeWidth: this.styles.drawWidth,
        fill: this.styles.transparentFill,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
      })

      if (this.drawingObject) {
        if (!this.drawingObject.isAutomatic) {
          this.canvasObj.remove(this.drawingObject)
        }
        this.undoRecords[0].obj = canvasObject
      } else {
        this.undoRecords.unshift({
          operation: 'add',
          obj: canvasObject,
        })
      }
      if (canvasObject) {
        this.canvasObj.add(canvasObject)
        this.canvasObj.renderAll()
        this.drawingObject = canvasObject
      }
    },
    // 绘制标注框
    canvasDrawLabelBox(_this) {
      if (!_this.curImgObj.identifyResultList) return false
      for (let item of _this.curImgObj.identifyResultList) {
        // 区别自动框和手动框
        if (item.x1 && item.x2 && item.y1 && item.y2) {
          let left = Number((Number(item.x1) * _this.scale.X).toFixed(2))
          let top = Number((Number(item.y1) * _this.scale.Y).toFixed(2))
          let width = ((Number(item.x2) - Number(item.x1)) * _this.scale.X).toFixed(2)
          let height = ((Number(item.y2) - Number(item.y1)) * _this.scale.X).toFixed(2)
          let path = `M ${left} ${top} L ${(Number(item.x2) * _this.scale.X).toFixed(2)} ${top} L ${(
            Number(item.x2) * _this.scale.X
          ).toFixed(2)} ${(Number(item.y2) * _this.scale.Y).toFixed(2)} L ${left} ${(Number(item.y2) * _this.scale.Y).toFixed(
            2
          )}  L ${left} ${top} z`
          // 标注框-边框
          let pathObj = new fabric.Path(path, {
            left: left,
            top: top,
            stroke: _this.styles.autoFrameColor,
            strokeWidth: _this.styles.drawWidth,
            fill: _this.styles.transparentFill,
            hasControls: false,
            isAutomatic: true,
            // identifyResultId: item.identifyResultId,
            // taskId: item.taskId,
          })
          // 标注框-缺陷描述
          let textObj = new fabric.Text(item.defectName, {
            left: left,
            top: top + Number((((Number(item.y2) - Number(item.y1)) / 2) * _this.scale.Y).toFixed(2)),
            fontSize: 14,
            fill: _this.styles.autoFrameColor,
            isAutomatic: true,
            hasControls: false,
          })
          // 合并对象
          let group = new fabric.Group([pathObj, textObj], {
            isAutomatic: true,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            item,
          })
          _this.canvasObj.add(group)
        }
      }
      setTimeout(() => {
        // console.log('当前canvasObj', _this.canvasObj)
        _this.canvasObj.renderAll()
      }, 0)
    },
    canvasImgLoad() {
      let img = new Image()
      const _this = this
      img.onload = function () {
        if (!_this.canvasObj) return
        let imgObj = new fabric.Image(img)
        // imgObj.originX = 'left'
        // imgObj.originY = 'top'
        // 计算比例
        _this.scale.X = _this.canvasObj.width / imgObj.width
        _this.scale.Y = _this.canvasObj.height / imgObj.height
        // 设置imgObj比例
        imgObj.set({
          scaleX: _this.scale.X,
          scaleY: _this.scale.Y,
          left: 0,
          top: 0,
          // imgObj的控件不显示，而且不能被操作
          hasControls: false,
          // 不能选择对象进行修改
          selectable: false,
          isAutomatic: true,
          isImg: true,
          zIndex: 1,
        })
        _this.canvasObj.add(imgObj)
        // 绘制标注框
        _this.canvasDrawLabelBox(_this)
      }
      img.onerror = function () {
        error('图片资源失效')
      }
      img.src = this.curImgObj.imgUrl
    },
    canvasSelect(target) {
      if (target._objects && !target.isManualGroup) {
        // 说明选中的是group, 第一项是框, 第二项是text
        this.selectedObject = target
        // this.selectedObject = target._objects[0]
        this.selectedIsManual = false
        this.labelName = target._objects[1].text
        for (let item of target._objects) {
          if (!item.isLabel) {
            item.set({
              fill: item.text ? this.styles.selectedStroke : this.styles.transparentFill,
              stroke: item.text ? null : this.styles.selectedStroke,
            })
          }
        }
      } else {
        // 选中的是手动标注框
        this.selectedObject = target
        // 该变量耗时严重
        this.selectedIsManual = true
        if (target.isManualGroup) {
          this.labelName = target._objects[1].text
          // 手动画框组
          for (let item of target._objects) {
            if (!item.isLabel) {
              item.set({
                fill: item.text ? this.styles.selectedStroke : this.styles.transparentFill,
                stroke: item.text ? null : this.styles.selectedStroke,
              })
            }
          }
        } else {
          this.labelName = ''
          // 手动画框
          target.set({
            fill: this.styles.transparentFill,
            stroke: this.styles.selectedStroke,
          })
        }
      }
    },
    canvasDeSelect(target) {
      if (target._objects && !target.isManualGroup) {
        for (let item of target._objects) {
          if (!item.isLabel) {
            item.set({
              fill: item.text ? this.styles.autoFrameColor : this.styles.transparentFill,
              stroke: item.text ? null : this.styles.autoFrameColor,
            })
          }
        }
      } else {
        if (target.isManualGroup) {
          // 手动画框组
          for (let item of target._objects) {
            if (!item.isLabel) {
              item.set({
                fill: item.text ? this.styles.manualFrameColor : this.styles.transparentFill,
                stroke: item.text ? null : this.styles.manualFrameColor,
              })
            }
          }
        } else {
          target.set({
            fill: this.styles.transparentFill,
            stroke: this.styles.manualFrameColor,
          })
        }
      }
    },
    canvasOn() {
      this.canvasObj.on({
        'mouse:wheel': opt => {
          // console.log('mouse:wheel', opt)
          var zoom = (opt.e.deltaY > 0 ? -0.1 : 0.1) + this.canvasObj.getZoom()
          zoom = Math.max(1, zoom)
          zoom = Math.min(3, zoom)
          var zoomPoint = new fabric.Point(opt.e.pageX, opt.e.pageY)
          this.canvasObj.zoomToPoint(zoomPoint, zoom)
          this.canvasObj.renderAll()
        },
        'mouse:down': o => {
          this.panning = true
          this.canvasObj.selection = false
        },
        'mouse:up': o => {
          this.panning = false
          this.canvasObj.selection = true
        },
        'mouse:move': o => {
          if (this.panning && o && o.e) {
            var delta = new fabric.Point(o.e.movementX, o.e.movementY)
            this.canvasObj.relativePan(delta)
          }
        },
        'object:moving': e => {
          e.target.opacity = 0.5
        },
        'object:added': e => {
          // canvasObj.add
          var object = e.target
          if (!this.controlFlag) {
            this.redo = []
          }
          this.controlFlag = false
        },
        'object:modified': e => {
          // console.log('object:modified', e)
          e.target.opacity = 1
          // var object = e.target
        },
        'selection:created': e => {
          const target = e.selected[0]
          console.log('selection:created', target)
          this.canvasSelect(target)
          this.canvasObj.renderAll()
        },
        'selection:updated': e => {
          const target = e.selected[0]
          const deselected = e.deselected[0]
          // console.log('selection:updated', e)
          this.canvasSelect(target)
          this.canvasDeSelect(deselected)
          this.canvasObj.renderAll()
        },
        'before:selection:cleared': e => {
          const target = e.target
          // console.log('before:selection:cleared')
          this.selectedObject = null
          this.selectedIsManual = false
          this.labelName = ''
          this.canvasDeSelect(target)
          this.canvasObj.renderAll()
        },
      })
    },
    canvasClear() {
      // 丢弃当前对象
      this.canvasObj.discardActiveObject()
      this.canvasObj.clear()
      this.selectedIsManual = false
      this.selectedObject = null
      this.labelName = ''
      this.undoRecords = []
      this.canvasObj.renderAll()
    },
  },
  computed: {
    allModel() {
      return models
    },
    curPercentage() {
      return this.markTotal === 0 ? 0 : Math.round((this.marked / this.markTotal) * 100)
    },
  },
  watch: {
    // 更新当前img
    imgList: {
      deep: true,
      handler(val, preval) {
        if (val.length > 0) {
          this.curImgObj = val[this.curImgIndex]
        }
      },
    },
    // 当前img更换, 清除之前的, 渲染新的
    curImgObj: {
      deep: true,
      handler(val) {
        if (val) {
          if (this.canvasObj) this.canvasClear()
          // img、标注框
          this.canvasImgLoad()
        }
      },
    },
    curImgIndex(val) {
      if (val >= 0 && val < this.imgList.length) {
        this.curImgObj = this.imgList[val]
      }
    },
    checkedTypeList: {
      deep: true,
      handler(val) {
        // console.log(val)
        if (val.includes('bdcj')) {
          this.mutualExclusion.bdcjChecked = true
        } else {
          this.mutualExclusion.bdcjChecked = false
        }
        if (val.includes('silicone') || val.includes('doorAbnormal') || val.includes('meterAbnormal')) {
          this.mutualExclusion.otherChecked = true
        } else if (!val.includes('silicone') && !val.includes('doorAbnormal') && !val.includes('meterAbnormal')) {
          this.mutualExclusion.otherChecked = false
        }
      },
    },
    // 只能标注弹框当前的类型
    curTab: {
      immediate: true,
      handler(val) {
        // 切换tab重置checkbox
        this.checkAll = false
        this.isIndeterminate = false
        this.checkedTypeList = []
        this.initDisabled = val !== this.$parent.activeType ? true : false
      },
    },
    showAutoLabel() {
      this.curTab = this.$parent.activeType
    },
  },
  created() {},
  mounted() {
    this.$nextTick(function () {
      this.canvasInit()
      setTimeout(() => {
        let _this = this
        fabric.util.addListener(this.canvasObj.upperCanvasEl, 'dblclick', function (e) {
          let canvas = _this.canvasObj
          let mouse = canvas.getPointer(e)
          // let active = canvas.getActiveObject()
          // console.log('mouse', mouse)
          // console.log('active', active)
          // console.log('objs', canvas.getObjects())
          let minimum = {
            area: 999999,
            _obj: null,
          }
          if (e.target) {
            let _targets = canvas.getObjects().filter(_obj => _obj.containsPoint(mouse) && !_obj.isImg)
            // console.log('_targets', _targets)
            for (let i in _targets) {
              let item = _targets[i]
              let area = item.width * item.height
              if (minimum.area > area) {
                minimum.area = area
                minimum._obj = item
              }
            }
          }
          // console.log(minimum)
          canvas.setActiveObject(minimum._obj)
        })
      }, 0)
    })
  },
}
</script>

<style lang="scss" scoped>
.carrousel {
  height: 100%;
  display: flex;
  // max-height: calc(100% - 52px);
  // overflow-y: auto;
  &__left {
    // 250px
    width: 13%;
    height: 100%;
    &__scrollView {
      height: calc(100% - 37px);
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
      .el-button {
        width: 70%;
      }
    }
  }
  &__mid {
    // 1327px
    width: 71%;
    max-width: 71%;
    overflow: hidden;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    &__header {
      height: 50px;
      .header__progress {
        width: 460px;
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
        .el-progress {
          // flex: 1;
          width: 340px;
          line-height: unset;
        }
      }
    }
    &__bigimg {
      // -header -progress -4px留白
      height: calc(100% - 50px - 26px - 4px);
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
    }
    &__progress {
      height: 26px;
      text-align: center;
      color: #666;
    }
  }
  &__right--labelTree {
    // 303px
    width: 16%;
    height: 100%;
    .carrousel__right__btn {
      .el-button {
        width: 60%;
      }
    }
  }
}

// 手动标注
.enableManualMark {
  color: #35e287;
}

// 色块
.colorBlock {
  width: 3px;
  height: 16px;
  margin-bottom: -2px;
  background: #35e287;
}
// 居中
/deep/ .canvas-container {
  margin: 0 auto;
}
// 轮播
.imgbox {
  height: 100%;
  &__item {
    height: 155px;
    padding: 4px 7px 0 7px;
    border: 1px solid transparent;
    position: relative;
    &__img {
      width: 100%;
      height: 120px;
    }
    // 图片右下角小图标
    .icons {
      position: absolute;
      bottom: 25px;
      right: 8px;
      img {
        width: 18px;
        height: 18px;
      }
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

// tree
.tree-wrapper {
  height: calc(100% - 32px - 10px);
  background-color: #fff;
  .search {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .tree {
      height: calc(100% - 32px);
      max-height: calc(100% - 32px);
      overflow-y: auto;
    }
  }
}

.autoLabel-tabs {
  .el-checkbox {
    display: block;
    margin-bottom: 10px;
  }
}
</style>
