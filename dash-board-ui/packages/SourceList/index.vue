<template>
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
        v-model="extend"
        class="db-el-select"
        popper-class="db-el-select"
        placeholder="请选择图片格式"
        clearable
        @change="reSearch"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        size="small"
        style="margin-right: 20px"
        type="primary"
        @click="reSearch"
      >
        搜索
      </el-button>
      <el-upload
        class="upload-demo"
        :action="upLoadUrl"
        :headers="headers"
        :data="{ module: code }"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        multiple
        :file-list="fileList"
        :show-file-list="false"
      >
        <el-button
          size="small"
          type="primary"
        >
          上传资源
        </el-button>
      </el-upload>
    </div>
    <div
      v-if="list.length !== 0"
      v-loading="loading"
      class="list-wrap db-scrollbar"
      element-loading-text="加载中"
      :style="{
        display: gridComputed ? 'grid' : 'flex',
        justifyContent: gridComputed ? 'space-around' : 'flex-start'
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
                  class="circle"
                  @click="downLoad(screen)"
                >
                  <span>下载</span>
                </div>
                <div
                  class="circle"
                  @click="del(screen)"
                >
                  <span>删除</span>
                </div>
                <div
                  class="circle"
                  @click="copy(screen)"
                >
                  <span>链接</span>
                </div>
              </div>
            </div>
          </div>
          <div class="dashboard-card-img">
            <el-image
              :src="screen.url"
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
      ref="EditForm"
      @refreshData="reSearch"
    />
  </div>
</template>
<script>
import { get, post, download } from 'packages/js/utils/http'
import { pageMixins } from 'packages/js/mixins/page'
import EditForm from './EditForm.vue'
export default {
  name: 'BigScreenList',
  mixins: [pageMixins],
  props: {
    type: {
      type: String,
      default: 'dashboard' // dashboard | template
    },
    catalogInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: { EditForm },
  data () {
    return {
      upLoadUrl:
        window.DS_CONFIG?.httpConfigs?.baseURL + '/dashboard/file/upload',
      searchKey: '',
      extend: '',
      options: [],
      list: [],
      fileUploadParam: {},
      headers: {
        ...window.DS_CONFIG?.httpConfigs?.headers
      },
      fileList: [],
      defaultImg: require('./images/defaultImg.png'),
      loading: false
    }
  },
  computed: {
    code () {
      return this.catalogInfo?.page?.id
    },
    gridComputed () {
      return this.list.length > 3
    }
  },
  watch: {
    code (value) {
      this.current = 1
      this.getDataList()
    }
  },
  mounted () {
    this.getOptions()
    this.getDataList()
  },
  methods: {
    uploadError (err, file, fileList) {
    },
    uploadSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.getDataList()
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    getOptions () {
      get('/dashboard/file/getAllFileSuffix').then((data) => {
        data.forEach((item) => this.options.push({ label: item, value: item }))
      })
    },
    getDataList () {
      this.loading = true
      get('/dashboard/file', {
        module: this.catalogInfo.page.id,
        current: this.current,
        size: this.size,
        extension: this.extend,
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
    preview (screen) {
      window.open(screen.url, '_blank')
    },
    downLoad (screen) {
      download(`/dashboard/file/download/${screen.id}`)
    },
    del (screen) {
      this.$confirm('确定删除该资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      })
        .then(async () => {
          post(`/dashboard/file/delete/${screen.id}`)
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
      this.$message.success('复制成功')
      const transfer = document.createElement('input')
      document.body.appendChild(transfer)
      transfer.value = screen.url // 这里表示想要复制的内容
      transfer.focus()
      transfer.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      transfer.blur()
      transfer.style.display = 'none'
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
      height: 230px;
      cursor: pointer;

      &:hover {
        .screen-card__hover {
          height: 230px;
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
          height: 180px;

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
.empty {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
