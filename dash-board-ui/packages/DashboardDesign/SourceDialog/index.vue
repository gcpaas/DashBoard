<template>
  <el-dialog
    title="资源库"
    :visible.sync="dialogVisible"
    width="80%"
    :modal="true"
    :modal-append-to-body="false"
    :appen-to-body="true"
    class="db-dialog-wrap db-el-dialog"
    @closed="close"
  >
    <div class="content">
      <div class="dashboard-list-wrap">
        <div class="top-search-wrap">
          <el-input
            v-model="searchKey"
            class="db-el-input"
            placeholder="请输入图片名称"
            prefix-icon="el-icon-search"
            clearable
            @clear="reSearch"
            @keyup.enter.native="reSearch"
          />
          <el-select
            v-model="code"
            class="db-el-select"
            popper-class="db-el-select"
            placeholder="请选择分组"
            clearable
            @change="reSearch"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button
            size="small"
            type="primary"
            @click="reSearch"
          >
            搜索
          </el-button>
        </div>
        <div
          v-if="list.length !== 0"
          v-loading="loading"
          class="list-wrap db-scrollbar"
          element-loading-text="加载中"
          :style="{
            display: gridComputed ? 'grid' : 'flex',
            justifyContent: gridComputed ? 'space-around' : 'flex-start',
            height:'calc(100vh - 370px)'
          }"
        >
          <!-- <div v-if="list.length !== 0"> -->
          <div
            v-for="screen in list"
            :key="screen.id"
            class="dashboard-card-wrap"
            :style="{
              width: gridComputed ? 'auto' : '290px'
            }"
            @click="chooseImg(screen)"
          >
            <div
              :class="focus.id == screen.id ? 'focus' : ''"
              class="dashboard-card-inner"
            >
              <div class="dashboard-card-img">
                <el-image
                  :src="getCoverPicture(screen.url)"
                  fit="contain"
                  style="width: 100%; height: 100%"
                >
                  <div
                    slot="placeholder"
                    class="image-slot"
                  >
                    加载中···
                  </div>
                </el-image>
              </div>
              <div class="dashboard-bottom">
                <div
                  class="left-bigscreen-title"
                  :title="screen.originalName"
                >
                  {{ screen.originalName }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="empty"
        >
          暂无数据
        </div>
        <div class="footer-pagination-wrap">
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
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="db-el-button-default"
        @click="dialogVisible = false"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确定
      </el-button>
      <el-button
        type='primary'
        @click="jumpto"
      >
        资源管理
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
// import { get } from 'dashPackages/js/utils/http'
import { pageMixins } from 'dashPackages/js/mixins/page'
import { getFileUrl } from 'dashPackages/js/utils/file'

import _ from 'lodash'
export default {
  name: 'SourceDialog',
  mixins: [pageMixins],
  props: {},
  data () {
    return {
      dialogVisible: false,
      loading: false,
      options: [],
      code: '',
      focus: -1,
      list: [],
      searchKey: '',
      imgExtends: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico']
    }
  },
  computed: {
    gridComputed () {
      return this.list.length > 3
    }
  },
  mounted () {},
  methods: {
     jumpto(){
      let {href} = this.$router.resolve(`/dashboard-redirect?edit=source`)
      window.open(href,'_blank')
    },
    chooseImg (img) {
      this.focus = _.cloneDeep(img)
    },
    close () {},
    init () {
      this.dialogVisible = true
      this.current = 1
      this.searchKey = ''
      this.code = ''
      this.focus = -1
      this.getDataList()
      this.getCatalogList()
    },
    confirm () {
      this.dialogVisible = false
      if (this.focus !== -1) {
        this.$emit('getImg', this.focus)
      }
    },
    getDataList () {
      this.loading = true
      this.$dashboardAxios.get('/dashboard/file', {
        module: this.code,
        current: this.current,
        size: this.size,
        // 资源库中只显示图片类型的文件
        extensionList: this.imgExtends,
        searchKey: this.searchKey
      })
        .then((data) => {
          this.list = data.list
          this.totalCount = data.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取目录的列表
    getCatalogList () {
      this.$dashboardAxios.get('/dashboard/type/list/resourceCatalog')
        .then((data) => {
          this.options = data
        })
        .catch(() => {})
    },
    /**
     * 获取封面图片,如果是相对路径则拼接上文件访问前缀地址
     * @param url
     * @returns {*}
     */
    getCoverPicture (url) {
      return getFileUrl(url)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/bsTheme.scss';
.content{
  height: calc(100vh - 290px);
}
.dashboard-list-wrap {
  position: relative;
  height: 100%;
  // padding: 16px;
  // margin: 16px;
  color: #9ea9b2;
  background-color: var(--db-background-2);
  // border: 1px solid #e8e8e8;
  // background-color: var(--db-background-1) !important;

  .top-search-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 12px;

    .el-input {
      width: 200px;
      margin-right: 20px;
      ::v-deep .el-input__inner {
        // background-color: #232832 !important;
      }
    }

    .el-select {
      width: 200px !important;
      margin-right: 20px;
      ::v-deep .el-input__inner {
        // background-color: #232832 !important;
      }
    }
  }

  .list-wrap {
    /* display: grid; */
    overflow: auto;
    // 间隙自适应
    justify-content: space-around;
    // max-height: calc(100vh - 270px);
    padding: 2px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 15px;

    ::v-deep  .el-loading-mask {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 260px) !important;
      z-index: 999;
      top: 50px;
    }

    .dashboard-card-wrap {
      position: relative;
      height: 230px;
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
      }

      .focus {
        color: var(--db-el-text) !important;
        border: 1px solid var(--db-el-color-primary) !important;
      }

      .dashboard-card-inner {
        overflow: hidden;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background-color: var(--db-background-2);
        margin-bottom: 2px;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid transparent;
        color: var(--db-el-title);
        &:hover {
          color: var(--db-el-text);
          border: 1px solid var(--db-el-color-primary);
        }

        .add-dashboard-card-text {
          color: var(--db-el-color-primary);
          font-size: 24px;
        }

        .dashboard-card-img {
          width: 100%;
          height: 180px;

          img {
            width: 100%;
            height: 100%;

            object-fit: cover;
          }

          ::v-deep .image-slot {
            height: 100%;
            background-color: var(--db-background-2);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          ::v-deep .el-image__error {
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
          height: calc(100% - 180px);
          color: var(--db-el-title);
          background-color: var(--db-background-2);

          .left-bigscreen-title {
            font-size: 14px;
            overflow: hidden;
            width: 100%;
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
  }

  .el-loading-parent--relative {
    position: unset !important;
  }

  .footer-pagination-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    padding: 0 20px;
    margin-top: 8px;
  }
}
// .db-pagination {
//   ::v-deep  .el-input__inner {
//     width: 110px !important;
//     border: none;
//     background: var(--db-el-background-2);
//   }
// }
.empty {
  width: 100%;
  height: 70%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep  .el-dialog__footer{
  padding-right: 30px !important;
}
</style>
