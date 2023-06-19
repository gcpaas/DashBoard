<!--
 * @description: 选择图标公共组件
 * @Date: 2022-09-02 10:42:33
 * @Author: xingheng
-->

<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="选择图标"
      :visible.sync="formVisible"
      :append-to-body="true"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="图标">
          <div class="color-select">
            <div
              v-for="color in predefineColors"
              :key="color"
              :style="{ 'background-color': color }"
              @click="dataForm.iconColor = color"
            >
              <i
                v-if="dataForm.iconColor === color"
                class="el-icon-check"
              />
            </div>
            <el-color-picker v-model="dataForm.iconColor" />
          </div>
          <div class="icon-list">
            <el-scrollbar>
              <el-row
                v-for="(item, index) in iconList"
                :key="index"
                style="margin-top: 5px; text-align: center"
              >
                <el-col
                  v-for="icon in item"
                  :key="icon"
                  :xs="12"
                  :sm="6"
                  :md="4"
                  :lg="2"
                  :xl="2"
                >
                  <el-button
                    :key="icon + index"
                    :class="{ 'is-active': icon === dataForm.icon }"
                    :style="{
                      'background-color':
                        dataForm.icon === icon ? dataForm.iconColor : '',
                    }"
                    @click="dataForm.icon = icon"
                  >
                    <icon-svg
                      :style="{
                        fill:
                          dataForm.icon === icon
                            ? dataForm.iconColor === '#FFFFFF'
                              ? '#9e9e9e'
                              : '#FFFFFF'
                            : '#9e9e9e',
                      }"
                      :name="icon"
                    />
                  </el-button>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="chooseIcon"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <div
      class="icon-wrap"
      :style="{ 'background-color': dataForm.iconColor }"
      @click="showChooseIcon"
    >
      <icon-svg
        class="img-btn-svg"
        :style="{
          fill: (dataForm.iconColor) === '#FFFFFF' ? '#0000000' : '#FFFFFF',
        }"
        :name="dataForm.icon"
      />
    </div>
  </div>
</template>

<script>
import Icon from 'packages/assets/images/appPrependIcon/export'
import IconSvg from 'packages/SvgIcon'
import _ from 'lodash'
export default {
  name: 'IconChoose',
  components: { IconSvg },
  props: {
    link: {
      type: Object,
      default: () => {
        return {
          icon: '',
          iconColor: '#FFFFFF'
        }
      }
    }
  },
  data () {
    return {
      formVisible: false,
      loading: false,
      dataForm: {
        index: 0,
        icon: Icon.getNameList()[0],
        iconColor: '#007aff'
      },
      // 预设颜色
      predefineColors: [
        '#007aff',
        '#1aa97b',
        '#ff4d53',
        '#1890FF',
        '#DF0E1B',
        '#0086CC',
        '#2B74CF',
        '#00BC9D',
        '#ED7D32'
      ],
      iconList: []
    }
  },
  watch: {
    link: {
      handler (val) {
        this.dataForm = _.cloneDeep(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.getIcon()
    this.dataForm = _.cloneDeep(this.link)
  },
  methods: {
    // 初始化, 如果有则是编辑，直接复制
    init (iconInfo) {
      this.formVisible = true
      this.$nextTick(() => {
        if (iconInfo.icon) {
          this.dataForm.index = iconInfo.index
          this.dataForm.iconColor = iconInfo.iconColor || '#007aff'
          this.dataForm.icon = iconInfo.icon || Icon.getNameList()[0]
          this.link.icon = this.dataForm.icon
          this.link.iconColor = this.dataForm.iconColor
        } else {
          this.dataForm.index = 0
          this.dataForm.iconColor = '#007aff'
          this.dataForm.icon = Icon.getNameList()[0]
        }
      })
    },
    // 新增/编辑
    chooseIcon () {
      this.formVisible = false
      this.$emit('chooseIcon', this.dataForm)
    },
    // 图标数据
    getIcon () {
      const tempIcoList = []
      const icoList = Icon.getNameList()
      this.dataForm.icon = icoList[0]
      const rowSize = Math.ceil(icoList.length / 24)
      for (let i = 1; i <= rowSize; i++) {
        tempIcoList.push([])
      }

      for (let i = 0; i < icoList.length; i++) {
        const index = Math.floor(i / 24)
        tempIcoList[index].push(icoList[i])
      }
      this.iconList = tempIcoList
    },
    cancel () {
      this.formVisible = false
      this.$refs['dataForm'].clearValidate()
    },
    showChooseIcon () {
      this.$emit('showChooseIcon')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-wrap {
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-dialog__body {
  overflow-y: hidden;
}
.el-scrollbar {
  height: 300px;
  overflow-x: hidden;
}
.color-picker {
  display: flex;
  align-items: center;
}

.icon-svg {
  width: 25px;
  height: 25px;
}

.color-select {
  width: 350px;
  display: flex;
  margin-top: 5px;
  align-items: center;
  justify-content: space-between;

  div {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: relative;
  }

  ::v-deep .el-color-picker__trigger {
    top: 0;
    right: 0;
    width: 21px;
    height: 21px;
    padding: 0;
  }

  .el-icon-check {
    font-size: 20px;
    color: #ffffff;
    position: absolute;
  }
}

.icon-list {
  margin-top: 15px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;

  .el-button--mini {
    min-width: 37px;
    padding: 5px !important;
    border: 1px solid transparent !important;

    &:hover {
      background-color: rgba(217, 217, 217, 0.3);
    }
  }
}

.icon-uploader {
  width: 60px;
  height: 60px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color:  #007aff;

    i {
      color: #007aff;
    }
  }

  // .icon-svg {
  //   padding: 5px;
  //   width: 60px !important;
  //   height: 60px !important;
  // }
}

.icon-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.icon {
  width: 60px;
  height: 60px;
  display: block;
}
</style>
