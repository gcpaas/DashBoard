<template>
  <el-dialog
    title="新增"
    :visible.sync="dialogVisible"
    width="800px"
    :append-to-body="true"
    :close-on-click-modal="false"
    class="db-dialog-wrap db-el-dialog"
  >
    <div class="type-wrap">
      <el-row :gutter="20">
        <el-col
          v-for="dataset in datasetTypeList.filter(item =>item.datasetType !=='')"
          :key="dataset.datasetType"
          :span="8"
          :xs="24"
          :sm="12"
          :md="8"
          style="minWidth: 200px;"
        >
          <el-card
            class="db-el-card"
            shadow="hover"
          >
            <div
              class="type-item"
              @click="openAddForm(dataset.datasetType,dataset.componentName)"
            >
              <span>
                {{ dataset.name }}
              </span>
              <p>
                <span class="description">
                  {{ dataset.description }}
                </span>
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    datasetTypeList: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  created () {
    // eslint-disable-next-line eqeqeq
    // if (this.datasetTypeList.length == 1) this.spanNum = 24
    // if ([2, 4].includes(this.datasetTypeList.length)) this.spanNum = 12
    // if ([3, 5, 6].includes(this.datasetTypeList.length)) this.spanNum = 8
  },
  methods: {
    // 选择新增类型
    openAddForm (type, componentName) {
      this.dialogVisible = false
      this.$emit('openAddForm', type, componentName)
    }
  }
}
</script>

<style lang="scss" scoped>
.type-item {
  height: 104px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: relative;
  padding-top: 35px;
  color: var(--db-el-text);
  p {
    width: 100%;
    margin-top: 10px;
    font-size: 14px;
    line-height: 16px;
    color: #909399;
  }
  &:hover{
      color: var(--db-el-color-primary);
    }
}
::v-deep  .el-dialog__body {
  min-height: 130px !important;
}
.el-col {
  margin-bottom: 10px;
}
</style>
