<template>
  <div class="dashboard-list-wrap">
    <div class="internal-box">
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
          :before-upload="beforeUpload"
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
            <div
              v-if="imgExtends.includes(screen.extension)"
              class="dashboard-card-img"
            >
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
            <div
              v-else
              class="dashboard-card-img"
            >
              <el-image
                :src="getUrl(screen)"
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
    </div>
    <!-- 新增或编辑弹窗 -->
    <EditForm
      ref="EditForm"
      @refreshData="reSearch"
    />
  </div>
</template>
<script>
// import { get, post, download } from 'dashPackages/js/utils/http'
import { pageMixins } from 'dashPackages/js/mixins/page'
import EditForm from './EditForm.vue'
import { getFileUrl } from 'dashPackages/js/utils/file'

export default {
  name: 'SourceList',
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
      loading: false,
      sourceExtends: window.DS_CONFIG?.sourceExtends || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'xls', 'xlsx', 'csv'],
      imgExtends: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
      otherExtends: {
        video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'f4v', 'rmvb', 'rm', '3gp', 'dat', 'ts', 'mts', 'vob'],
        audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac', 'ape', 'm4a', 'm4r', 'amr', 'ac3'],
        excel: ['xls', 'xlsx', 'csv'],
        word: ['doc', 'docx'],
        ppt: ['ppt', 'pptx'],
        pdf: ['pdf']
      }
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
    getUrl (file) {
      const extension = file.extension
      if (this.otherExtends.video.includes(extension)) {
        return require('./images/video.svg')
      }
      if (this.otherExtends.audio.includes(extension)) {
        return require('./images/audio.svg')
      }
      if (this.otherExtends.excel.includes(extension)) {
        return require('./images/excel.svg')
      }
      if (this.otherExtends.word.includes(extension)) {
        return require('./images/word.svg')
      }
      if (this.otherExtends.ppt.includes(extension)) {
        return require('./images/ppt.svg')
      }
      if (this.otherExtends.pdf.includes(extension)) {
        return require('./images/pdf.svg')
      }
      return require('./images/unknown.svg')
    },
    uploadError (err, file, fileList) {
    },
    beforeUpload (file) {
      // 获取文件后缀
      const extension = file.name.split('.').pop()
      // 判断文件类型是否符合要求
      const isValidFileType = this.sourceExtends.includes(extension)
      if (!isValidFileType) {
        this.$message.error('不支持的文件类型：' + extension)
      }
      return isValidFileType
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
      this.options = []
      this.options.push({ label: '全部', value: '' })
      this.sourceExtends.forEach((ext) => this.options.push({ label: ext, value: ext }))
    },
    getDataList () {
      this.loading = true
      this.$dashboardAxios.get('/dashboard/file', {
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
      window.open(getFileUrl(screen.url), '_blank')
    },
    downLoad (screen) {
      this.$dashboardAxios.download(`/dashboard/file/download/${screen.id}`)
    },
    del (screen) {
      this.$confirm('确定删除该资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'db-el-message-box'
      })
        .then(async () => {
          this.$dashboardAxios.post(`/dashboard/file/delete/${screen.id}`)
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
      transfer.value = getFileUrl(screen.url) // 这里表示想要复制的内容
      transfer.focus()
      transfer.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      transfer.blur()
      transfer.style.display = 'none'
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
@import '../assets/style/bsTheme.scss';
.dashboard-list-wrap {
  position: relative;
  height: 100%;
  margin-left: 16px;
  color: #9ea9b2;
  background-color: var(--db-background-2);
  // background-color: var(--db-background-leftPanel) !important;

  .internal-box {
    height: calc(100% - 32px);
    padding: 16px;
  }

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
    max-height: calc(100% - 90px);
    padding: 2px 3px 10px 2px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 15px;

    ::v-deep  .el-loading-mask {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 290px) !important;
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

        .dashboard-card-img  {
          width: 100%;
          height: 180px !important;

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

        .dashboard-card-img  {
          width: 100%;
          height: 180px !important;

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
    position: absolute;
    bottom: 10px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    padding: 0 20px;
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
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
