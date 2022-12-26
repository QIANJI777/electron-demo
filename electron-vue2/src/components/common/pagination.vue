<template>
  <el-pagination
    class=""
    :page-size="pageSize"
    :total="total"
    :current-page="currentPage"
    @update:currentPage="$emit('update:currentPage', $event)"
    @current-change="$emit('currentChange', $event)"
    :layout="layout"
  ></el-pagination>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, jumper',
    },
  },
}
</script>

<style lang="scss" scoped></style>
