<template>
  <div class="header-menu">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      text-color="#fff"
      background-color="#2A2C36"
      active-text-color="#35E287"
      router
    >
      <div class="header-menu-left flex-ac pl20">
        <img v-if="StateBuild_type === 'data_augment'" src="@/assets/images/logo_augment.png" alt="" />
        <img v-if="StateBuild_type === 'data_mark'" src="@/assets/images/logo_mark.png" alt="" />
        <img v-if="StateBuild_type === 'data_filter'" src="@/assets/images/logo_filter.png" alt="" />
      </div>
      <div class="header-menu-middle" v-for="fst_route in routes.filter(i => !i.notInMenu)" :key="fst_route.path">
        <template v-if="fst_route.showChildren && fst_route.children">
          <div v-for="sec_route in fst_route.children" :key="sec_route.path">
            <el-submenu v-if="sec_route.showChildren && sec_route.children" :index="sec_route.path">
              <template slot="title">{{ sec_route.meta.title }}</template>
              <el-menu-item v-for="thd_route in sec_route.children" :key="thd_route.path" :index="thd_route.path">
                {{ thd_route.meta.title }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else class="menu-items" :index="sec_route.path">
              {{ sec_route.meta.title }}
            </el-menu-item>
          </div>
        </template>
      </div>
      <div class="header-menu-right pr20 pl40">
        <i class="iconfont icon-setting pointer mr20" @click="isShowSetting = true" v-if="StateBuild_type === 'data_filter'"></i>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <img class="mr10" src="@/assets/images/avatar.png" style="vertical-align: middle" />
            <span class="mr20">{{ StateUserInfo && StateUserInfo.fullname }}</span>
            <span>{{ StateUserInfo && StateUserInfo.orgName }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <!-- 面包屑导航 -->
    <!-- <el-breadcrumb separator="/" v-if="breadcrumbListData.length > 0 && breadcrumbListData[0].child">
      <el-breadcrumb-item :to="{ path: o.to || o.path }" :replace="true" v-for="o in breadcrumbListData" :key="o.id"
        >{{ o.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="sub-nav" v-if="breadcrumbListData.length > 0 && breadcrumbListData[0].child">
      <div class="nav-items">
        <div
          class="item"
          :class="{ active: defaultActive.indexOf(item.path) > -1 }"
          v-for="(item, index) in breadcrumbListData[0].child"
          :key="index"
          @click="jumpTo(item.path)"
        >
          {{ item.name }}
        </div>
      </div>
    </div> -->
    <el-dialog title="设置" width="35%" :visible.sync="isShowSetting">
      <div>自动分类置信度设置</div>
      <div>
        当图像识别置信度 ≥
        <el-input class="setting-input" type="number" v-model="confidence" @input="confidenceInput" />
        %时, 按识别结果分类图像
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowSetting = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { removeToken } from '@/assets/utils/userAccount.js'
export default {
  name: 'TopMenu',
  props: {},
  components: {},
  data() {
    return {
      activeIndex: '/dataManage',
      isShowSetting: false,
      confidence: 80,
    }
  },
  created() {
    this.confidence = Number(localStorage.getItem('confidence')) || 80
    this.activeIndex = this.$route.path
  },
  methods: {
    confidenceInput(val) {
      if (val > 100) {
        this.confidence = 100
      } else if (val < 0) {
        this.confidence = 0
      } else if (val.includes('.')) {
        this.confidence = val - (val % 1)
      } else {
        this.confidence = val
      }
    },
    confirm() {
      localStorage.setItem('confidence', this.confidence)
      this.isShowSetting = false
    },
    loginOut() {
      localStorage.removeItem('notFirstLogin')
      removeToken()
      this.$router.push('/login')
    },
  },
  computed: {
    routes() {
      // console.log(this.$router)
      return this.$router.options.routes || []
    },
    ...mapGetters('user', ['StateUserInfo', 'StateBuild_type']),
  },
}
</script>

<style lang="scss" scoped>
.header-menu {
  height: 56px;
  /deep/ .el-menu--horizontal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  &-left {
    height: 100%;
    width: 150px;
    img {
      height: 70%;
    }
  }
  &-middle {
    // width: 55%;
    height: 100%;
    display: flex;
    margin: auto;
    .menu-items {
      font-size: 15px;
    }
  }
  &-right {
    height: 36px;
    line-height: 36px;
    // width: 20%;
    text-align: right;
    color: #fff;
    img {
      width: 36px;
      height: 36px;
    }
    .el-dropdown-link {
      color: #fff;
      cursor: pointer;
    }
  }
}

// setting-input
.setting-input {
  -webkit-appearance: none;
  width: 55px;
  height: 30px;
  // outline: none;
  text-align: center;
}

//谷歌
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
