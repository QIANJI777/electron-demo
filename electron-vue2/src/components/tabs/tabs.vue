<template>
  <div class="tabBar plr20">
    <span v-if="$route.meta && $route.meta.title" class="tabBar-title">{{ $route.meta.title }}</span>
    <div class="tabBar-items ml40">
      <div
        class="tabBar-item"
        :class="activeType === item.en_name ? 'activeTab' : ''"
        v-for="item in tabsData"
        :key="item.key"
        @click="clickType(item.en_name)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  data() {
    return {
      activeType: 'transmission',
      tabsData: [
        {
          name: '输电专业',
          en_name: 'transmission',
          key: '2101',
        },
        {
          name: '变电专业',
          en_name: 'substation',
          key: '2102',
        },
        {
          name: '配网专业',
          en_name: 'distributionNetwork',
          key: '2103',
        },
      ],
    }
  },
  methods: {
    clickType(name) {
      this.activeType = name
      this.$emit('getActiveType', name)
    },
  },
}
</script>

<style lang="scss" scoped>
.tabBar {
  height: 64px;
  display: flex;
  align-items: center;
  background-color: #fff;
  &-title {
    font-size: 18px;
    color: #333;
    font-weight: bolder;
  }
  &-items {
    display: flex;
    border-radius: 3px;
    border: 1px solid #ddd;
    .tabBar-item {
      width: 88px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      border-left: 1px solid #ddd;
    }
    .tabBar-item:first-child {
      border-left: none;
    }
  }
}
.activeTab {
  background-color: #35e287;
  color: #fff;
}
</style>
