<template>
  <el-tabs :value="activeMark" @tab-click="tabClick">
    <el-tab-pane v-for="item in tabsList" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'tabsMark',
  components: {},
  data() {
    return {
      activeMark: 'all',
      tabsList: [
        {
          label: '全部',
          name: 'all',
        },
        {
          label: '未标注',
          name: 'unlabeled',
        },
        {
          label: '已标注',
          name: 'labeled',
        },
      ],
    }
  },
  methods: {
    tabClick(el) {
      this.activeMark = el.name
      this.$emit('getActiveMark', el.name)
    },
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
}
</script>

<style lang="scss" scoped>
.el-tabs {
  height: 48px;
  /deep/ .el-tabs__item {
    height: 48px;
    line-height: 48px;
  }
}
</style>
