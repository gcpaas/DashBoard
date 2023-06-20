<template>
  <div
    id="box"
    class="db-container"
    @mousemove="mousemoveOnBox"
    @mouseup="mouseupOnBox"
  >
    <el-row
      v-show="setType === null"
      type="flex"
      class="layout"
    >
      <div
        id="left-box"
        class="left-box"
        :style="{ 'transition': transition + 's' }"
      >
        <div class="inner-container">
          <TypeTree
            ref="datasetsTypeTree"
            :ds-type="dsType"
            :app-code="appCode"
            @nodeClick="nodeClick"
            @refreshData="refreshData"
            @expandedNodes="expandedNodes"
            @reCategory="getTreeList"
          />
        </div>
      </div>
      <div
        class="right-box inner-container"
        :style="{ 'transition': transition + 's' }"
      >
        <div
          id="resize"
          class="resize  pack-up-box"
          @mousedown="mousedown"
          @mouseup="mouseup"
          @mousemove="mousemove"
        >
          <a
            v-if="isPackUpTree"
            @click="packUpTree"
            @mousedown="resize = null"
            @mouseup="resize = null"
            @mousemove="resize = null"
          >
            <i :class="isPackUpTree === false ? 'el-icon-caret-left' : 'el-icon-caret-right'" />
          </a>
          <a
            v-else
            class="visible-pack-up"
          >
            <span>||</span>
          </a>
        </div>
        <el-form
          ref="queryForm"
          :model="queryForm"
          class="filter-container"
          @submit.native.prevent
        >
          <el-form-item
            class="filter-item"
            prop="name"
          >
            <el-input
              v-model="queryForm.name"
              class="db-el-input"
              placeholder="请输入数据集名称"
              clearable
              @keyup.enter.native="handleSearch()"
              @clear="handleSearch()"
            />
          </el-form-item>
          <el-form-item class="filter-item">
            <el-button
              :loading="dataListLoading"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch()"
            >
              查询
            </el-button>
          </el-form-item>
          <el-form-item class="filter-item">
            <el-button
              class="db-el-button-default"
              @click="addDataset"
            >
              新增
            </el-button>
          </el-form-item>
        </el-form>
        <div class="db-table-box">
          <el-table
            ref="userTable"
            v-table
            v-loading="dataListLoading"
            height="100%"
            class="db-el-table db-scrollbar"
            :element-loading-text="loadingText"
            :data="tableData"
            :header-cell-style="sortStyle"
            @sort-change="reSort"
            @current-change="handleCurrentChange"
            @select="selectDs"
            @select-all="selectAll"
          >
            <el-empty slot="empty" />
            <el-table-column
              v-if="isDialog && multiple"
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="数据集名称"
              align="left"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-radio
                  v-if="isDialog && !multiple"
                  v-model="curRow"
                  :label="scope.row"
                >
                  {{ scope.row.name }}
                </el-radio>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="datasetType"
              label="数据集类型"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-show="scope.row.datasetType === 'original'">原始数据集</span>
                <span v-show="scope.row.datasetType === 'custom'">自助数据集</span>
                <span v-show="scope.row.datasetType === 'storedProcedure'">存储过程数据集</span>
                <span v-show="scope.row.datasetType === 'json'">JSON数据集</span>
                <span v-show="scope.row.datasetType === 'dataModel'">数据模型数据集</span>
                <span v-show="scope.row.datasetType === 'script'">脚本数据集</span>
                <span v-show="scope.row.datasetType === 'api'">API数据集</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              align="left"
              show-overflow-tooltip
            />
            <!--操作栏-->
            <el-table-column
              label="操作"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  class="db-el-button-default"
                  :disabled="scope.row.editable === 1 && !appCode"
                  @click="toEdit(scope.row.id, scope.row.datasetType, scope.row.name, scope.row.typeId)"
                >
                  编辑
                </el-button>
                <el-button
                  class="db-el-button-default"
                  :disabled="scope.row.editable === 1 && !appCode"
                  @click="delDataset(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="db-pagination">
          <el-pagination
            class="db-el-pagination"
            popper-class="db-el-pagination"
            :current-page="current"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="size"
            :total="totalCount"
            background
            prev-text="上一页"
            next-text="下一页"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
          />
        </div>
      </div>
    </el-row>
    <!-- 新增-类型窗口 -->
    <DatasetTypeDialog
      ref="DatasetTypeDialog"
      :ds-type="dsType"
      @setDatasetOfType="setDatasetOfType"
    />
    <!-- 新增/编辑-原始数据集 -->
    <OriginalEditForm
      v-if="setType === 'original'"
      ref="OriginalEditForm"
      :dataset-id="datasetId"
      :dataset-name="datasetName"
      :type-id="typeId"
      :is-edit="isEdit"
      :app-code="appCode"
      @back="back"
    />
    <!-- 新增/编辑-自助数据集 -->
    <CustomEditForm
      v-if="setType === 'custom'"
      ref="CustomEditForm"
      :dataset-id="datasetId"
      :dataset-name="datasetName"
      :type-id="typeId"
      :is-edit="isEdit"
      :app-code="appCode"
      @back="back"
    />
    <!-- 新增/编辑-json数据集 -->
    <JsonEditForm
      v-if="setType === 'json'"
      ref="JsonEditForm"
      :dataset-id="datasetId"
      :dataset-name="datasetName"
      :type-id="typeId"
      :is-edit="isEdit"
      :app-code="appCode"
      @back="back"
    />
    <!-- 新增/编辑-存储过程数据集 -->
    <StoredProcedureEditForm
      v-if="setType === 'storedProcedure'"
      ref="StoredProcedureEditForm"
      :dataset-id="datasetId"
      :dataset-name="datasetName"
      :type-id="typeId"
      :is-edit="isEdit"
      :app-code="appCode"
      @back="back"
    />
    <!-- 新增/编辑-脚本数据集 -->
    <ScriptEditForm
      v-if="setType === 'script'"
      ref="ScriptEditForm"
      :dataset-id="datasetId"
      :dataset-name="datasetName"
      :type-id="typeId"
      :is-edit="isEdit"
      :app-code="appCode"
      @back="back"
    />
  </div>
