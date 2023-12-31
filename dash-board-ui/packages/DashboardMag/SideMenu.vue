<template>
  <div class="side-catalog-wrap">
    <el-scrollbar class="side-catalog-box">
      <div
        class="side-catalog-all side-catalog-item"
        :class="{'active-catalog':isAll}"
        @click="clickAllCatalog()"
      >
        全部
      </div>
      <div
        v-for="(catalog,index) in catalogList"
        :key="index"
        class="side-catalog-item"
        :class="{'active-catalog':activeCatalog.code === catalog.code && !isAll}"
        @mouseenter="mouseenter(catalog.code)"
        @mouseleave="mouseleave"
        @click="clickCatalog(catalog)"
      >
        <span class="catalog-name">{{ catalog.name }}</span>
        <el-dropdown
          :class="{'dropdown-show':(showDropdown && hoverItem === catalog.code) || activeCatalog.code === catalog.code}"
          class="page-list-dropdown"
          placement="bottom-start"
          node-key="id"
          trigger="click"
        >
          <span class="el-dropdown-link menu-dropdown-link">
            <i
              class="el-icon-more"
              :class="{'active-icon-more':activeCatalog.code === catalog.code && !isAll}"
            />
            <el-dropdown-menu
              slot="dropdown"
              class="dropdown-menu-box db-el-dropdown-menu"
            >
              <el-dropdown-item @click.native="catalogEdit(catalog)">
                编辑
              </el-dropdown-item>
              <el-dropdown-item
                class="delete-item"
                @click.native="catalogDel(catalog)"
              >
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </span>
        </el-dropdown>
      </div>
    </el-scrollbar>
    <div
      class="add-catalog-box"
      @click="catalogAdd"
    >
      <i class="el-icon-plus" />
      <div>新建分组</div>
    </div>
    <!-- 新增或编辑目录弹窗 -->
    <el-dialog
      :title="currentCatalog.code ? '编辑分组':'新建分组'"
      :visible.sync="catalogVisible"
      :append-to-body="true"
      custom-class="db-el-dialog"
      width="30%"
      class="db-dialog-wrap db-el-dialog"
      @close="handleClose"
    >
      <el-form
        ref="form"
        :model="currentCatalog"
        label-width="80px"
        :rules="formRules"
      >
        <el-form-item
          label="分组名称"
          prop="name"
        >
          <el-input
            v-model="currentCatalog.name"
            class="db-el-input"
          />
        </el-form-item>
        <el-form-item
          label="排序"
        >
          <el-input-number
            v-model="currentCatalog.orderNum"
            :min="0"
            :max="30000"
            controls-position="right"
            class="db-el-input-number"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="db-el-button-default"
          @click="catalogVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="addOrEditCatalog"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { get, post } from 'dashPackages/js/utils/http'
import _ from 'lodash'

