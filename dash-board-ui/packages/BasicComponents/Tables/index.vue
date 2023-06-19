<template>
  <div
    style="width: 100%;height: 100%"
    class="db-design-wrap "
  >
    <!-- :border="this.config.customize.border" -->
    <el-table
      :id="config.code"
      :key="updateKey"
      :ref="config.code"
      class="custom-table"
      height="100%"
      :stripe="config.customize.stripe"
      :data="config.option.tableData"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        v-for="(col, index) in config.option.columnData"
        :key="index"
        show-overflow-tooltip
        :label="col.remark"
        :prop="col.alias"
        align="center"
      />
    </el-table>
  </div>
</template>
<script>
import commonMixins from 'packages/js/mixins/commonMixins'
import paramsMixins from 'packages/js/mixins/paramsMixins'
import linkageMixins from 'packages/js/mixins/linkageMixins'
export default {
  name: 'TableChart',
  mixins: [paramsMixins, commonMixins, linkageMixins],
  props: {
    id: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      updateKey: 0
    }
  },
  computed: {
    headerCellStyle () {
      if (document.getElementById(this.config.code)?.querySelector('tr')) {
        document
          .getElementById(this.config.code)
          .querySelector('tr').style.backgroundColor = this.config.customize.headerBackgroundColor || '#fafafa'
      }
      const style = {
        height: this.config.customize.headerHeight + 'px' || '38px',
        borderBottom: 'solid 2px #007aff',
        backgroundColor: this.config.customize.headerBackgroundColor || '',
        color: this.config.customize.headerFontColor || '#909399',
        fontSize: this.config.customize.headerFontSize + 'px' || '14px'
      }
      return style
    },
    cellStyle () {
      const style = {
        backgroundColor: this.config.customize.bodyBackgroundColor || (this.config.customize.evenRowBackgroundColor || this.config.customize.oddRowBackgroundColor ? 'transparent' : '#fff'),
        color: this.config.customize.bodyFontColor || '#606266',
        fontSize: this.config.customize.bodyFontSize + 'px' || '14px',
        border: `solid 1px ${this.config.customize.bodyBackgroundColor || 'transparent'}`
      }
      return style
    }
  },
  created () {

  },
  mounted () {
    this.chartInit()
    if (this.config.customize.evenRowBackgroundColor && !this.config.customize.oddRowBackgroundColor) {
      this.config.customize.oddRowBackgroundColor = this.config.customize.bodyBackgroundColor
      this.config.customize.bodyBackgroundColor = ''
    } else if (!this.config.customize.evenRowBackgroundColor && this.config.customize.oddRowBackgroundColor) {
      this.config.customize.evenRowBackgroundColor = this.config.customize.bodyBackgroundColor
      this.config.customize.bodyBackgroundColor = ''
    } else if (!(!this.config.customize.evenRowBackgroundColor && !this.config.customize.oddRowBackgroundColor)) {
      this.config.customize.bodyBackgroundColor = ''
    }
    this.tableRowStyle()
  },
  methods: {
    // 表格行样式
    tableRowClassName ({ row, rowIndex }) {
      this.tableRowStyle()
      return rowIndex % 2 === 0 ? `even-row${this.config.code}` : `odd-row${this.config.code}`
    },
    // 表格行样式
    tableRowStyle () {
      window.requestAnimationFrame(() => {
        document.querySelectorAll(`.even-row${this.config.code}`).forEach(node => {
          node.style.backgroundColor = this.config.customize.evenRowBackgroundColor
        })
        document.querySelectorAll(`.odd-row${this.config.code}`).forEach(node => {
          node.style.backgroundColor = this.config.customize.oddRowBackgroundColor
        })
      })
    },
    buildOption (config, data) {
      config.option.tableData = data?.data
      const filteredData = {}
      const columnData = data?.columnData || {}
      if (config.dataSource.dimensionFieldList && config.dataSource.dimensionFieldList.length > 0) {
        Object?.keys(columnData).forEach(key => {
          if (
            config.dataSource.dimensionFieldList.includes(columnData[key].alias)
          ) {
            filteredData[key] = columnData[key]
          }
        })
        config.option.columnData = filteredData
      } else {
        config.option.columnData = columnData
      }
      return config
    },
    updateData () {
      this.getCurrentOption().then(({ data, config }) => {
        if (data.success) {
          this.config.option.tableData = data?.data
          this.config.option.columnData = data?.columnData || {}
          this.$refs[config.code].doLayout()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~packages/assets/style/chartStyle.scss';

::v-deep .el-table {
  height: 100%;
  background-color: transparent;
}
::v-deep .el-table tr {
  background-color: transparent;
}

::v-deep .el-table__body {
  height: 100%;
}

::v-deep .el-table .el-table__header tr {
  background-color: transparent;
}

::v-deep tr.el-table__row--striped {
  z-index: 1;
  /*将容器的 z-index 设为 1，以便其在蒙版之上*/
  position: relative;
  /*设置容器为相对定位*/
  opacity: 0.9;
}

::v-deep tr.el-table__row--striped::before {
  position: absolute;
  /*设置蒙版为绝对定位*/
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  /*设置半透明的灰色背景色*/
  z-index: 2;
  /*将蒙版的 z-index 设为 2，以便其覆盖在容器之上*/
}

::v-deep .overlay {
  position: absolute;
  /*设置蒙版为绝对定位*/
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2) !important;
  /*设置半透明的灰色背景色*/
  z-index: 2;
  /*将蒙版的 z-index 设为 2，以便其覆盖在容器之上*/
}

::v-deep .cell.el-tooltip {
  z-index: 3;
  min-width: 50px;
  white-space: nowrap;
  position: inherit;
}

::v-deep .el-table {
  .el-table__cell {
    border-bottom: none !important;
  }

  &:before {
    display: none !important;
  }

  th.gutter,
  colgroup.gutter {
    width: 0px !important; //此处的宽度值，对应你自定义滚动条的宽度即可
  }
}

// 关键css代码
::v-deep .el-table__header colgroup col[name="gutter"] {
  display: table-cell !important;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 10px; // 横向滚动条
  height: 10px; // 纵向滚动条 必写
  background-color: transparent;
}

// 滚动条的滑块
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #9093994D;
  border-radius: 5px;

  &:hover {
    background-color: #90939980;
  }
}
</style>