</template>

<script>
import table from 'packages/js/utils/table.js'
import TypeTree from './TypeTree.vue'
import DatasetTypeDialog from './DatasetTypeDialog.vue'
import OriginalEditForm from './OriginalEditForm.vue'
import CustomEditForm from './CustomEditForm.vue'
import JsonEditForm from './JsonEditForm.vue'
import StoredProcedureEditForm from './StoredProcedureEditForm.vue'
import ScriptEditForm from './ScriptEditForm.vue'
import { datasetPage, datasetRemove } from 'packages/js/utils/datasetConfigService'
import { pageMixins } from 'packages/js/mixins/page'
export default {
  name: 'DataSetManagement',
  directives: {
    table // 注册自定义指令
  },
  components: {
    TypeTree,
    DatasetTypeDialog,
    OriginalEditForm,
    CustomEditForm,
    JsonEditForm,
    StoredProcedureEditForm,
    ScriptEditForm
  },
  mixins: [pageMixins],
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    dsValue: {
      type: [Array, Object],
      default: null
    },
    dsType: {
      type: Array,
      default: () => (['original', 'custom', 'storedProcedure', 'json', 'dataModel', 'script'])
    },
    appCode: {
      type: String,
      default: ''
    },
    isBorder: {
      type: Boolean,
      default: false
    }

  },
  data () {
    return {
      setType: null,
      isEdit: false,
      categoryData: [],
      tableData: [], // 表格数据
      queryForm: {
        name: '',
        datasetType: '',
        typeId: '' // 分类id
      }, // 查询条件
      isPackUpTree: false,
      transition: 0.1,
      loadingText: '正在加载数据',
      dataListLoading: false,
      leftBox: null,
      rightBox: null,
      startX: null,
      event: null,
      endX: null,
      resize: null,
      datasetId: '', // 数据集Id，用于详情与编辑
      datasetName: '', // 数据集名称
      typeId: '', // 详情typeId
      curRow: null,
      multipleSelection: []
    }
  },
  watch: {
    setType (value) {
      if (value === null) {
        this.datasetId = ''
        this.datasetName = ''
        this.isEdit = false
      }
    }
  },
  mounted () {
    this.init()
    if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
      // 当前浏览器为Safari浏览器
      // 执行相关操作
      document.addEventListener('mousemove', function (event) {
        if (event.buttons === 1) {
          event.preventDefault()
        }
      })
    }
  },
  methods: {
    toggleRowSelection () {
      this.$nextTick(() => {
        const dsIds = this.multipleSelection.map(ds => ds.id)
        this.$refs.userTable.clearSelection()
        this.tableData.forEach(item => {
          if (dsIds.includes(item.id)) {
            this.$refs.userTable.toggleRowSelection(item, true)
          }
        })
      })
    },
    // 全选
    selectAll (selection) {
      if (this.isDialog && this.multiple) {
        if (selection.length) {
          const dsIds = this.multipleSelection.map(ds => ds.id)
          selection.forEach(ds => {
            if (!dsIds.includes(ds.id)) {
              this.multipleSelection.push(ds)
            }
          })
        } else {
          this.tableData.forEach(row => {
            const dsIds = this.multipleSelection.map(ds => ds.id)
            const i = dsIds.indexOf(row.id)
            if (i > -1) this.multipleSelection.splice(i, 1)
          })
        }
      }
    },
    // 手动勾选
    selectDs (selection, row) {
      if (this.isDialog && this.multiple) {
        let dsIndex = null
        const ds = this.multipleSelection.find((ds, index) => {
          if (ds.id === row.id) {
            dsIndex = index
            return ds
          }
        })
        if (!ds) {
          this.multipleSelection.push(row)
        } else {
          this.multipleSelection.splice(dsIndex, 1)
        }
      }
    },
    // 获取选中数据集信息
    getSelectDs () {
      if (!this.isDialog) return
      if (this.multiple) {
        // 多选返回
        return this.multipleSelection
      } else {
        // 单选返回
        return this.curRow ? this.curRow : null
      }
    },
    // 单选数据集
    handleCurrentChange (currentRow) {
      this.curRow = currentRow
    },
    // 删除数据集
    delDataset (id) {
      this.$confirm('确定删除当前数据集吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      }).then(() => {
        datasetRemove(id).then(res => {
          this.init(false)
          this.$message.success('删除成功')
        })
      }).catch(() => {
      })
    },
    // 详情
    toPreview (id, type, name, typeId) {
      this.datasetId = id
      this.setType = type
      this.datasetName = name
      this.typeId = typeId
      this.isEdit = false
    },
    toEdit (id, type, name, typeId) {
      this.datasetId = id
      this.setType = type
      this.datasetName = name
      this.typeId = typeId
      this.isEdit = true
    },
    // 回到管理端
    back () {
      this.setType = null
      this.isEdit = false
    },
    // 新增数据集-类型
    setDatasetOfType (type) {
      this.setType = type
      this.typeId = this.queryForm.typeId
      this.isEdit = true
    },
    // 初始化
    init (temp = true) {
      if (temp) {
        this.getTreeList()
      }
      if (this.isDialog) {
        if (this.multiple) {
          this.multipleSelection = this.dsValue ? this.dsValue : []
        } else {
          this.curRow = this.dsValue
        }
      }
      this.current = 1
      this.getDataList()
    },
    // 新增数据集
    addDataset () {
      this.$refs.DatasetTypeDialog.setTypeVisible = true
    },
    selectChange () {
      this.getDataList()
    },
    getTreeList () {
    },
    // 获取表格数据
    getDataList () {
      this.dataListLoading = true
      datasetPage({
        current: this.current,
        size: this.size,
        moduleCode: this.appCode,
        ...this.queryForm
      }).then((data) => {
        this.tableData = data.list
        if (this.isDialog) {
          if (this.multiple && this.multipleSelection.length) {
            this.toggleRowSelection()
          } else if (this.curRow.id) {
            const ds = this.tableData.find(item => item.id === this.curRow.id)
            if (ds) this.curRow = ds
          }
        }
        this.totalCount = data.totalCount
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    expandedNodes (data) {
      if (data && data > 50) {
        this.transition = 0
      } else {
        this.transition = 0.1
      }
    },
    nodeClick (row, type) {
      this.current = 1
      if (type === 'group') {
        this.queryForm.typeId = row.id
        this.queryForm.datasetType = ''
      } else if (type === 'type') {
        this.queryForm.typeId = ''
        this.queryForm.datasetType = row
      }
      this.getDataList()
    },
    refreshData (node) {
      if (node && node.id === this.queryForm.typeId) {
        this.queryForm.typeId = ''
      }
      this.getDataList()
    },
    handleSearch () {
      this.current = 1
      this.queryForm.typeId = ''
      // 清除左侧机构树的选中状态
      this.$refs.datasetsTypeTree.ztreeObj.cancelSelectedNode()
      this.getDataList()
    },
    // 拖拽修改div宽度
    mousedown (e) {
      this.resize = document.getElementsByClassName('resize')[0]
      this.resize.left = document.getElementById('left-box').getBoundingClientRect().width
      this.leftBox = document.getElementsByClassName('left-box')[0]
      this.rightBox = document.getElementsByClassName('right-box')[0]
      this.startX = e.clientX
    },
    mousemove (e) {
      this.event = e
      if (this.resize) {
        const boxWidth = document.getElementById('box').getBoundingClientRect().width
        this.endX = e.clientX
        const offset = document.getElementById('box').getBoundingClientRect().left > 300 ? 0 : 25
        const moveLen = this.resize.left + (this.endX - this.startX) + offset
        this.leftBox.style.width = moveLen / boxWidth * 100 + '%'
        this.rightBox.style.width = ((1 - moveLen / boxWidth) * 100) + '%'
        this.isPackUpTree = false
        if (moveLen < 100 && this.endX - this.startX < 0) {
          this.isPackUpTree = true
          this.leftBox.style.width = '0%'
          this.rightBox.style.width = '100%'
        } else if (moveLen / boxWidth > 0.5) {
          this.leftBox.style.width = '50%'
          this.rightBox.style.width = '50%'
        }
      }
    },
    packUpTree () {
      this.$refs.datasetsTypeTree.expandedNodes()
      this.isPackUpTree = !this.isPackUpTree
      if (!this.isPackUpTree) {
        this.leftBox.style.width = '25%'
        this.rightBox.style.width = '75%'
      } else {
        this.leftBox.style.width = '0%'
        this.rightBox.style.width = '100%'
      }
    },
    mouseup () {
      if (this.resize) {
        this.resize = null
        if (this.endX < 350 && this.endX - this.startX > 0) {
          this.isPackUpTree = false
          this.leftBox.style.width = '25%'
          this.rightBox.style.width = '75%'
        }
      }
    },
    mousemoveOnBox (e) {
      this.mousemove(e)
    },
    mouseupOnBox () {
      this.resize = null
      if (this.endX < 350 && this.endX - this.startX > 0) {
        this.isPackUpTree = false
        this.leftBox.style.width = '25%'
        this.rightBox.style.width = '75%'
      }
      this.resize = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~packages/assets/style/bsTheme.scss';
@import '~packages/assets/style/zTree/treePackUp.scss';

// .db-pagination {
//   ::v-deep .el-input__inner {
//     width: 110px !important;
//     border:none;
//     background: var(--db-el-background-2);
//   }
// }

.db-container .inner-container .el-form .filter-item {
  /deep/ .el-input__inner {
    width: 200px;
  }
}

.right-box {
  margin-left: 20px;

  // ::v-deep .ztreeNodeMenu {
  //   ul {
  //     background-color: var(--db-background-1);
  //   }

  //   li:hover {
  //     background-color: var(--db-el-color-primary);
  //   }

  //   span {
  //     color: var(--db-el-text);
  //   }

  //   .triangle {
  //     background-color: var(--db-background-1) !important;
  //   }
  // }

}

::v-deep .left-tab-box {
  span {
    color: var(--db-el-text);
  }
}

::v-deep .left-tab-box ul li.tab-active {
  background-color: var(--db-el-background-3);
}

::v-deep .left-tab-box ul li:hover {
  background-color: var(--db-el-background-3);
}

.el-dialog {
  .db-container {
    max-height: calc(90vh - 236px) !important;

    .el-table {
      height: calc(90vh - 340px);
    }

    /deep/ .ztree {
      max-height: calc(90vh - 325px) !important;
    }

    /deep/ .el-tabs__item.is-active {
      border-bottom: none !important;
    }

  }

}

::v-deep .ztreeNodeMenu {
  ul {
    background-color: var(--db-background-1);
  }

  li:hover {
    background-color: var(--db-el-background-3);

    span {
      color: var(--db-el-color-primary);
    }
  }

  span {
    color: var(--db-el-text);
  }

  .triangle {
    background-color: var(--db-background-1) !important;
  }
}

.layout {
  width: 100%;
  height: 100%;
}

/deep/ .el-table__body-wrapper{
  max-height: 260px !important;
}
</style>