export default {
  components: { },
  props: {
    type: {
      type: String,
      default: 'dashboardCatalog'
    }
  },
  data () {
    const validateName = (rule, value, callback) => {
      this.$dashboardAxios.post('/dashboard/type/nameRepeat', {
        id: this.currentCatalog.id,
        name: value,
        type: 'resourceCatalog'
      }, true).then((r) => {
        if (r.data) {
          callback(new Error('分组名称已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      showDropdown: false,
      hoverItem: null,
      isAll: true,
      catalogList: [],
      catalogVisible: false,
      activeCatalog: { // 激活的目录,点击其他非目录按钮时需要保持当前的菜单激活状态
        name: '',
        id: '',
        code: ''
      },
      currentCatalog: { // 选中目录
        name: '',
        id: '',
        code: '',
        orderNum: 0
      },
      formRules: {
        name: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getCatalogList()
  },
  methods: {
    mouseenter (code) {
      this.showDropdown = true
      this.hoverItem = code
    },
    mouseleave () {
      this.showDropdown = false
    },
    // 点击全部
    clickAllCatalog () {
      this.isAll = true
      this.$emit('getPageInfo', { isAll: true, page: { id: '', code: '', name: '' } })
    },
    // 点击目录
    clickCatalog (catalog) {
      this.currentCatalog = _.cloneDeep(catalog)
      this.activeCatalog = _.cloneDeep(catalog)
      this.isAll = false
      this.$emit('getPageInfo', { isAll: false, page: catalog })
    },
    // 关闭目录弹窗
    handleClose () {
      this.catalogVisible = false
      this.$refs.form.clearValidate()
    },
    // 新增编辑目录（点击确定）
    addOrEditCatalog () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return
        }
        if (!this.currentCatalog.id) {
          this.$dashboardAxios.post('/dashboard/type/add',
            {
              ...this.currentCatalog,
              type: this.type || 'dashboardCatalog'
            }).then(data => {
            this.catalogVisible = false
            this.getCatalogList()
            this.flag = true
            // 关闭页面菜单的弹窗
            this.closePageMenuDialog()
          }).catch(() => {
          })
        } else {
          this.$dashboardAxios.post('/dashboard/type/update', { ...this.currentCatalog, type: this.type || 'dashboardCatalog' }).then(data => {
            this.catalogVisible = false
            this.getCatalogList()
          }).catch(() => {
          })
        }
      })
    },
    // 新增目录
    catalogAdd () {
      this.catalogVisible = true
      this.currentCatalog = { // 选中目录
        name: '',
        id: '',
        code: '',
        orderNum: 0
      }
    },
    // 编辑目录
    catalogEdit () {
      this.catalogVisible = true
    },
    // 删除目录
    catalogDel (catalog) {
      this.$confirm('确定删除该分组？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      }).then(async () => {
        this.$dashboardAxios.post(`/dashboard/type/delete/${catalog.id}`).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getCatalogList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        })
      }).catch()
    },
    // 获取目录的列表
    getCatalogList () {
      this.pageLoading = true
      this.$dashboardAxios.get(`/dashboard/type/list/${this.type}`).then(data => {
        this.catalogList = data
      }).catch(() => {
      }).finally(() => {
        this.pageLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../assets/style/bsTheme.scss';
  .side-catalog-wrap{
    // border-right : 1px solid #e8e8e8;
    // margin-top: 16px;
    padding-top: 16px;
    width: 220px;
    // height: 100%;
    box-sizing: border-box;
    color: var(--db-el-title);
    background-color: var(--db-background-2);
    .side-catalog-box{
      height: calc(100% - 50px);
      overflow-y: auto;
      .side-catalog-all{
        font-weight: bold;
      }
      .side-catalog-item{
        width: 100%;
        padding: 0 16px;
        display: flex;
        line-height: 36px;
        justify-content: space-between;
        &:hover{
          cursor: pointer;
        }
        .el-icon-more{
          transform: rotate(90deg);
          color: var(--db-el-title);
          font-weight: 400;
        }
        .active-icon-more{
          color:var(--db-el-text);
        }
        .catalog-name{
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow:ellipsis;
        }
        .page-list-dropdown{
          opacity: 0;
        }
        .dropdown-show{
          opacity: 1;
        }
      }
      /*菜单激活时的样式*/
      .active-catalog{
        position: relative;
        // border-left: 4px solid var(--db-el-color-primary);
        background: var(--db-background-primary);
        color: var(--db-el-color-primary);
        &::after{
          content: '';
          position: absolute;
          left: 0;
          width: 4px;
          height: 36px;
          background-color: var(--db-el-color-primary);
        }
        // background-image: linear-gradient(to right , var(--db-el-color-primary), var(--db-background-2));
        // background-repeat: round;
        // color: var(--db-el-text);
      }
    }
    .add-catalog-box{
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      margin: 0 8px;
      &:hover{
        background-color: rgba(0, 122, 255, 0.0627451);
        cursor: pointer;
        color: var(--db-el-text);;
      }
      .el-icon-plus{
        padding: 0 5px;
      }
    }

  }
  .dropdown-menu-box{
    left: 50%;
    transform: translateX(-40%);
    width: 100px!important;
    ::v-deep .el-dropdown-menu__item{
      text-align: center;
      padding: 5px;
    }
    ::v-deep .popper__arrow{
      left: 50% !important;
      transform: translateX(-50%) !important;
    }
  }
</style>
