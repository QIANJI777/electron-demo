<template>
  <div
    class="login"
    :class="[StateBuild_type === 'data_augment' ? 'bg_augment' : StateBuild_type === 'data_mark' ? 'bg_mark' : 'bg_filter']"
  >
    <div class="header-bar">
      <div class="header-bar__title">
        AI平台 {{ StateBuild_type === 'data_augment' ? '数据增广' : StateBuild_type === 'data_mark' ? '数据标注' : '数据筛选' }}
      </div>
      <div class="header-bar__icons">
        <img class="wh18 mr10 pointer" @click="minimize" src="../../assets/images/topMenu/minimize.png" alt="" />
        <img class="wh14 mr10 pointer" @click="close" src="../../assets/images/topMenu/close.png" alt="" />
      </div>
    </div>
    <div class="content">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="login-title">
          <div class="chn">
            {{ StateBuild_type === 'data_augment' ? '数据增广' : StateBuild_type === 'data_mark' ? '数据标注' : '数据筛选' }}
          </div>
          <div class="eng">
            {{
              StateBuild_type === 'data_augment'
                ? 'Data augmentation'
                : StateBuild_type === 'data_mark'
                ? 'Data Annotations'
                : 'Data filtering'
            }}
          </div>
        </div>
        <span class="title1">登录</span>
        <el-form-item prop="username">
          <el-input
            class="acount"
            prefix-icon="el-icon-user"
            placeholder="请输入账号"
            ref="mobile"
            v-model="loginForm.username"
            name="mobile"
            type="text"
            tabindex="1"
            auto-complete="on"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="pwd"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
            ref="password"
            v-model="loginForm.password"
            name="password"
            type="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" style="margin-top: 20px">记住密码</el-checkbox>
        <div>
          <el-button type="primary" class="save-btn" @click="login" round :disabled="loading">{{
            loading ? '正在登录...' : '立即登录'
          }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/service/modules/login.js'
import { setToken } from '@/assets/utils/userAccount.js'
import { mapGetters } from 'vuex'
const { ipc } = window
export default {
  name: 'login',
  data() {
    return {
      fullScreen: false,
      loading: false,
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
      },
      checked: false,
    }
  },
  computed: {
    ...mapGetters('user', ['StateBuild_type']),
  },
  methods: {
    minimize() {
      ipc.send('topBarEvents', { eventName: 'minimize' })
    },
    maximize() {
      ipc.send('topBarEvents', { eventName: 'maximize' })
    },
    close() {
      ipc.send('topBarEvents', { eventName: 'close' })
    },
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let loginInfo = { username: window.btoa(this.loginForm.username), password: window.btoa(this.loginForm.password) }
          login(loginInfo)
            .then(async res => {
              if (res.code === 'SUCCESS') {
                setToken(res.data)
                localStorage.setItem('rememberAccount', this.checked)
                if (this.checked) {
                  localStorage.setItem('userAccount', window.btoa(JSON.stringify(this.loginForm)))
                } else {
                  localStorage.removeItem('userAccount')
                }
                this.loading = false
                this.$router.push('/dataManage')
              }
            })
            .catch(err => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
  created() {
    ipc.on('mainWin-isMax', (e, isMax) => {
      this.fullScreen = isMax
    })
  },
  mounted() {
    this.$nextTick(function () {
      if (localStorage.getItem('rememberAccount') && localStorage.getItem('rememberAccount') == 'true') {
        this.loginForm = JSON.parse(window.atob(localStorage.getItem('userAccount')))
        this.checked = true
      } else {
        this.loginForm = {
          username: '',
          password: '',
        }
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.bg_augment {
  background: url('../../assets/images/login_bgs/bg_augment.png') center center no-repeat;
}
.bg_mark {
  background: url('../../assets/images/login_bgs/bg_mark.png') center center no-repeat;
}
.bg_filter {
  background: url('../../assets/images/login_bgs/bg_filter.png') center center no-repeat;
}
.login {
  width: 100%;
  height: 100%;
  background-size: cover;
  .content {
    width: 100%;
    height: calc(100% - 30px);
    position: relative;
    .login-form {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 380px;
      height: 480px;
      padding: 50px 30px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0px 0px 48px 0px rgba(0, 0, 0, 0.08);
      /deep/ .el-input {
        margin-top: 50px;
        border-bottom: 1px solid #d8d8d8;
        .el-input__inner {
          border: none;
        }
        .el-icon-user,
        .el-icon-lock {
          color: #35e287;
        }
      }
      /deep/ .el-form-item {
        margin-bottom: 2px;
      }
    }
    .save-btn {
      color: #fff;
      background-color: #35e287;
      width: 320px;
      margin-top: 30px;
      line-height: 18px;
      font-size: 16px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.16);
    }
  }
}

.login-title {
  text-align: center;
  .chn {
    font-family: '.PingFang SC Medium';
    font-weight: 500;
    font-size: 28px;
    letter-spacing: 0.15em;
    line-height: 39px;
    color: #000;
  }
  .eng {
    font-family: 'Microsoft Tai Le';
    font-weight: 400;
    font-size: 12px;
    line-height: 26px;
    color: #000;
  }
}

// header
.header-bar {
  -webkit-app-region: drag;
  padding: 0 5px;
  height: 30px;
  background-image: radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 10%, rgba(229, 229, 229, 0.9) 100%);
  position: relative;
  &__title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__icons {
    -webkit-app-region: no-drag;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
