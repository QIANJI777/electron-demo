<template>
  <div class="tree-wrapper">
    <div class="search ptb10 plr16">
      <div class="input--filter">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      </div>
      <div class="tree mt16">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="categoryId"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          class="filter-tree"
          default-expand-all
          :highlight-current="true"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <el-image v-if="build_type === 'data_filter'" :src="iconFolder" class="folder"></el-image>
            <span>{{ data.categoryName }}</span>
            <i
              v-if="data.parentId == '-1' && build_type === 'data_filter'"
              class="iconfont icon-export pointer"
              @click.stop="folderExpt(data.categoryName)"
            ></i>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
// node_modules
import { mapGetters } from 'vuex'
export default {
  name: 'tree',
  props: {
    treeData: Array,
    build_type: String,
  },
  data() {
    return {
      iconFolder: require('@/assets/images/icon-folder.png'),
      labelName: '',
      filterText: '',
      defaultProps: {
        children: 'childrenList',
        label: 'categoryName',
      },
      slectOrg: '',
    }
  },
  computed: {
    ...mapGetters('user', ['StateOrgList', 'StateCurOrg']),
  },
  watch: {
    slectOrg: {
      deep: true,
      handler(val) {
        let org = this.StateOrgList.find(item => item.partyCode === val)
        this.$store.commit('user/setCurOrg', org)
      },
    },
    treeData: {
      deep: true,
      handler(val) {
        if (val && val.length > 0) {
          this.$nextTick(function () {
            // 初始选中树状分类第一项
            this.$refs.tree.setCurrentKey(val[0].categoryId)
          })
        }
      },
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    folderExpt(categoryName) {
      this.$emit('folderExpt', categoryName)
    },
    handleNodeClick(data, node, el) {
      // console.log(data.depthCode)
      this.$emit('nodeClick', data)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.categoryName.indexOf(value) !== -1
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
.tree-wrapper {
  height: 100%;
  background-color: #fff;
  .organization {
    white-space: nowrap !important;
    border-bottom: 1px solid #f4f4f4;
  }
  .search {
    // height: calc(100% - 48px);
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
.h100 {
  height: 100% !important;
}
/deep/ .custom-tree-node {
  height: 100%;
  line-height: 1.625rem;
  flex: 1;
  .icon-export {
    float: right;
    margin-right: 10px;
    color: #ffcc66;
  }
  .icon-export:hover {
    color: #000;
    // color: #ffcc66;
  }
}
.folder {
  width: 14px;
  height: 14px;
  margin-right: 3px;
}
</style>
