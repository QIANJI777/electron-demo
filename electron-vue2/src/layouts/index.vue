<template>
  <div class="wrapper">
    <div class="header-bar">
      <div class="header-bar__title">
        AI平台 {{ StateBuild_type === 'data_augment' ? '数据增广' : StateBuild_type === 'data_mark' ? '数据标注' : '数据筛选' }}
      </div>
      <div class="header-bar__icons">
        <img class="wh18 mr10 pointer" @click="minimize" src="../assets/images/topMenu/minimize.png" alt="" />
        <img class="wh14 mr10 pointer" @click="close" src="../assets/images/topMenu/close.png" alt="" />
      </div>
    </div>
    <top-menu></top-menu>
    <div class="main-cnt">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TopMenu from './topMenu/topMenu.vue'
import { mapGetters } from 'vuex'

const { ipc } = window

export default {
  name: 'Layout',
  components: { TopMenu },
  data() {
    return {
      fullScreen: false,
    }
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
  },
  computed: {
    ...mapGetters('user', ['StateBuild_type']),
  },
  watch: {},
  created() {
    ipc.on('mainWin-isMax', (e, isMax) => {
      this.fullScreen = isMax
    })
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
}
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
.main-cnt {
  height: calc(100% - 56px - 30px);
  // height: 100%;
}
</style>
