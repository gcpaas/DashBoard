<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    title="数据集设置"
    :visible.sync="dataSetVisible"
    width="80%"
    class="db-dialog-wrap data-set-wrap db-el-dialog"
    :class="isUseSlot? 'tabHeight':'commonHeight'"
    @opened="openedInit"
  >
    <el-tabs
      v-if="isUseSlot"
      v-model="tabsActiveName"
      class="db-el-tabs"
      @tab-click="handleClickTabs"
    >
      <el-tab-pane
        label="数据集"
        name="dataSet"
      >
        <DataSetManagement
          ref="dataSetSetting"
          class="db-data-set-management"
          theme-class="db-"
          :is-border="true"
          :is-dialog="true"
          :ds-id="dataSetId"
          :multiple="multiple"
          :ds-value="DataDsValue"
        />
      </el-tab-pane>
      <slot
        name="dataSetSelect"
        :value="newDataDsValue"
      />
    </el-tabs>
    <DataSetManagement
      v-else
      ref="dataSetSetting"
      class="db-data-set-management"
      theme-class="db-"
      :is-border="true"
      :is-dialog="true"
      :ds-id="dataSetId"
      :multiple="multiple"
      :ds-value="DataDsValue"
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="db-el-button-default"
        @click="dataSetVisible = false"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="sure"
      >确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import DataSetManagement from 'dashPackages/DataSetManagement'
export default {
  name: 'DataSetSetting',
  components: { DataSetManagement },
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
    dsId: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    dsValue: {
      type: [Array, Object],
      default: () => ([])
    }
  },
  data () {
    return {
      dataSetVisible: false,
      dataSetId: null,
      tabsActiveName: 'dataSet',
      newDataDsValue: '',
      // 组件实例
      componentInstance: null,
      // 是否使用了插槽
      isUseSlot: false
    }
  },
  computed: {
    DataDsValue () {
      if (this.multiple) {
        return this.dsValue
      } else {
        return {
          id: this.dsId
        }
      }
    }
  },
  mounted () {
    this.dataSetId = this.dsId
    // 判断是否使用了插槽
    if (this.$scopedSlots && this.$scopedSlots.dataSetSelect && this.$scopedSlots.dataSetSelect()) {
      this.isUseSlot = true
    } else {
      this.isUseSlot = false
    }
  },
  methods: {
    openedInit () {
      // 将内置的组件实例赋值给componentInstance
      this.componentInstance = this.$refs.dataSetSetting
      this.newDataDsValue = this.DataDsValue
    },
    handleClickTabs (vueComponent, event) {
      this.componentInstance = vueComponent.$children[0]
    },
    sure () {
      this.dataSetVisible = false
      const getSelectDs = this.componentInstance.getSelectDs()
      if (Object.prototype.hasOwnProperty.call(getSelectDs, 'id')) {
        this.dataSetId = getSelectDs.id
      }
      this.$emit('getDsId', this.dataSetId)
      this.$emit('getSelectDs', getSelectDs)
    }
  }
}
</script>

<style lang="scss"></style>

<style lang="scss" scoped>
@import '../assets/style/bsTheme.scss';
::v-deep .el-tabs__header{
  margin-bottom: 0;
}

.commonHeight{
   /deep/ .el-dialog__body {
    min-height: 535px;
  }
}

.tabHeight{
   /deep/ .el-dialog__body {
    min-height: 575px;
  }
}

.data-set-wrap {
  /deep/ .el-dialog__body {
    position: relative;
    padding: 0 !important;
    // min-height: 575px;
    overflow: hidden;
  }

  ::v-deep .db-container {
    padding: 0;
    min-height: 535px;

    .el-table {
      max-height: calc(90vh - 350px);
    }
    .db-table-box {
      margin-bottom: 0px;
    }

    .ztree {
      max-height: none !important;
    }
  }

  .db-data-set-management {
    ::v-deep .db-container{
      margin-left: 0 !important;
    }
    ::v-deep .ztree {
      height: auto !important;
    }
     ::v-deep  .layout {
        position: absolute !important;
      }

    ::v-deep .db-table-box {
      height: auto !important;
    }

    ::v-deep .db-el-pagination {
      right: 6px !important;
    }

    // ::v-deep .data-set-scrollbar {
    //     height: 515px !important;
    // }
    ::v-deep .el-scrollbar{
       height: 515px !important;
    }
  }
}
</style>
