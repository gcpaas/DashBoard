<template>
  <div
    style="width: 100%;height: 100%"
    class="db-design-wrap "
    @touchstart='touchmove'
    @touchend='touchend'
  >
<!--    <lyzTable sticky style="width: 100%" :columns="columnData" :list="config.option.tableData">-->
<!--      <template slot="nodata">暂无数据</template>-->
<!--    </lyzTable>-->
    <Table
      :id="config.code"
      :ref="config.code"
      :class="{'scrollbar':isScrollbar,'notScrollbar':!isScrollbar}"
      height="100%"
      :stripe="config.customize.stripe"
      :data="config.option.tableData"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      :row-class-name="tableRowClassName"
    >
      <TableColumn
        v-for="(col, index) in columnData"
        :fixed="index===0"
        :key="index"
        show-overflow-tooltip
        :label="col.remark"
        :prop="col.alias"
        align="center"
      />
    </Table>
  </div>
</template>
<script>
import commonMixins from 'packages/js/mixins/commonMixins'
import paramsMixins from 'packages/js/mixins/paramsMixins'
import linkageMixins from 'packages/js/mixins/linkageMixins'
import { Table, TableColumn } from 'element-ui';
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
  components:{Table,TableColumn},
  data () {
    return {
      isScrollbar:false
    }
  },
  computed: {
    // 按照lyzTable的格式要求来处理列字段
    columnData(){
      let arr=[]
     for(let col in this.config.option.columnData) {
       arr.push({
         ...this.config.option.columnData[col]
       })
     }
     return arr
    },
    // columnData(){
    //   const arr = []
    //     const keyArr = Object.keys(this.config.option.columnData || {})
    //     keyArr.forEach((item,index)=>{
    //       arr.push({
    //         key:item,
    //         title:this.config.option.columnData[item].remark || item,
    //         fixed:index ? '' : 'left',
    //         style: { // 表头样式
    //           width: '100px',
    //           color: this.config.customize.headerFontColor || '#909399',
    //           textAlign: 'center',
    //           background:this.config.customize.headerBackgroundColor || '#FAFAFA',
    //           fontSize: this.config.customize.headerFontSize || 14,
    //         },
    //         columnStyle:{//表体样式
    //           width: '100px',
    //           background: this.config.customize.bodyBackgroundColor || '#fff',
    //           color: this.config.customize.bodyFontColor || '#606266',
    //           fontSize: this.config.customize.bodyFontSize || 14,
    //         }
    //       })
    //     })
    //   return arr
    // }
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
  created () { },
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
    touchmove(){
      this.isScrollbar = true
    },
    touchend(){
      this.isScrollbar = false
    },
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
      // this.$set(this.headerCellStyleObj, "backgroundColor", config.customize.headerBackgroundColor)
      return config
    }
  }
}
</script>

<style lang="scss" scoped>

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

 .notScrollbar /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 0; // 横向滚动条
    height: 0; // 纵向滚动条 必写
    background-color: transparent;
  }
  .scrollbar /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px; // 横向滚动条
    height: 4px; // 纵向滚动条 必写
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
  .db-design-wrap {
    overflow-y: auto;
  }
  /deep/.el-table__fixed::before{
    height: 0!important;
  }
</style>
