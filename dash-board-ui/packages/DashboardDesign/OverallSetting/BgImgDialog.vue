<template>
  <el-dialog
    title="背景图"
    :visible.sync="dialogVisible"
    width="50%"
    :modal="true"
    :modal-append-to-body="false"
    :appen-to-body="true"
    class="db-dialog-wrap db-el-dialog"
    @closed="$emit('imgUrl', imgUrl)"
  >
    <div>
      <el-upload
        ref="uploadDeviceRealImg"
        accept=".jpg,.jpeg,.PNG,.JPG"
        list-type="picture-card"
        :action="actionUrl"
        :limit="1"
        :on-success="uploadImg"
        :file-list="fileList"
        :data="fileUploadParam"
        :headers="headers"
        :on-remove="removeImg"
        :before-upload="beforeUpload"
        :auto-upload="true"
      >
        <el-button
          :style="{ display: hideUploadImgBtn ? 'none' : '' }"
          type="primary"
        >
          上传背景图
        </el-button>
      </el-upload>
      <div>
        或链接地址：
        <el-input
          v-model="imgUrl"
          placeholder="请输入链接地址"
          clearable
        />
      </div>
      <div>
        <el-row
          :gutter="8"
          style="margin-top: 8px;"
        >
          <el-col
            v-for="img in bgImgList"
            :key="img.name"
            :md="6"
            :lg="6"
            :xl="6"
            style="max-width: 200px"
          >
            <el-image
              class="bg-img db-el-img"
              :src="img.url"
              fit="cover"
              @click.native="imgUrl = img.url; dialogVisible = false"
            />
          </el-col>
        </el-row>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="db-el-button-default"
        @click="dialogVisible=false"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="confirm"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getFileUrl } from 'dashPackages/js/utils/file'
import * as tokenCacheService from "dashPackages/js/utils/tokenCacheService"


export default {
  name: 'BgImgDialog',
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      hideUploadImgBtn: false,
      bgImgList: [],
      fileList: [],
      imgUrl: '',
      fileUploadParam: {
        module: 'attachment'
      },
      headers: {
        ...window.DS_CONFIG?.httpConfigs?.headers,
        dashBoardToken: tokenCacheService.get()

      },
      actionUrl: window?.DS_CONFIG.httpConfigs?.baseURL + '/dashboard/file/upload'
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    init () {
      this.dialogVisible = true
      this.imgUrl = this.form.bg
      this.fileList =  this.getCoverPicture(this.imgUrl)
        ? [{
            name: '背景图',
            url:  this.getCoverPicture(this.imgUrl)
          }]
        : []
      this.hideUploadImgBtn = this.fileList.length !== 0
      this.$dashboardAxios.get('/dashboard/design/bg/list').then(list => {
        this.bgImgList = list
      })
    },
    uploadImg (response, file) {
      if (response.code !== 200) {
        this.$message.error(response.msg)
        const idx = this.$refs.uploadDeviceRealImg.uploadFiles.findIndex(
          item => item.uid === file.uid
        )
        this.$refs.uploadDeviceRealImg.uploadFiles.splice(idx, 1)
      } else {
        this.dialogVisible = false
        this.hideUploadImgBtn = true
        this.imgUrl = response.data.url
      }
    },
    removeImg (file, fileList) {
      this.hideUploadImgBtn = fileList.length !== 0
      this.imgUrl = ''
    },
    beforeUpload (file) {
      if (file.size > 30 * 1024 * 1024) {
        this.$message.error('上传图片大小不能超过 30MB!')
        return false
      }
      return new Promise(resolve => {
        this.$nextTick(() => {
          resolve()
        })
      })
    },
    confirm () {
      this.dialogVisible = false
    },
    /**
     * 获取图片访问地址,如果是相对路径则拼接上文件访问前缀地址
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
.el-upload-list__item.is-ready,
.el-upload-list__item.is-uploading {
  display: none !important;
}

::v-deep  .el-upload-list__item {
  transition: none !important;
}

::v-deep  .el-upload--picture-card {
  width: 0;
  height: 0;
  display: table-row;
  line-height: 0;
  background-color: transparent;
}

::v-deep  .el-upload-list__item {
  width: 200px;
  height: 150px;
  margin: 0;
}

.bg-img {
  width: 100%;
  height: 100px;
  cursor: pointer;

}
</style>
