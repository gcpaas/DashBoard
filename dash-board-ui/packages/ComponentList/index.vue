<template>
  <div class="dashboard-list-wrap">
    <div class="top-search-wrap">
      <el-select
        v-if="catalogInfo !== 'system'"
        v-model="catalogCode"
        class="db-el-select"
        popper-class="db-el-select"
        placeholder="请选择分组"
        clearable
        @change="reSearch"
      >
        <el-option
          v-for="item in catalogList"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
      <el-input
        v-model="name"
        class="db-el-input"
        placeholder="请输入组件名称"
        prefix-icon="el-icon-search"
        clearable
        @clear="reSearch"
        @keyup.enter.native="reSearch"
      />
      <el-button
        type="primary"
        @click="reSearch"
      >
        搜索
      </el-button>
      <el-button
        v-if="catalogInfo !== 'system'"
        type="primary"
        @click="catalogManage"
      >
        分组管理
      </el-button>
    </div>
    <div
      v-loading="loading"
      class="list-wrap db-scrollbar"
      element-loading-text="加载中"
      :style="{
        display: gridComputed ? 'grid' : 'flex',
        justifyContent: gridComputed ? 'space-around' : 'flex-start'
      }"
    >
      <!-- 第一个是新增仪表盘卡片 -->
      <div
        v-if="catalogInfo !== 'system'"
        class="dashboard-card-wrap"
        :style="{
          width: gridComputed ? 'auto' : '290px'
        }"
        @click="add"
      >
        <div class="dashboard-card-inner dashboard-card-inner-add">
          <div class="add-dashboard-card">
            <div class="add-dashboard-card-inner">
              <div class="add-dashboard-card-text">
                新建组件
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 后面遍历 list -->
      <div
        v-for="screen in list"
        :key="screen.id"
        class="dashboard-card-wrap"
        :style="{
          width: gridComputed ? 'auto' : '290px'
        }"
      >
        <div class="dashboard-card-inner">
          <div class="screen-card__hover">
            <div class="screen-card__hover-box">
              <div class="preview">
                <div
                  class="screen-card__oper-label circle"
                  @click="preview(screen)"
                >
                  <span>预览</span>
                </div>
                <div
                  v-if="catalogInfo !== 'system'"
                  class="circle"
                  @click="design(screen)"
                >
                  <span>设计</span>
                </div>
                <div
                  v-if="catalogInfo !== 'system'"
                  class="circle"
                  @click="edit(screen)"
                >
                  <span>编辑</span>
                </div>
                <div
                  v-if="catalogInfo !== 'system'"
                  class="circle"
                  @click="copy(screen)"
                >
                  <span>复制</span>
                </div>
                <div
                  v-if="catalogInfo !== 'system'"
                  class="circle"
                  @click="del(screen)"
                >
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
          <div class="dashboard-card-img">
            <el-image
              :src="catalogInfo !== 'system'?screen.coverPicture:screen.img"
              fit="fill"
              style="width: 100%; height: 100%"
            >
              <div
                slot="placeholder"
                class="image-slot"
              >
                加载中···
              </div>
              <div
                slot="error"
                class="image-slot"
                style="font-size: 20px"
              >
                <div class="error-img-text">
                  {{ catalogInfo !== 'system'? screen.name : screen.title }}
                </div>
              </div>
            </el-image>
          </div>
          <div class="dashboard-bottom">
            <div
              class="left-bigscreen-title"
              :title="catalogInfo !== 'system'? screen.name : screen.title"
            >
              {{ catalogInfo !== 'system'? screen.name : screen.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-pagination-wrap"  v-if="catalogInfo !== 'system'">
      <!-- <div class="footer-pagination-wrap-text">
        总共 {{ totalCount }} 个项目
      </div> -->
      <div class="db-pagination">
        <el-pagination
          class="db-el-pagination"
          popper-class="db-el-pagination"
          background
          layout="total, prev, pager, next, sizes"
          :page-size="size"
          prev-text="上一页"
          next-text="下一页"
          :total="totalCount"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="current"
          @current-change="currentChangeHandle"
          @size-change="sizeChangeHandle"
        />
      </div>
    </div>
    <!-- 新增或编辑弹窗 -->
    <EditForm
      v-if="catalogInfo !== 'system'"
      ref="EditForm"
      :type="catalogInfo"
      @refreshData="reSearch"
    />
    <CatalogEditForm
      v-if="catalogInfo !== 'system'"
      ref="CatalogEditForm"
      :catalog-type="catalogType"
      @updateCatalogList="updateCatalogList"
    />
  </div>
</template>
<script>
import { get, post } from 'packages/js/utils/http'
import { pageMixins } from 'packages/js/mixins/page'
import EditForm from './EditForm.vue'
import CatalogEditForm from './CatalogEditForm'
import innerRemoteComponents, { getRemoteComponents } from 'packages/RemoteComponents/remoteComponentsList'
export default {
  name: 'BigScreenList',
  mixins: [pageMixins],
  props: {
    catalogInfo: {
      type: String,
      default: ''
    }
  },
  components: { EditForm, CatalogEditForm },
  data () {
    return {
      name: '',
      catalogVisible: false,
      templateLoading: false,
      searchKey: '',
      list: [],
      defaultImg: require('./images/defaultImg.png'),
      loading: false,
      catalogList: [], // 分组列表
      catalogCode: ''
    }
  },
  computed: {
    catalogType () {
      if (this.catalogInfo === 'component') {
        return 'componentCatalog'
      } else {
        return 'bizComponentCatalog'
      }
    },
    code () {
      // return this.catalogInfo?.page?.code
      return ''
    },
    gridComputed () {
      return this.list.length > 2
    }
  },
  watch: {
    catalogInfo () {
      this.init()
    },
    catalogCode (value) {
      this.reSearch()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.catalogInfo !== 'system') {
        this.getDataList()
        this.getCatalogList()
      } else {
        this.list = []
        this.list = [...innerRemoteComponents, ...getRemoteComponents()]
      }
    },
    updateCatalogList (list) {
      this.catalogList = list
    },
    reSearch () {
      if (this.catalogInfo !== 'system') {
        this.current = 1
        this.getDataList()
      } else {
        const arr = [...innerRemoteComponents, ...getRemoteComponents()]
        this.list = arr?.filter((item) => item.title.indexOf(this.name) !== -1)
      }
    },
    // 分组管理
    catalogManage () {
      this.$refs.CatalogEditForm.formVisible = true
    },
    // 获取分组列表
    getCatalogList () {
      get(`/dashboard/type/list/${this.catalogType}`)
        .then((data) => {
          this.catalogList = data
        })
        .catch(() => {})
    },
    getDataList () {
      this.loading = true
      if (this.catalogInfo === 'component') {
        get('/dashboard/design/page', {
          parentCode: this.catalogCode || null,
          current: this.current,
          size: this.size,
          searchKey: this.searchKey,
          type: 'component'
        })
          .then((data) => {
            this.list = data.list
            this.totalCount = data.totalCount
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        get('/dashboard/bizComponent/page', {
          current: this.current,
          size: this.size,
          searchKey: this.searchKey,
          name: this.name,
          type: this.catalogCode || null
        })
          .then((data) => {
            this.list = data.list
            this.totalCount = data.totalCount
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    preview (screen) {
      let path = ''
      let query = {
        code: screen.code
      }
      if (this.catalogInfo === 'component') {
        path = (window.DS_CONFIG?.routers?.previewUrl || '/dashboard/preview')
      } else {
        path = (window.DS_CONFIG?.routers?.bizComponentPreviewUrl || 'dashboard-biz-component-preview')
      }
      if (this.catalogInfo === 'system') {
        query = {
          dirName: screen.customize.vueSysComponentDirName
        }
      }
      const { href } = this.$router.resolve({
        path, // 这里写的是要跳转的路由地址
        query
      })
      window.open(href, '_blank')
    },
    design (screen) {
      const path = this.catalogInfo === 'component' ? (window.DS_CONFIG?.routers?.designUrl || '/dashboard/design') : (window.DS_CONFIG?.routers?.bizComponentDesignUrl || 'dashboard-biz-component-design')
      const { href } = this.$router.resolve({
        path,
        query: {
          code: screen.code
        }
      })
      window.open(href, '_self')
    },
    add () {
      const page = {
        code: '',
        type: this.catalogInfo === 'component' ? 'dashboard' : 'bizComponent'
      }
      this.$refs.EditForm.init(page, this.catalogCode)
    },
    edit (screen) {
      this.$refs.EditForm.init(screen, this.catalogCode)
    },
    del (screen) {
      this.$confirm('确定删除该组件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      })
        .then(async () => {
          const url = this.catalogInfo === 'component' ? `/dashboard/design/delete/${screen.code}` : `/dashboard/bizComponent/delete/${screen.id}`
          post(url)
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getDataList()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
        })
        .catch()
    },
    copy (screen) {
      const url = this.catalogInfo === 'component' ? `/dashboard/design/copy/${screen.code}` : `/dashboard/bizComponent/copy/${screen.code}`
      this.$confirm('确定复制该组件', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      })
        .then(async () => {
          post(url)
            .then(() => {
              this.$message({
                type: 'success',
                message: '复制成功'
              })
              this.getDataList()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '复制失败!'
              })
            })
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~packages/assets/style/bsTheme.scss';
.dashboard-list-wrap {
  position: relative;
  height: 100%;
  padding: 16px;
  color: #9ea9b2;
  background-color: var(--db-background-leftPanel) !important;

  .top-search-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 12px;

    .el-input {
      width: 200px;
      margin-right: 20px;
      /deep/.el-input__inner {
        // background-color: #232832 !important;
      }
    }

    .el-select {
      margin-right: 20px;
      /deep/.el-input__inner {
        // background-color: #232832 !important;
      }
    }
  }

  .list-wrap {
    /* display: grid; */
    overflow: auto;
    // 间隙自适应
    justify-content: space-around;
    max-height: calc(100vh - 270px);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 15px;

    /deep/ .el-loading-mask {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 260px) !important;
      z-index: 999;
      top: 50px;
    }

    .dashboard-card-wrap {
      position: relative;
      height: 180px;
      cursor: pointer;

      &:hover {
        .screen-card__hover {
          height: 180px;
        }
      }

      .screen-card__hover {
        position: absolute;
        z-index: 999;
        top: 0;
        right: 0;
        left: 0;
        display: flex;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        height: 0;
        transition: height 0.4s;
        background: #00000099;
        .screen-card__hover-box {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #00000080;
          display: flex;
          overflow: hidden;
          align-items: center;
          justify-content: center;
        }
        .preview {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          width: 100%;
          cursor: pointer;
          color: var(--db-el-color-primary);

          .circle {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border: 1px solid var(--db-el-color-primary);
            border-radius: 50%;

            &:hover {
              color: #fff;
              background: var(--db-el-color-primary);
            }

            span {
              font-size: 12px;
            }
          }
        }
      }

      .dashboard-card-inner {
        overflow: hidden;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background-color: var(--db-background-2);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        color: var(--db-el-title);
        border: 1px solid var(--db-background-2);
        &:hover {
          color: var(--db-el-text);
          border: 1px solid var(--db-el-color-primary);
        }

        .add-dashboard-card-text {
          font-size: 24px;
        }

        .dashboard-card-img {
          width: 100%;
          height: 150px;

          img {
            width: 100%;
            height: 100%;

            object-fit: cover;
          }

          /deep/.image-slot {
            height: 100%;
            background-color: var(--db-background-2);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /deep/.el-image__error {
            // background-color: #1d1d1d;
          }
        }

        .dashboard-bottom {
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
          box-sizing: border-box;
          width: 100%;
          /*height: 26px;*/
          padding: 0 10px;
          height: calc(100% - 150px);
          color: var(--db-el-title);
          background-color: var(--db-background-2);

          .left-bigscreen-title {
            font-size: 14px;
            overflow: hidden;
            width: 120px;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .right-bigscreen-time-title {
            font-size: 14px;
            overflow: hidden;
            width: 140px;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        .dashboard-card-text {
          font-size: 14px;
          padding: 10px;
          text-align: center;
          color: #333;
        }
      }

      .dashboard-card-inner-add {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .error-img-text{
      overflow:hidden;
      padding:0 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
    }
  }

  .el-loading-parent--relative {
    position: unset !important;
  }

  .footer-pagination-wrap {
    position: absolute;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-top: 20px;
    padding: 0 20px;
  }
}
// .db-pagination {
//   ::v-deep .el-input__inner {
//     width: 110px !important;
//     border: none;
//     background: var(--db-el-background-2);
//   }
// }
</style>
