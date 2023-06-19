<template>
  <el-dialog
    title="新增"
    :visible.sync="setTypeVisible"
    width="800px"
    :before-close="handleClose"
    :append-to-body="true"
    :close-on-click-modal="false"
    class="db-dialog-wrap db-el-dialog"
  >
    <div class="type-wrap">
      <el-row :gutter="20">
        <el-col
          v-if="dsType.includes('original')"
          :span="spanNum"
        >
          <el-card
            class="db-el-card"
            shadow="hover"
          >
            <div
              class="type-item"
              @click="typeChose('original')"
            >
              原始数据集
            </div>
          </el-card>
        </el-col>
        <el-col
          v-if="dsType.includes('custom')"
          :span="spanNum"
        >
          <el-card
            class="db-el-card"
            shadow="hover"
          >
            <div
              class="type-item"
              @click="typeChose('custom')"
            >
              自助数据集
            </div>
          </el-card>
        </el-col>
        <el-col
          v-if="dsType.includes('storedProcedure')"
          :span="spanNum"
        >
          <el-card
            class="db-el-card"
            shadow="hover"
          >
            <div
              class="type-item"
              @click="typeChose('storedProcedure')"
            >
              存储过程数据集
            </div>
          </el-card>
        </el-col>
        <el-col
          v-if="dsType.includes('json')"
          :span="spanNum"
        >
          <el-card
            class="db-el-card"
            shadow="hover"
          >
            <div
              class="type-item"
              @click="typeChose('json')"
            >
              JSON数据集
            </div>
          </el-card>
        </el-col>
        <el-col
          v-if="dsType.includes('script')"
          :span="spanNum"
        >
          <el-card
            class="db-el-card"
            shadow="hover"
          >
            <div
              class="type-item"
              @click="typeChose('script')"
            >
              脚本数据集
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
    dsType: {
      type: Array,
      default: () => (['original', 'custom', 'storedProcedure', 'json', 'script'])
    }
  },
  data () {
    return {
      spanNum: 8,
      setTypeVisible: false
    }
  },
  created () {
    // eslint-disable-next-line eqeqeq
    if (this.dsType.length == 1) this.spanNum = 24
    if ([2, 4].includes(this.dsType.length)) this.spanNum = 12
    if ([3, 5, 6].includes(this.dsType.length)) this.spanNum = 8
  },
  methods: {
    handleClose () {
      this.setTypeVisible = false
    },
    // 选择新增类型
    typeChose (type) {
      this.setTypeVisible = false
      this.$emit('setDatasetOfType', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.type-item {
  height: 104px;
  line-height: 90px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: relative;
  color: var(--db-el-text);
  p {
    position: absolute;
    width: 100%;
    bottom: 20px;
    font-size: 14px;
    line-height: 16px;
    color: #909399;
  }
  &:hover{
      color: var(--db-el-color-primary);
    }
}
/deep/ .el-dialog__body {
  min-height: 130px !important;
}
.el-col {
  margin-bottom: 10px;
}
</style>
